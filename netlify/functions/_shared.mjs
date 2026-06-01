// Shared helpers for Netlify Functions: durable storage via Supabase REST and
// optional email notifications via Resend. Both degrade gracefully — when the
// relevant env vars are absent, callers fall back to in-memory behavior and the
// response advertises persistence: 'memory'.

const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const LEAD_NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "";
const LEAD_FROM_EMAIL = process.env.LEAD_FROM_EMAIL || "Inherited Minerals <onboarding@resend.dev>";

export const supabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_KEY);
export const resendEnabled = Boolean(RESEND_API_KEY && LEAD_NOTIFY_EMAIL);

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
