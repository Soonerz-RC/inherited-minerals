// Grounded AI chat endpoint for the Inherited Minerals Assistant.
//
//   POST /.netlify/functions/assistant-chat   (also reachable at /api/assistant-chat)
//   body: { message: string, history?: {role,text}[], intake?: {...} }
//
// Behavior:
//   - Retrieves the most relevant Learning Center articles (RAG-lite, local —
//     see learn-index.mjs) and grounds the model on their summaries.
//   - If OPENAI_API_KEY is set, calls an OpenAI-compatible chat completions API
//     (configurable base URL + model). The key is server-only; never exposed.
//   - If no key is configured (or the upstream call fails), returns a graceful
//     structured fallback built from the same retrieved content, so the UI keeps
//     working via the static guided assistant.
//
// No internet calls are made other than the configured AI endpoint.

import { json } from "./_shared.mjs";
import { rankArticles, CTA_ROUTES } from "./learn-index.mjs";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_BASE_URL = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const aiEnabled = Boolean(OPENAI_API_KEY);

const DISCLAIMER =
  "This assistant shares general educational information about inherited mineral rights. It is not legal, tax, or financial advice, and using it does not create an attorney–client relationship. State rules vary; for decisions about your specific situation, talk with a qualified attorney, CPA, or licensed professional.";

const SYSTEM_PROMPT = `You are the Inherited Mineral Rights Assistant for InheritedMineralRights.com — a calm, plain-English guide for people who have inherited oil and gas mineral rights and are often overwhelmed.

ROLE AND TONE
- Explain concepts simply, like a knowledgeable friend, not a salesperson or lawyer.
- Be reassuring: remind owners that understanding comes before deciding and that decisions are rarely urgent.
- Keep answers concise (a short paragraph or a few tight bullets). Do not overwhelm.

HARD GUARDRAILS — never violate these:
- You do NOT give legal, tax, or financial advice and you do NOT create an attorney–client relationship.
- You do NOT make ownership determinations (you cannot tell someone whether or what they own).
- You do NOT promise or state an exact valuation, price, or what an offer "should" be. Value depends on many factors and requires a private review.
- For anything that depends on the owner's specific facts, documents, state, or numbers, recommend a private review and/or a qualified professional (attorney, CPA).
- State rules vary by state and county; say so when it matters.
- Never invent statutes, deadlines, dollar figures, or operator-specific facts. If you don't know, say a professional review is the right next step.

GROUNDING
- Base your answer on the provided Learning Center context. Prefer it over general knowledge.
- When relevant, point the reader to the most relevant article(s) by title.
- It is appropriate to gently suggest requesting a private review when the question depends on the owner's specific situation.

Always answer in the spirit of educating the owner so they can ask better questions and make their own informed decision.`;

function clampText(v, max) {
  return String(v ?? "").slice(0, max);
}

function buildContextBlock(articles) {
  return articles
    .map(
      (a, i) =>
        `[${i + 1}] ${a.title} (${a.category})\nURL: ${a.url}\n${a.summary}`,
    )
    .join("\n\n");
}

function summarizeIntake(intake) {
  if (!intake || typeof intake !== "object") return "";
  const parts = [];
  const add = (label, val) => {
    if (val) parts.push(`${label}: ${clampText(val, 200)}`);
  };
  add("State", intake.state);
  add("County", intake.county);
  add("Producing status", intake.producingStatus);
  add("Owner/probate status", intake.ownerStatus);
  add("Operator/royalty info", intake.operatorInfo);
  add("Offer amount", intake.offerAmount);
  add("Goal", intake.goal);
  add("Notes", intake.notes);
  return parts.length ? `What the owner has shared about their situation:\n${parts.join("\n")}` : "";
}

// Build a structured, content-grounded fallback reply when AI is unavailable.
function fallbackReply(message, articles) {
  const top = articles[0];
  const reply =
    `Here's some general background to get you oriented. ${top.summary} ` +
    `For the specifics of your situation — which depend on your documents, your state, and the numbers involved — a private review or a qualified professional is the right next step.`;

  return {
    reply,
    articles: articles.map((a) => ({ slug: a.slug, title: a.title, url: a.url })),
    suggestions: [
      "What documents do I need to claim inherited minerals?",
      "How do royalty checks and division orders work?",
      "What should I check before considering an offer?",
    ],
    cta: { route: CTA_ROUTES.review, label: "Request a private review" },
    disclaimer: DISCLAIMER,
    mode: "fallback",
  };
}

async function callOpenAI({ message, history, intakeSummary, contextBlock }) {
  const messages = [{ role: "system", content: SYSTEM_PROMPT }];

  // Provide retrieved context and any intake as a system-side grounding turn.
  let grounding = `Learning Center context (use this to ground your answer):\n\n${contextBlock}`;
  if (intakeSummary) grounding += `\n\n${intakeSummary}`;
  messages.push({ role: "system", content: grounding });

  // Replay a short, sanitized history (last 6 turns).
  if (Array.isArray(history)) {
    for (const turn of history.slice(-6)) {
      const role = turn?.role === "user" ? "user" : "assistant";
      const content = clampText(turn?.text, 2000);
      if (content) messages.push({ role, content });
    }
  }
  messages.push({ role: "user", content: message });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        temperature: 0.3,
        max_tokens: 600,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`AI upstream error ${res.status}: ${detail.slice(0, 200)}`);
    }
    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error("AI upstream returned no content");
    return reply;
  } finally {
    clearTimeout(timeout);
  }
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

  const message = clampText(body?.message, 2000).trim();
  if (message.length < 1) {
    return json({ message: "Please enter a question." }, 400);
  }

  const articles = rankArticles(message, 4);
  const contextBlock = buildContextBlock(articles);
  const intakeSummary = summarizeIntake(body?.intake);

  // No key configured → graceful structured fallback. The UI still works.
  if (!aiEnabled) {
    return json(fallbackReply(message, articles));
  }

  try {
    const reply = await callOpenAI({
      message,
      history: body?.history,
      intakeSummary,
      contextBlock,
    });
    return json({
      reply,
      articles: articles.map((a) => ({ slug: a.slug, title: a.title, url: a.url })),
      suggestions: [
        "What documents do I need to claim inherited minerals?",
        "How is the value of mineral rights estimated?",
        "What should I check before considering an offer?",
      ],
      cta: { route: CTA_ROUTES.review, label: "Request a private review" },
      disclaimer: DISCLAIMER,
      mode: "ai",
    });
  } catch (err) {
    console.error("assistant-chat: AI call failed, serving fallback:", err.message);
    return json(fallbackReply(message, articles));
  }
};
