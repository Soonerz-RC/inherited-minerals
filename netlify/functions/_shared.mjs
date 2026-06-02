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

export const supabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_KEY);
export const resendEnabled = Boolean(RESEND_API_KEY && LEAD_NOTIFY_EMAIL);
export const slackEnabled = Boolean(SLACK_WEBHOOK_URL);

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
