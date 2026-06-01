import {
  json,
  supabaseEnabled,
  supabaseInsert,
  extractAttribution,
  sendLeadNotification,
  escapeHtml,
} from "./_shared.mjs";

// In-memory fallback; resets on cold start. Used only when Supabase isn't
// configured. GET serves whatever this instance has accumulated.
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

async function notify(record) {
  await sendLeadNotification({
    subject: `New community question — ${record.category}`,
    html: `<h2>New community question</h2>
      <p><strong>${escapeHtml(record.title)}</strong></p>
      <p>${escapeHtml(record.body)}</p>
      <p>Category: ${escapeHtml(record.category)} · State: ${escapeHtml(record.state || "—")}</p>`,
  });
}

export default async (req) => {
  if (req.method === "GET") {
    return json(questions, 200);
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

    const state = body?.state ? String(body.state) : null;
    const displayName = body?.displayName ? String(body.displayName) : null;
    const attribution = extractAttribution(body);

    if (supabaseEnabled) {
      try {
        const row = await supabaseInsert("community_questions", {
          title,
          body: text,
          category,
          state,
          display_name: displayName,
          ...attribution,
        });
        await notify(row);
        return json({ ...row, persistence: "supabase" }, 201);
      } catch (err) {
        console.error("questions supabase error:", err.message);
      }
    }

    const created = {
      id: nextId++,
      title,
      body: text,
      category,
      state,
      displayName,
      ...attribution,
      created_at: new Date().toISOString(),
      createdAt: Date.now(),
    };
    questions.unshift(created);
    await notify(created);
    return json({ ...created, persistence: "memory" }, 201);
  }

  return json({ message: "Method not allowed" }, 405);
};
