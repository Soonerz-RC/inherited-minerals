// Receives Netlify Form submission notifications (outgoing webhook) and posts a
// formatted lead alert to Slack via an Incoming Webhook URL. The webhook URL is
// secret and read only from process.env.SLACK_WEBHOOK_URL — never exposed to the
// client. Configure in Netlify: Site → Forms → Form notifications → Add
// notification → Outgoing webhook, pointing at /.netlify/functions/form-to-slack
// (or /api/form-to-slack).

import {
  json,
  buildLeadSlackMessage,
  postToSlack,
  slackEnabled,
  airtableEnabled,
  airtableCreateLead,
  mapLeadToAirtableFields,
} from "./_shared.mjs";

// Fields we surface in the Slack message, in display order. Each entry maps a
// canonical key to a human label; values are pulled from the (flattened) form
// data with a few alias fallbacks.
const FIELD_LABELS = [
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["state", "State"],
  ["county", "County"],
  ["producing_status", "Producing status"],
  ["owner_status", "Owner status"],
  ["operator", "Operator"],
  ["offer_amount", "Offer amount"],
  ["urgency", "Urgency"],
  ["intent", "Intent"],
  ["source_page", "Source page"],
  ["landing_page", "Landing page"],
  ["notes", "Notes"],
];

// Common alternate keys → canonical key. Lets us tolerate varied form fields.
const ALIASES = {
  full_name: "name",
  displayName: "name",
  display_name: "name",
  fullName: "name",
  phone_number: "phone",
  phoneNumber: "phone",
  producing: "producing_status",
  producingStatus: "producing_status",
  ownerStatus: "owner_status",
  operator_info: "operator",
  operatorInfo: "operator",
  offer: "offer_amount",
  offerAmount: "offer_amount",
  message: "notes",
  question: "notes",
  body: "notes",
  comments: "notes",
  sourcePage: "source_page",
  landingPage: "landing_page",
};

function str(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s.slice(0, 1000);
}

// Parse the incoming request body into a plain object. Netlify form
// notifications send JSON, but we also tolerate urlencoded bodies.
async function parseBody(req) {
  const contentType = (req.headers.get("content-type") || "").toLowerCase();
  const raw = await req.text();
  if (!raw) return {};
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(raw));
  }
  // Default: try JSON, then fall back to urlencoded just in case.
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

// Netlify wraps the submission under `payload`; other senders may post the
// fields at the top level or under `data`. Flatten the likely shapes into a
// single lookup of canonical field → value, and surface metadata.
function normalize(body) {
  const payload = (body && (body.payload || body)) || {};
  const data =
    (payload && (payload.data || payload.form_data)) ||
    body?.data ||
    body ||
    {};

  const formName =
    str(payload.form_name) ||
    str(body?.form_name) ||
    str(body?.["form-name"]) ||
    str(data?.["form-name"]) ||
    str(data?.form_name) ||
    "unknown-form";

  const submittedAt =
    str(payload.created_at) || str(body?.created_at) || str(data?.created_at);
  const submissionId =
    str(payload.id) || str(body?.id) || str(data?.submission_id);

  // Merge top-level data with any nested `data` so aliases resolve either way.
  const merged = { ...(typeof data === "object" ? data : {}) };

  const fields = {};
  for (const [key, value] of Object.entries(merged)) {
    const canonical = ALIASES[key] || key;
    if (fields[canonical] == null) {
      const v = str(value);
      if (v != null) fields[canonical] = v;
    }
  }

  // `merged` preserves the raw incoming keys (with aliases intact) so the
  // Airtable mapper can resolve fields like `operatorInfo`/`questions_asked`
  // that the Slack-oriented canonical flattening would otherwise collapse.
  return { formName, submittedAt, submissionId, fields, merged };
}

function buildSlackMessage({ formName, submittedAt, submissionId, fields }) {
  const meta = [];
  if (submittedAt) meta.push(`Submitted: ${submittedAt}`);
  if (submissionId) meta.push(`ID: ${submissionId}`);

  return buildLeadSlackMessage({
    title: `New lead — ${formName}`,
    fields: FIELD_LABELS.map(([key, label]) => [label, fields[key]]),
    meta: meta.length ? meta.join(" · ") : null,
  });
}

export default async (req) => {
  if (req.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  if (!slackEnabled) {
    console.error("form-to-slack: SLACK_WEBHOOK_URL is not configured");
    return json(
      { message: "Slack webhook is not configured on the server." },
      500,
    );
  }

  const body = await parseBody(req);
  if (body == null) {
    return json({ message: "Invalid request body." }, 400);
  }

  const normalized = normalize(body);
  const message = buildSlackMessage(normalized);

  console.log(
    `form-to-slack: posting lead for form="${normalized.formName}"` +
      (normalized.submissionId ? ` id="${normalized.submissionId}"` : ""),
  );

  try {
    await postToSlack(message);
  } catch (err) {
    console.error("form-to-slack: Slack post error:", err.message);
    return json({ message: "Failed to deliver Slack notification." }, 502);
  }

  // Durable backup to Airtable. Best-effort and fully isolated: a missing config
  // or a failed write is logged server-side but never turns a delivered Slack
  // lead into an error response.
  const airtable = { configured: airtableEnabled, ok: false };
  if (airtableEnabled) {
    try {
      const airtableData = {
        ...normalized.merged,
        submitted_at: normalized.submittedAt || normalized.merged.submitted_at,
      };
      const fields = mapLeadToAirtableFields(airtableData, { slackPosted: true });
      await airtableCreateLead(fields);
      airtable.ok = true;
    } catch (err) {
      console.error("form-to-slack: Airtable write error:", err.message);
    }
  }

  return json({ ok: true, form: normalized.formName, airtable });
};
