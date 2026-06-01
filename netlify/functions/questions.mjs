// In-memory store. Netlify Functions are stateless across cold starts, so this
// resets when the instance recycles. Good enough for the prototype: posts show
// up immediately and the page degrades gracefully without an external DB.
const questions = [];
let nextId = 1;

function validate(body) {
  const errors = [];
  const title = String(body?.title ?? "");
  const text = String(body?.body ?? "");
  const category = String(body?.category ?? "");
  if (title.length < 8 || title.length > 160) errors.push("Give your question a clear title");
  if (text.length < 15 || text.length > 4000) errors.push("Add a little more detail so others can help");
  if (category.length < 2) errors.push("Please choose a category");
  return { errors, title, text, category };
}

export default async (req) => {
  if (req.method === "GET") {
    return new Response(JSON.stringify(questions), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ message: "Invalid request body." }, 400);
    }
    const { errors, title, text, category } = validate(body);
    if (errors.length) return json({ message: errors[0] }, 400);

    const created = {
      id: nextId++,
      title,
      body: text,
      category,
      state: body?.state ? String(body.state) : null,
      displayName: body?.displayName ? String(body.displayName) : null,
      createdAt: Date.now(),
    };
    questions.unshift(created);
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
