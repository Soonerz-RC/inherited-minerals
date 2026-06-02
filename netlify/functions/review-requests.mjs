import {
  json,
  supabaseEnabled,
  supabaseInsert,
  extractAttribution,
  sendLeadNotification,
  escapeHtml,
} from "./_shared.mjs";

// In-memory fallback; resets on cold start. Used only when Supabase isn't
// configured, so the Sell form still confirms submission without a DB.
const reviewRequests = [];
let nextId = 1;

const PRODUCING = ["producing", "not_producing", "not_sure"];

function validate(body) {
  const errors = [];
  const name = String(body?.name ?? "");
  const email = String(body?.email ?? "");
  const state = String(body?.state ?? "");
  const producingStatus = String(body?.producingStatus ?? "");
  if (name.length < 2) errors.push("Please enter your name");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.push("Please enter a valid email");
  if (state.length < 2) errors.push("Please select a state");
  if (!PRODUCING.includes(producingStatus)) errors.push("Please select a producing status");
  return { errors, name, email, state, producingStatus };
}

async function notify(record) {
  const rows = [
    ["Name", record.name],
    ["Email", record.email],
    ["Phone", record.phone],
    ["State", record.state],
    ["County", record.county],
    ["Owner status", record.owner_status],
    ["Producing", record.producing_status],
    ["Operator / royalty", record.operator_info],
    ["Offer amount", record.offer_amount],
    ["Urgency", record.urgency],
    ["Documents", (record.documents || []).join(", ")],
    ["Notes", record.notes],
    ["Intent", record.intent],
    ["Source page", record.source_page],
    ["UTM source", record.utm_source],
    ["UTM campaign", record.utm_campaign],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:600">${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`)
    .join("");
  await sendLeadNotification({
    subject: `New private review request — ${record.name} (${record.state})`,
    html: `<h2>New private review request</h2><table>${rows}</table>`,
  });
}

export default async (req) => {
  if (req.method === "GET") {
    // GET only serves the in-memory list; durable rows live in Supabase.
    return json(reviewRequests, 200);
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ message: "Invalid request body." }, 400);
    }
    const { errors, name, email, state, producingStatus } = validate(body);
    if (errors.length) return json({ message: errors[0] }, 400);

    const documents = Array.isArray(body?.documents) ? body.documents.map(String) : [];
    const county = body?.county ? String(body.county) : null;
    const notes = body?.notes ? String(body.notes) : null;
    const phone = body?.phone ? String(body.phone) : null;
    const ownerStatus = body?.ownerStatus ? String(body.ownerStatus) : null;
    const operatorInfo = body?.operatorInfo ? String(body.operatorInfo) : null;
    const offerAmount = body?.offerAmount ? String(body.offerAmount) : null;
    const urgency = body?.urgency ? String(body.urgency) : null;
    const intent = body?.intent ? String(body.intent) : null;
    const attribution = extractAttribution(body);

    const optionalFields = {
      phone,
      owner_status: ownerStatus,
      operator_info: operatorInfo,
      offer_amount: offerAmount,
      urgency,
      intent,
    };

    if (supabaseEnabled) {
      try {
        const row = await supabaseInsert("review_requests", {
          name,
          email,
          state,
          county,
          producing_status: producingStatus,
          documents,
          notes,
          ...optionalFields,
          ...attribution,
        });
        await notify(row);
        return json({ ...row, persistence: "supabase" }, 201);
      } catch (err) {
        // Fall through to memory so the user still gets a success response.
        console.error("review-requests supabase error:", err.message);
      }
    }

    const created = {
      id: nextId++,
      name,
      email,
      state,
      county,
      producing_status: producingStatus,
      documents,
      notes,
      ...optionalFields,
      ...attribution,
      created_at: new Date().toISOString(),
    };
    reviewRequests.unshift(created);
    await notify(created);
    return json({ ...created, persistence: "memory" }, 201);
  }

  return json({ message: "Method not allowed" }, 405);
};
