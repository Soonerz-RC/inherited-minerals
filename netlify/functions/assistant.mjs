const ASSISTANT_DISCLAIMER =
  "This assistant shares general educational information about inherited mineral rights. It is not legal, tax, or financial advice. For decisions about your specific situation, talk with a qualified attorney, CPA, or licensed professional.";

function generateAssistantReply(raw) {
  const msg = String(raw || "").toLowerCase();
  const has = (...words) => words.some((w) => msg.includes(w));

  let reply;
  if (has("probate", "estate", "will", "executor")) {
    reply =
      "Mineral rights usually pass through the same probate or estate process as the rest of the property. Before a royalty company will pay you, title typically needs to show you as the new owner — often through a probate order, an affidavit of heirship, or a recorded deed, depending on the state and how the estate was set up. A common first step is to gather the death certificate, any will, and the prior mineral deed so an attorney can confirm what's needed to transfer title in the county where the minerals sit.";
  } else if (has("royalty", "check", "division order", "payment", "suspense")) {
    reply =
      "Royalty checks are a share of revenue from oil or gas produced from your minerals. When ownership changes, operators often place payments in 'suspense' until updated title and a signed division order are on file. A division order confirms your decimal ownership interest — it's worth verifying that decimal against your deed before signing, because it sets how much you're paid going forward.";
  } else if (has("value", "worth", "valuation", "appraisal", "how much")) {
    reply =
      "Mineral value depends on factors like whether the acreage is producing, current and projected production, commodity prices, lease terms, and location relative to active drilling. Two parcels in the same county can be worth very different amounts. Recent check stubs, the lease, and a description of the acreage are the inputs most people use to start estimating value. Be cautious with any single offer presented as 'the' value.";
  } else if (has("sell", "offer", "buy", "buyer", "should i sell")) {
    reply =
      "Whether to sell is a personal decision that depends on your goals, taxes, and the long-term outlook for the acreage. If you do consider an offer, it helps to understand what you own first, compare more than one offer, and read exactly what's being conveyed (all minerals vs. a fraction, surface rights, etc.). There's rarely a reason to sign quickly — a legitimate buyer will give you time to review.";
  } else if (has("title", "deed", "ownership", "heirship", "affidavit")) {
    reply =
      "'Title' is the chain of recorded documents proving who owns the minerals. After an inheritance, the chain often needs an update — frequently via a probate order, affidavit of heirship, or a recorded deed — so operators and buyers can confirm you're the owner. The county clerk's office where the minerals are located is where these documents get recorded.";
  } else if (has("tax", "irs", "income", "depletion", "1099")) {
    reply =
      "Royalty income is generally reportable, and inherited minerals can involve a 'stepped-up basis' that affects future capital gains if you sell. The specifics vary a lot by situation, so this is an area where a CPA or tax professional is genuinely valuable. Keeping your check stubs, 1099s, and inheritance documents organized makes that conversation much easier.";
  } else if (has("lease", "bonus", "operator", "drill")) {
    reply =
      "A lease gives an operator the right to drill and produce in exchange for a bonus payment and a royalty share. If you inherited leased minerals, the existing lease terms usually carry over. Key terms to understand are the royalty fraction, the primary term, and any clauses about pooling or continued operations.";
  } else if (has("start", "begin", "first", "inherited", "what do i do", "where do i")) {
    reply =
      "A practical starting point is to (1) gather documents — death certificate, will or estate papers, any prior mineral deed, and recent royalty statements; (2) figure out where the minerals are located (state and county); (3) confirm whether they're producing; and (4) get title updated so ownership reflects you. From there you can decide whether to hold, lease, or explore an offer. Our Start Here guide walks through these steps in order.";
  } else {
    reply =
      "I can share general, plain-English information about inherited mineral rights — things like probate and title, royalty checks and division orders, valuation basics, leasing, and what to consider before selling. Tell me a bit about your situation (for example, what state the minerals are in and whether they're producing) and I'll point you to the right concepts and next steps.";
  }

  const suggestions = [
    "What documents do I need to claim inherited minerals?",
    "How do royalty checks and division orders work?",
    "How is the value of mineral rights estimated?",
    "What should I check before considering an offer?",
  ];

  return { reply, suggestions, disclaimer: ASSISTANT_DISCLAIMER };
}

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
  let message = "";
  try {
    const body = await req.json();
    message = body?.message ?? "";
  } catch {
    return new Response(JSON.stringify({ message: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (typeof message !== "string" || message.length < 1 || message.length > 2000) {
    return new Response(JSON.stringify({ message: "Please enter a question." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify(generateAssistantReply(message)), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
