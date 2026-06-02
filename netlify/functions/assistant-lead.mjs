// Assistant handoff lead endpoint.
//
//   POST /.netlify/functions/assistant-lead   (also reachable at /api/assistant-lead)
//   body: structured assistant fields (see client/src/lib/assistant.ts ->
//   buildHandoffPayload) plus intent=assistant.
//
// Why this exists: the /#/ask "send this summary for review" handoff could not
// reliably register a submission with Netlify Forms from the SPA (the POST to
// "/" falls through the SPA fallback redirect at status 200, so the client saw
// success while Netlify never recorded the lead — and therefore never fired the
// email notification or the form-to-slack outgoing webhook). Assistant leads
// therefore BYPASS Netlify Forms and are delivered directly here:
//   - Slack #inherited via the existing SLACK_WEBHOOK_URL (required: a non-2xx
//     here means the client must NOT show the thank-you/conversion page).
//   - Email via Resend (best-effort) and Supabase row (best-effort) — same
//     source-of-record path as review-requests.mjs when configured.
//
// The landing-page LeadForm and community-question form are unchanged and keep
// using Netlify Forms.

import {
  json,
  supabaseEnabled,
  supabaseInsert,
  extractAttribution,
  sendLeadNotification,
  escapeHtml,
  buildLeadSlackMessage,
  postToSlack,
} from "./_shared.mjs";

function validate(body) {
  const errors = [];
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  if (name.length < 2) errors.push("Please enter your name");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.push("Please enter a valid email");
  return { errors, name, email };
}

function str(v) {
  return v == null || v === "" ? null : String(v);
}

function buildRecord(body, name, email) {
  return {
    name,
    email,
    phone: str(body?.phone),
    state: str(body?.state),
    county: str(body?.county),
    producing_status: str(body?.producingStatus),
    owner_status: str(body?.ownerStatus),
    operator_info: str(body?.operatorInfo),
    offer_amount: str(body?.offerAmount),
    urgency: str(body?.urgency),
    documents: Array.isArray(body?.documents) ? body.documents.map(String) : [],
    notes: str(body?.notes),
    intent: str(body?.intent) || "assistant",
    ...extractAttribution(body),
  };
}

function slackFields(r) {
  return [
    ["Name", r.name],
    ["Email", r.email],
    ["Phone", r.phone],
    ["State", r.state],
    ["County", r.county],
    ["Producing status", r.producing_status],
    ["Owner status", r.owner_status],
    ["Operator", r.operator_info],
    ["Offer amount", r.offer_amount],
    ["Urgency", r.urgency],
    ["Intent", r.intent],
    ["Source page", r.source_page],
    ["Landing page", r.landing_page],
    ["Notes / assistant summary", r.notes],
  ];
}

async function notifyEmail(r) {
  const rows = slackFields(r)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;font-weight:600;vertical-align:top">${escapeHtml(k)}</td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  await sendLeadNotification({
    subject: `New assistant handoff — ${r.name}${r.state ? ` (${r.state})` : ""}`,
    html: `<h2>New assistant handoff lead</h2><table>${rows}</table>`,
  });
}

export default async (req) => {
  if (req.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ message: "Invalid request body." }, 400);
  }

  const { errors, name, email } = validate(body);
  if (errors.length) return json({ message: errors[0] }, 400);

  const record = buildRecord(body, name, email);

  // Slack is the required delivery channel for assistant leads. If it fails,
  // return an error so the client does NOT show the thank-you/conversion page.
  try {
    const message = buildLeadSlackMessage({
      title: "New lead — assistant handoff",
      fields: slackFields(record),
      meta: `Submitted: ${new Date().toISOString()}`,
    });
    await postToSlack(message);
  } catch (err) {
    console.error("assistant-lead: Slack delivery failed:", err.message);
    return json(
      { message: "We couldn't send your summary just now. Please try again in a moment." },
      502,
    );
  }

  // Best-effort durable record + email. Never fail the request on these — Slack
  // already delivered the lead, so the user should still see success.
  let persistence = "slack-only";
  if (supabaseEnabled) {
    try {
      await supabaseInsert("review_requests", {
        name: record.name,
        email: record.email,
        state: record.state,
        county: record.county,
        producing_status: record.producing_status || "not_sure",
        documents: record.documents,
        notes: record.notes,
        phone: record.phone,
        owner_status: record.owner_status,
        operator_info: record.operator_info,
        offer_amount: record.offer_amount,
        urgency: record.urgency,
        intent: record.intent,
        ...extractAttribution(body),
      });
      persistence = "supabase";
    } catch (err) {
      console.error("assistant-lead: Supabase insert failed:", err.message);
    }
  }

  try {
    await notifyEmail(record);
  } catch (err) {
    console.error("assistant-lead: email notification failed:", err.message);
  }

  return json({ ok: true, persistence }, 201);
};
