// Grounded AI chat endpoint for the Inherited Minerals Assistant.
//
//   POST /.netlify/functions/assistant-chat   (also reachable at /api/assistant-chat)
//   body: { message: string, history?: {role,text}[], intake?: {...} }
//
// Behavior:
//   - Retrieves the most relevant Learning Center articles (RAG-lite, local —
//     see learn-index.mjs) and grounds the model on their summaries.
//   - Picks an intent-based conversion CTA from the question (see pickCta).
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
- Use hedged, general language. Prefer words like "may," "often," "typically," "in many cases," and "depends on your documents and state law." Avoid absolutes like "you must," "you have to," "yes you can," or "in [State], minerals do need to..."

HARD GUARDRAILS — never violate these:
- You do NOT give legal, tax, or financial advice and you do NOT create an attorney–client relationship.
- You do NOT give state-specific or county-specific legal conclusions or instructions. Do not tell someone what a particular state "requires" or what process they "need" to follow. Instead, explain the general landscape (probate, ancillary probate, affidavit of heirship, deed, or other routes can be involved) and say which route applies depends on the title, the estate documents, and that state's law — so an attorney licensed in that state should confirm the specific next step.
- You do NOT make ownership determinations. You cannot tell someone whether, or how much, they own, or whether a co-owner can act alone. For co-owner questions, explain generally that each co-owner often may be able to transfer their own undivided interest, but that the actual rights and practical effects depend on the title, the governing state law, and any agreements among owners — so they should not assume without having their documents reviewed.
- You do NOT promise or state an exact valuation, price, or what an offer "should" be or whether an offer is "fair." Value depends on many factors and requires a private review.
- You do NOT give tax advice or suggest ways to avoid, minimize, or defer taxes. For tax questions, explain in general terms that inherited minerals can involve concepts like reportable royalty income and a stepped-up basis, note that specifics vary, and direct the owner to a qualified CPA or tax professional. Never promise a tax outcome or a way to reduce taxes.
- State and county rules vary; say so when it matters, and decline to state a definitive rule for any specific state.
- Never invent statutes, deadlines, dollar figures, or operator-specific facts. If you don't know, say a professional review is the right next step.

WHAT TO GATHER NEXT
- When a good answer depends on the owner's specific facts, close with a short, plain list of what would help them and a professional move forward. Draw only from items that are relevant: the state and county the minerals are in; the mineral deed or legal description; probate / estate / death documents; recent royalty check stubs; any division order; any offer letter; and any lease.

GROUNDING
- Base your answer on the provided Learning Center context. Prefer it over general knowledge.
- When relevant, point the reader to the most relevant article(s) by title.
- It is appropriate to gently suggest requesting a private review when the question depends on the owner's specific situation.

Always answer in the spirit of educating the owner so they can ask better questions and make their own informed decision — never in a way that substitutes for an attorney, CPA, or a private review.`;

function clampText(v, max) {
  return String(v ?? "").slice(0, max);
}

const has = (text, ...words) => words.some((w) => text.includes(w));

// Map a question to the best conversion CTA based on intent.
//   offer/price/buyer/fairness -> /got-an-offer  (Review my offer)
//   value/valuation/worth/royalty check -> /value-my-minerals (Value my minerals)
//   tax -> /ask (CPA caveat — never imply tax advice)
//   probate/title/deed/division order/documents/ownership -> /sell (private review)
//   default -> /sell (private review)
function pickCta(message) {
  const m = String(message || "").toLowerCase();

  // Offer-specific intent wins first: an offer in hand is the clearest signal.
  if (has(m, "offer", "buyer", "buy my", "buying", "lowball", "low ball", "they offered", "fair price", "is it fair", "good price", "should i sell", "sell offer")) {
    return { route: CTA_ROUTES.offer, label: "Review my offer" };
  }
  // Valuation intent.
  if (has(m, "value", "valuation", "worth", "how much", "appraisal", "appraise", "estimate", "royalty check", "nma", "nra", "net royalty", "net mineral")) {
    return { route: "/value-my-minerals", label: "Value my minerals" };
  }
  // Tax intent — route to a question with a CPA caveat, never imply tax advice.
  if (has(m, "tax", "taxes", "irs", "1099", "depletion", "capital gain", "stepped-up", "stepped up", "write off", "write-off", "deduct")) {
    return { route: CTA_ROUTES.question, label: "Ask about your situation" };
  }
  // Title / probate / documents / ownership -> private review.
  if (has(m, "probate", "estate", "title", "deed", "division order", "document", "heirship", "affidavit", "ownership", "own", "co-owner", "co owner", "sibling", "executor", "will")) {
    return { route: CTA_ROUTES.review, label: "Request a private review" };
  }
  return { route: CTA_ROUTES.review, label: "Request a private review" };
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

// Topic-specific, softened guided answers for the keyless / degraded fallback.
// These mirror the AI guardrails: no state-specific legal conclusions, no
// ownership determinations, no exact valuation, no tax-minimization advice.
const GATHER_INTRO = "To get a grounded, situation-specific answer, it helps to have on hand:";

function guidedFallback(message) {
  const m = String(message || "").toLowerCase();

  if (has(m, "probate", "estate", "executor", "will", "title", "deed", "heirship", "affidavit")) {
    return {
      reply:
        "Inherited minerals often need a title or estate transfer step before a company will pay the new owner. Depending on the situation that can mean probate, an ancillary probate in the state where the minerals sit, an affidavit of heirship, a recorded deed, or another route. Which one applies depends on the title, the estate documents, and that state's law — so the best next step is to have an attorney licensed in that state confirm the specific path for your case. State and county rules vary, so it's wise not to assume a single answer.",
      gather: ["the state and county the minerals are in", "the prior mineral deed or legal description", "probate / estate / death documents (death certificate, will, any order)"],
    };
  }
  if (has(m, "co-owner", "co owner", "sibling", "without the others", "one of us", "other heirs", "joint")) {
    return {
      reply:
        "When several heirs inherit together, they often end up as co-owners of undivided fractional interests — each may own a share of the whole rather than a specific piece of ground. In many cases a co-owner may be able to lease or transfer their own undivided interest, but the actual rights and the practical effects depend on the title, the governing state law, and any agreements among the owners. It's best not to assume one co-owner can or can't act alone without having the documents reviewed first.",
      gather: ["the mineral deed or legal description", "the state and county the minerals are in", "any agreements among the co-owners"],
    };
  }
  if (has(m, "offer", "buyer", "fair", "lowball", "should i sell", "buy my")) {
    return {
      reply:
        "An offer is one data point — not 'the' value. What an interest may be worth depends on whether the acreage is producing, projected production, commodity prices, lease terms, and location relative to active drilling, so two parcels in the same county can differ widely. Before reacting, it helps to understand what you own, compare more than one offer, and read exactly what's being conveyed. A legitimate buyer will give you time to review — there's rarely a reason to sign quickly.",
      gather: ["the offer letter", "recent royalty check stubs", "any lease", "the mineral deed or legal description"],
    };
  }
  if (has(m, "value", "valuation", "worth", "how much", "royalty check", "appraisal", "estimate", "nma", "nra")) {
    return {
      reply:
        "Value reflects expected future production over time, commodity prices, and lease terms — a single check stub is a useful input but not a value on its own. We can't promise an exact number here, and it's wise to be wary of anyone who does. A private review is the right way to turn check stubs and acreage details into a grounded estimate for your specific minerals.",
      gather: ["recent royalty check stubs (several months if possible)", "any lease", "the mineral deed or legal description", "the state and county the minerals are in"],
    };
  }
  if (has(m, "tax", "taxes", "irs", "1099", "depletion", "capital gain", "stepped-up", "stepped up", "avoid", "minimize", "deduct")) {
    return {
      reply:
        "In general terms, royalty income is typically reportable, and inherited minerals often involve a 'stepped-up basis' that can affect capital gains if you later sell. The specifics vary a lot by situation, and we can't give tax advice or suggest ways to avoid or minimize tax — that's genuinely a conversation for a qualified CPA or tax professional. Keeping your records organized makes that conversation much easier.",
      gather: ["recent royalty check stubs and any 1099s", "inheritance / estate documents", "the date of the prior owner's passing (relevant to basis)"],
    };
  }
  if (has(m, "division order", "decimal", "suspense")) {
    return {
      reply:
        "A division order typically confirms your decimal ownership interest and how you'll be paid — it generally isn't a deed and shouldn't change what you own. Operators often hold payments in 'suspense' until updated title and a signed order are on file. It's worth verifying the decimal against your deed before signing and being cautious of any language that changes ownership rather than just confirming payment details.",
      gather: ["the division order", "the mineral deed or legal description", "recent royalty check stubs"],
    };
  }
  if (has(m, "lease", "bonus", "pooling", "drill", "operator")) {
    return {
      reply:
        "A lease typically gives an operator the right to drill and produce in exchange for a bonus and a royalty share. If you inherited leased minerals, the existing terms usually carry over. The terms worth understanding include the royalty fraction, the primary term, and clauses about pooling, shut-in, and continued operations — those control how the deal really works.",
      gather: ["the lease", "the mineral deed or legal description", "any division order"],
    };
  }
  return null;
}

// Build a structured, content-grounded fallback reply when AI is unavailable.
function fallbackReply(message, articles, cta) {
  const guided = guidedFallback(message);

  let reply;
  let gather;
  if (guided) {
    reply = guided.reply;
    gather = guided.gather;
  } else {
    const top = articles[0];
    reply =
      `Here's some general background to get you oriented. ${top.summary} ` +
      `For the specifics of your situation — which depend on your documents, your state, and the numbers involved — a private review or a qualified professional is the right next step.`;
    gather = [
      "the state and county the minerals are in",
      "the mineral deed or legal description",
      "probate / estate / death documents",
      "recent royalty check stubs, any division order, offer letter, or lease",
    ];
  }

  if (gather && gather.length) {
    reply += `\n\n${GATHER_INTRO}\n• ${gather.join("\n• ")}`;
  }

  return {
    reply,
    articles: articles.map((a) => ({ slug: a.slug, title: a.title, url: a.url })),
    suggestions: [
      "What documents do I need to claim inherited minerals?",
      "How do royalty checks and division orders work?",
      "What should I check before considering an offer?",
    ],
    cta,
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
  const cta = pickCta(message);

  // No key configured → graceful structured fallback. The UI still works.
  if (!aiEnabled) {
    return json(fallbackReply(message, articles, cta));
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
      cta,
      disclaimer: DISCLAIMER,
      mode: "ai",
    });
  } catch (err) {
    console.error("assistant-chat: AI call failed, serving fallback:", err.message);
    return json(fallbackReply(message, articles, cta));
  }
};
