// Receives Bland.ai post-call webhooks and turns a completed phone call into a
// lead: posts a formatted alert to Slack (SLACK_WEBHOOK_URL) and writes a
// durable row to the Airtable Leads table — the same destinations the website
// form-to-slack handler uses, so phone leads land alongside web leads.
//
// Configure in Bland: set the pathway's post-call webhook to
//   https://www.inheritedmineralrights.com/.netlify/functions/bland-call-lead
// (or the /api/bland-call-lead alias). The endpoint accepts generic Bland
// payloads — top-level fields, nested `variables` / `pathway_variables`, and a
// few common aliases — without assuming an exact shape.
//
// Optional auth: if BLAND_WEBHOOK_SECRET is set, the request must present it via
// the `x-bland-secret` (or `x-webhook-secret`) header or a `?secret=` query
// param. When the env var is unset, verification is disabled so initial setup
// works without extra configuration.

import {
  json,
  buildLeadSlackMessage,
  postToSlack,
  slackEnabled,
  airtableEnabled,
  airtableCreateLead,
  mapLeadToAirtableFields,
} from "./_shared.mjs";

const WEBHOOK_SECRET = process.env.BLAND_WEBHOOK_SECRET || "";
const DEFAULT_LANDING_PAGE = "https://www.inheritedmineralrights.com/";

function str(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s.slice(0, 4000);
}

// First non-empty string among candidates.
function pick(...values) {
  for (const v of values) {
    const s = str(v);
    if (s != null) return s;
  }
  return null;
}

async function parseBody(req) {
  const raw = await req.text();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    try {
      return Object.fromEntries(new URLSearchParams(raw));
    } catch {
      return null;
    }
  }
}

// Bland nests collected pathway data under `variables` and/or
// `pathway_variables`; some setups also send a flat `metadata` object. Merge
// them under the top-level body so a single lookup resolves a field wherever it
// landed. Top-level keys win over nested ones.
function flatten(body) {
  const b = body && typeof body === "object" ? body : {};
  const nested = [b.pathway_variables, b.pathwayVariables, b.variables, b.metadata, b.data];
  const merged = {};
  for (const obj of nested) {
    if (obj && typeof obj === "object") {
      for (const [k, v] of Object.entries(obj)) {
        if (merged[k] == null) merged[k] = v;
      }
    }
  }
  // Top-level fields take precedence over nested duplicates.
  for (const [k, v] of Object.entries(b)) {
    if (k === "variables" || k === "pathway_variables" || k === "pathwayVariables" || k === "metadata") {
      continue;
    }
    merged[k] = v;
  }
  return merged;
}

// Heuristic priority: a phone lead is High when it shows buying/selling intent,
// names a dollar offer, mentions a deadline, or is already producing / getting
// royalty checks. Everything else is Medium.
function derivePriority(d, intent) {
  const haystack = [
    intent,
    d.summary,
    d.transcript,
    d.offer_amount,
    d.offerAmount,
    d.royalty_check_status,
    d.producing_status,
    d.primary_intent,
    d.disposition,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (pick(d.offer_amount, d.offerAmount, d.offer)) return "High";
  const highSignals = [
    "sell",
    "selling",
    "offer",
    "buy out",
    "buyout",
    "deadline",
    "urgent",
    "asap",
    "producing",
    "royalty check",
    "getting checks",
    "receiving checks",
  ];
  if (highSignals.some((s) => haystack.includes(s))) return "High";
  return "Medium";
}

// Build the multiline Notes value: call summary first, then a compact dump of
// the key collected variables, then links to the recording/transcript and the
// call id so the row is self-contained for follow-up.
function buildNotes(d, { callId, recordingUrl, callLength, status, disposition }) {
  const parts = [];
  const summary = pick(d.summary, d.call_summary, d.analysis_summary);
  if (summary) parts.push(summary);

  const detailPairs = [
    ["Operator / royalty info", pick(d.operator_info, d.operatorInfo, d.operator)],
    ["Producing status", pick(d.royalty_check_status, d.producing_status, d.producing)],
    ["Ownership status", pick(d.ownership_status, d.owner_status)],
    ["Offer amount", pick(d.offer_amount, d.offerAmount, d.offer)],
    ["Call length", callLength],
    ["Call status", status],
    ["Disposition", disposition],
  ].filter(([, v]) => v);
  if (detailPairs.length) {
    parts.push(detailPairs.map(([label, v]) => `${label}: ${v}`).join("\n"));
  }

  const links = [];
  if (recordingUrl) links.push(`Recording: ${recordingUrl}`);
  if (callId) links.push(`Call ID: ${callId}`);
  if (links.length) parts.push(links.join("\n"));

  return parts.length ? parts.join("\n\n") : null;
}

// Pull a representative "questions asked / main reason" string out of the
// collected variables or fall back to the primary intent.
function deriveQuestions(d) {
  return pick(
    d.questions_asked,
    d.questionsAsked,
    d.main_reason,
    d.mainReason,
    d.reason_for_call,
    d.primary_intent,
    d.intent,
  );
}

// Normalize a generic Bland post-call payload into the lead `data` shape that
// mapLeadToAirtableFields and the Slack builder consume. Exported for tests.
export function normalizeBlandCall(body) {
  const d = flatten(body);

  const callId = pick(d.call_id, d.c_id, d.callId, d.id);
  const recordingUrl = pick(d.recording_url, d.recordingUrl, d.recording);
  const callLength = pick(d.call_length, d.callLength, d.duration);
  const status = pick(d.status, d.call_status);
  const disposition = pick(d.disposition, d.outcome);

  // The caller's number. `to` is our Bland DID; `from` is the caller, which is
  // the useful callback number. Prefer an explicit callback field if present.
  const phone = pick(
    d.callback_phone,
    d.callbackPhone,
    d.caller_phone,
    d.callerPhone,
    d.from,
    d.phone_number,
    d.phoneNumber,
    d.phone,
  );

  const intent = pick(d.primary_intent, d.primaryIntent, d.intent) || "Other";

  const name =
    pick(d.full_name, d.fullName, d.name, d.caller_name, d.callerName) ||
    (phone ? `Caller ${phone}` : "Phone caller");

  const submittedAt =
    pick(d.ended_at, d.endedAt, d.started_at, d.startedAt, d.completed_at) ||
    new Date().toISOString();

  const priority = derivePriority(d, intent);

  const data = {
    form_name: "phone-lead",
    source: "Phone",
    intent,
    name,
    phone,
    email: pick(d.email, d.Email),
    state: pick(d.mineral_state, d.mineralState, d.state),
    county: pick(d.mineral_county, d.mineralCounty, d.county),
    operator_info: pick(d.operator_info, d.operatorInfo, d.operator),
    offer_amount: pick(d.offer_amount, d.offerAmount, d.offer),
    producing_status: pick(d.royalty_check_status, d.producing_status, d.producing),
    owner_status: pick(d.ownership_status, d.owner_status),
    notes: buildNotes(d, { callId, recordingUrl, callLength, status, disposition }),
    questions_asked: deriveQuestions(d),
    landing_page: pick(d.landing_page, d.landingPage, d.url) || DEFAULT_LANDING_PAGE,
    utm_source: "phone",
    utm_medium: "call",
    utm_campaign: "inherited_minerals_phone",
    submitted_at: submittedAt,
  };

  return {
    data,
    meta: { callId, recordingUrl, priority, intent, phone, status, disposition },
  };
}

function buildSlackMessage(normalized) {
  const { data, meta } = normalized;
  const metaParts = [];
  if (meta.callId) metaParts.push(`Call ID: ${meta.callId}`);
  if (meta.status) metaParts.push(`Status: ${meta.status}`);
  if (data.submitted_at) metaParts.push(`Ended: ${data.submitted_at}`);

  return buildLeadSlackMessage({
    title: "New phone lead — Inherited Mineral Rights",
    fields: [
      ["Caller", data.name],
      ["Phone", data.phone],
      ["Email", data.email],
      ["Intent", data.intent],
      ["State", data.state],
      ["County", data.county],
      ["Offer amount", data.offer_amount],
      ["Operator / royalty", data.operator_info],
      ["Priority", meta.priority],
      ["Call summary", data.notes],
      ["Recording / transcript", meta.recordingUrl],
    ],
    meta: metaParts.length ? metaParts.join(" · ") : null,
  });
}

// Constant-time-ish secret check. When no secret is configured, always passes.
function secretOk(req) {
  if (!WEBHOOK_SECRET) return true;
  const header =
    req.headers.get("x-bland-secret") || req.headers.get("x-webhook-secret") || "";
  let fromQuery = "";
  try {
    fromQuery = new URL(req.url).searchParams.get("secret") || "";
  } catch {
    fromQuery = "";
  }
  return header === WEBHOOK_SECRET || fromQuery === WEBHOOK_SECRET;
}

export default async (req) => {
  if (req.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  if (!secretOk(req)) {
    return json({ message: "Unauthorized" }, 401);
  }

  if (!slackEnabled) {
    console.error("bland-call-lead: SLACK_WEBHOOK_URL is not configured");
    return json({ message: "Slack webhook is not configured on the server." }, 500);
  }

  const body = await parseBody(req);
  if (body == null) {
    return json({ message: "Invalid request body." }, 400);
  }

  const normalized = normalizeBlandCall(body);

  console.log(
    `bland-call-lead: phone lead intent="${normalized.meta.intent}"` +
      (normalized.meta.callId ? ` call_id="${normalized.meta.callId}"` : ""),
  );

  const message = buildSlackMessage(normalized);
  try {
    await postToSlack(message);
  } catch (err) {
    console.error("bland-call-lead: Slack post error:", err.message);
    return json({ message: "Failed to deliver Slack notification." }, 502);
  }

  // Durable backup to Airtable — best-effort and isolated, exactly like
  // form-to-slack: a missing config or a failed write is logged but never turns
  // a delivered Slack lead into an error response.
  const airtable = { configured: airtableEnabled, ok: false };
  if (airtableEnabled) {
    try {
      const fields = mapLeadToAirtableFields(normalized.data, {
        slackPosted: true,
        source: "Phone",
        priority: normalized.meta.priority,
      });
      await airtableCreateLead(fields);
      airtable.ok = true;
    } catch (err) {
      console.error("bland-call-lead: Airtable write error:", err.message);
    }
  }

  return json({ ok: true, form: "phone-lead", airtable });
};
