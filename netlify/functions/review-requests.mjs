// In-memory store; resets on cold start. The Sell form only needs a successful
// response to confirm submission, so this degrades gracefully without a DB.
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

export default async (req) => {
  if (req.method === "GET") {
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

    const created = {
      id: nextId++,
      name,
      email,
      state,
      county: body?.county ? String(body.county) : null,
      producingStatus,
      documents: Array.isArray(body?.documents) ? body.documents.map(String) : [],
      notes: body?.notes ? String(body.notes) : null,
      createdAt: Date.now(),
    };
    reviewRequests.unshift(created);
    return json(created, 201);
  }

  return json({ message: "Method not allowed" }, 405);
};

function json(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
