// Shared helpers for Netlify Functions: durable storage via Supabase REST and
// optional email notifications via Resend. Both degrade gracefully — when the
// relevant env vars are absent, callers fall back to in-memory behavior and the
// response advertises persistence: 'memory'.

const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const LEAD_NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "";
const LEAD_FROM_EMAIL = process.env.LEAD_FROM_EMAIL || "Inherited Minerals <onboarding@resend.dev>";
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || "";

// Airtable durable lead backup. Token is read only on the server; base/table
// fall back to the known production IDs but env vars take precedence so the
// destination can be moved without a redeploy.
const AIRTABLE_TOKEN = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "appTKXn43M25UPnYj";
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID || "tblj8AafSljpchWoK";

export const supabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_KEY);
export const resendEnabled = Boolean(RESEND_API_KEY && LEAD_NOTIFY_EMAIL);
export const slackEnabled = Boolean(SLACK_WEBHOOK_URL);
// Only the token gates "configured" — base/table always have a fallback.
export const airtableEnabled = Boolean(AIRTABLE_TOKEN);

export function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Pull common attribution fields off a submitted body. Returns only the columns
// our tables define, with safe string coercion.
export function extractAttribution(body) {
  const str = (v) => (v == null || v === "" ? null : String(v).slice(0, 500));
  return {
    source_page: str(body?.source_page),
    landing_page: str(body?.landing_page),
    referrer: str(body?.referrer),
    utm_source: str(body?.utm_source),
    utm_medium: str(body?.utm_medium),
    utm_campaign: str(body?.utm_campaign),
    utm_content: str(body?.utm_content),
    utm_term: str(body?.utm_term),
  };
}

/**
 * Insert a row into a Supabase table via the REST API. Returns the inserted
 * row. Throws on a non-2xx response so the caller can fall back to memory.
 */
export async function supabaseInsert(table, row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Supabase insert failed (${res.status}): ${detail}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}

/**
 * Send a lead-notification email via Resend. No-ops (returns false) when not
 * configured. Never throws — a failed notification must not fail the request.
 */
export async function sendLeadNotification({ subject, html }) {
  if (!resendEnabled) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: LEAD_FROM_EMAIL,
        to: [LEAD_NOTIFY_EMAIL],
        subject,
        html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const TEST_MARKERS = [/\bTEST\b/i, /perplexity\s*qa/i];

function slackStr(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s.slice(0, 1500);
}

/**
 * Build a Slack message (text + blocks) for a lead. `fields` is an ordered list
 * of [label, value] pairs; empty values are skipped. `title` heads the message;
 * a `:test_tube:` marker is used when the lead looks like a QA test so real and
 * test leads are visually distinct in #inherited.
 */
export function buildLeadSlackMessage({ title, fields, meta }) {
  const haystack = fields.map(([, v]) => v).join(" ");
  const isTest = TEST_MARKERS.some((re) => re.test(haystack));
  const header = isTest ? `:test_tube: TEST ${title}` : `:bell: ${title}`;

  const lines = [];
  for (const [label, value] of fields) {
    const v = slackStr(value);
    if (v) lines.push(`*${label}:* ${v}`);
  }
  if (lines.length === 0) lines.push("_No recognized fields in submission._");
  if (meta) lines.push(`\n_${meta}_`);

  return {
    text: `${header}\n${lines.join("\n")}`,
    blocks: [
      { type: "header", text: { type: "plain_text", text: header.replace(/:[a-z_]+:\s*/i, ""), emoji: true } },
      { type: "section", text: { type: "mrkdwn", text: lines.join("\n") } },
    ],
  };
}

/**
 * POST a message to the configured Slack Incoming Webhook. Throws on failure so
 * the caller can surface an error to the client (and avoid showing a false
 * success). No-ops by throwing a clear error when the webhook isn't configured.
 */
export async function postToSlack(message) {
  if (!slackEnabled) {
    throw new Error("SLACK_WEBHOOK_URL is not configured");
  }
  const res = await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Slack post failed (${res.status}): ${detail.slice(0, 200)}`);
  }
}

// First non-empty (after trim) string among the given values, capped for safety.
function pick(...values) {
  for (const v of values) {
    if (v == null) continue;
    const s = String(v).trim();
    if (s !== "") return s.slice(0, 100000);
  }
  return null;
}

// Heuristic: derive a human-readable Source from intent / source_page when the
// payload doesn't carry an explicit `source`. Assistant leads are tagged so
// they're distinguishable from raw landing-form submissions in the Leads table.
function deriveSource(data) {
  const explicit = pick(data.source, data.Source);
  if (explicit) return explicit;
  const intent = pick(data.intent);
  if (intent && intent.toLowerCase() === "assistant") return "Assistant";
  const page = pick(data.source_page, data.sourcePage, data.landing_page, data.landingPage);
  if (intent && page) return `${intent} (${page})`;
  return intent || page || null;
}

// Pull the "— Questions asked —" bullets out of an assistant summary note when
// no explicit questions field is present, so the Leads table still captures them.
function questionsFromNotes(notes) {
  if (!notes) return null;
  const marker = notes.indexOf("— Questions asked —");
  if (marker === -1) return null;
  const tail = notes
    .slice(marker + "— Questions asked —".length)
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("•") || l.startsWith("-"))
    .map((l) => l.replace(/^[•-]\s*/, "").trim())
    .filter(Boolean);
  return tail.length ? tail.join("\n") : null;
}

/**
 * Map a flattened lead `data` object (canonical keys plus tolerated aliases)
 * into the Airtable Leads table's field shape. All table fields are
 * multilineText, so every value is coerced to a string. `slackPosted` records
 * whether the Slack notification succeeded. Pure and side-effect-free so it can
 * be unit-tested independently of any network call.
 */
export function mapLeadToAirtableFields(data = {}, { slackPosted = false } = {}) {
  const d = data || {};
  const notes = pick(d.notes, d.message, d.body, d.comments, d.Notes);
  const fields = {
    "Lead name": pick(d.name, d["Lead name"], d.lead_name, d.full_name, d.fullName),
    Email: pick(d.email, d.Email),
    Phone: pick(d.phone, d.phone_number, d.phoneNumber, d.Phone),
    Source: deriveSource(d),
    Intent: pick(d.intent, d.Intent),
    Status: "New",
    Priority: "Medium",
    State: pick(d.state, d.State),
    County: pick(d.county, d.County),
    "Operator / Royalty Info": pick(
      d.operatorInfo,
      d.operator,
      d.operator_info,
      d["Operator / Royalty Info"],
    ),
    "Offer Amount": pick(d.offerAmount, d.offer_amount, d.offer, d["Offer Amount"]),
    "Producing Status": pick(d.producingStatus, d.producing_status, d.producing),
    "Owner Status": pick(d.ownerStatus, d.owner_status),
    Notes: notes,
    "Questions Asked":
      pick(d.questions_asked, d.questionsAsked, d["Questions Asked"]) ||
      questionsFromNotes(notes),
    "Landing Page": pick(d.landing_page, d.landingPage, d.source_page, d.sourcePage),
    "UTM Source": pick(d.utm_source, d.utmSource),
    "UTM Medium": pick(d.utm_medium, d.utmMedium),
    "UTM Campaign": pick(d.utm_campaign, d.utmCampaign),
    "Submitted At": pick(d.submitted_at, d.submittedAt, d.created_at) || new Date().toISOString(),
    "Slack Posted": slackPosted ? "true" : "false",
  };

  // Drop null/empty values so Airtable stores only what we actually have.
  const clean = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v != null && v !== "") clean[k] = String(v);
  }
  return clean;
}

/**
 * Write a single lead row to the Airtable Leads table via the REST API. Returns
 * the created record id on success. Throws on a non-2xx response or when not
 * configured so the caller can log and continue — an Airtable failure must
 * never break the Slack/lead flow.
 */
export async function airtableCreateLead(fields) {
  if (!airtableEnabled) {
    throw new Error("Airtable token is not configured");
  }
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
    AIRTABLE_TABLE_ID,
  )}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields, typecast: true }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Airtable create failed (${res.status}): ${detail.slice(0, 300)}`);
  }
  const json = await res.json();
  return json?.id || null;
}
