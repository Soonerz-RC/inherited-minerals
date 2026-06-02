// Static, client-side knowledge that powers the guided assistant (Phase 1).
// Each topic carries a plain-English answer, the Learning Center articles it
// links to, and a conversion CTA — so the assistant gives useful, grounded
// help with no backend at all. The AI chat (Phase 2) layers on top of this.

import { articles as LEARN_ARTICLES, type CtaKind } from "@/lib/learn";
import { getAttribution } from "@/lib/attribution";

export interface RelatedArticle {
  slug: string;
  title: string;
}

export interface GuidedTopic {
  id: string;
  /** The suggested prompt the user clicks. */
  prompt: string;
  /** Short chip label for compact display. */
  label: string;
  /** Plain-English guided answer paragraphs. */
  answer: string[];
  /** Optional concrete next steps. */
  steps?: string[];
  /** Learning Center slugs this answer is grounded on. */
  articleSlugs: string[];
  /** Which conversion CTA fits best. */
  cta: CtaKind;
}

/** Resolve article slugs to {slug,title} using the canonical learn.ts data. */
export function relatedArticles(slugs: string[]): RelatedArticle[] {
  return slugs
    .map((slug) => {
      const a = LEARN_ARTICLES.find((x) => x.slug === slug);
      return a ? { slug: a.slug, title: a.title } : null;
    })
    .filter((x): x is RelatedArticle => x !== null);
}

export const GUIDED_TOPICS: GuidedTopic[] = [
  {
    id: "first-steps",
    prompt: "I just inherited minerals — where do I start?",
    label: "First steps",
    answer: [
      "Take a breath — nothing here is urgent. A calm, practical order works best: (1) gather documents — death certificate, any will or estate papers, prior mineral deeds, and recent royalty/check stubs; (2) figure out where the minerals sit (state and county); (3) confirm whether they're producing; and (4) get title updated so the record shows you as owner.",
      "Once you understand what you own, you can decide whether to hold, lease, or look at an offer. Understanding always comes before deciding.",
    ],
    steps: [
      "Collect documents and keep originals together.",
      "Identify the state and county of the minerals.",
      "Find out if they're currently producing.",
      "Get title updated into your name.",
    ],
    articleSlugs: ["what-are-inherited-mineral-rights", "mineral-rights-heir-mistakes"],
    cta: "review",
  },
  {
    id: "probate",
    prompt: "How does probate work for inherited mineral rights?",
    label: "Probate & title",
    answer: [
      "Mineral rights usually pass through the same probate or estate process as the rest of an estate. Before a royalty company will pay you, title typically needs to show you as the new owner — often through a probate order, an affidavit of heirship, or a recorded deed, depending on the state and how the estate was set up.",
      "State rules vary, so this is an area where a qualified attorney in the state where the minerals sit is genuinely valuable. A common first step is to gather the death certificate, any will, and the prior mineral deed.",
    ],
    articleSlugs: ["probate-mineral-rights-heirs", "what-are-inherited-mineral-rights"],
    cta: "review",
  },
  {
    id: "offer-fairness",
    prompt: "How do I know if an offer to buy my minerals is fair?",
    label: "Is my offer fair?",
    answer: [
      "An offer is one data point — not 'the' value. Fairness depends on what the acreage actually produces, projected production, commodity prices, lease terms, and location relative to active drilling. Two parcels in the same county can be worth very different amounts.",
      "Before reacting to an offer, it helps to understand what you own, compare more than one offer, and read exactly what's being conveyed (all minerals vs. a fraction, surface, depths). A legitimate buyer will give you time to review — there's rarely a reason to sign quickly.",
    ],
    articleSlugs: ["selling-inherited-mineral-rights", "mineral-rights-valuation-basics"],
    cta: "offer",
  },
  {
    id: "division-orders",
    prompt: "What is a division order and should I sign it?",
    label: "Division orders",
    answer: [
      "A division order confirms your decimal ownership interest and how you'll be paid. It is not the same as a deed and generally shouldn't change what you own. Operators often place payments in 'suspense' until updated title and a signed division order are on file.",
      "It's worth verifying the decimal against your deed before signing, and being cautious of any language that changes ownership rather than just confirming payment details. When in doubt, have it reviewed.",
    ],
    articleSlugs: ["division-orders-explained", "royalty-check-explained"],
    cta: "question",
  },
  {
    id: "royalty-value",
    prompt: "Can I estimate value from my royalty check?",
    label: "Value from a check",
    answer: [
      "A royalty check stub is a useful starting input — it shows production volumes, price, and your decimal interest — but a single month doesn't equal value. Value reflects expected future production over time, prices, and lease terms, which is why estimates use several months of stubs plus the lease and acreage details.",
      "We can't promise an exact number here, and you should be wary of anyone who does. A private review is the right way to turn your check stubs into a grounded estimate for your specific acreage.",
    ],
    articleSlugs: ["royalty-check-explained", "mineral-rights-valuation-basics"],
    cta: "review",
  },
  {
    id: "documents",
    prompt: "What documents do I need to claim inherited minerals?",
    label: "Documents to gather",
    answer: [
      "The core set most heirs need: the death certificate, any will or estate paperwork, the prior mineral deed, and recent royalty or check stubs. If a lease or division order exists, gather those too.",
      "If you can't find a deed, the county clerk's office where the minerals are located keeps recorded copies. Keeping everything in one folder makes the title and tax conversations far easier.",
    ],
    steps: [
      "Death certificate",
      "Will / estate paperwork",
      "Prior mineral deed",
      "Recent royalty or check stubs",
      "Any lease or division order",
    ],
    articleSlugs: ["reading-mineral-deed-explained", "probate-mineral-rights-heirs"],
    cta: "review",
  },
  {
    id: "lease",
    prompt: "How do oil and gas leases work?",
    label: "Lease questions",
    answer: [
      "A lease gives an operator the right to drill and produce in exchange for a bonus payment and a royalty share. If you inherited leased minerals, the existing lease terms usually carry over to you.",
      "The terms worth understanding are the royalty fraction, the primary term, and clauses about pooling, shut-in, and continued operations — those control how the deal really works.",
    ],
    articleSlugs: ["oil-gas-lease-basics", "oil-gas-lease-clauses-explained"],
    cta: "question",
  },
  {
    id: "unclaimed",
    prompt: "How do I find unclaimed or missing mineral royalties?",
    label: "Unclaimed royalties",
    answer: [
      "When operators can't locate an owner, royalties can sit in 'suspense' or eventually be turned over to the state's unclaimed-property office. Heirs can search state unclaimed-property databases and ask operators about suspense accounts.",
      "Claiming usually requires proof of identity and the chain of inheritance (the same title documents that prove you're the owner), so getting title in order helps here too.",
    ],
    articleSlugs: ["unclaimed-mineral-royalties-heirs", "probate-mineral-rights-heirs"],
    cta: "review",
  },
  {
    id: "co-ownership",
    prompt: "What happens when several heirs co-own the minerals?",
    label: "Co-ownership",
    answer: [
      "Heirs often end up as co-tenants holding undivided fractional interests — each owns a share of the whole, not a specific piece of ground. Co-owners are generally paid their fraction and can usually lease or sell their own interest.",
      "Some decisions go more smoothly with agreement among the owners. If siblings or relatives co-own, it's worth understanding each person's fraction before any leasing or sale conversation.",
    ],
    articleSlugs: ["co-tenancy-undivided-interest-mineral-rights", "net-mineral-acres-net-royalty-acres"],
    cta: "question",
  },
  {
    id: "nma-nra",
    prompt: "What's the difference between net mineral acres and net royalty acres?",
    label: "NMA vs. NRA",
    answer: [
      "Net mineral acres (NMA) measure how much mineral acreage you own. Net royalty acres (NRA) normalize that to a standard royalty so interests under different lease royalties can be compared on equal footing.",
      "Buyers and appraisers often quote in NRA, so knowing the difference helps you compare offers apples-to-apples rather than being misled by a big-sounding acreage number.",
    ],
    articleSlugs: ["net-mineral-acres-net-royalty-acres", "mineral-rights-valuation-basics"],
    cta: "offer",
  },
];

// ---------------------------------------------------------------------------
// Guided intake — structured questions used for the lead summary handoff.
// ---------------------------------------------------------------------------

export interface IntakeState {
  state: string;
  county: string;
  producingStatus: "" | "producing" | "not_producing" | "not_sure";
  ownerStatus: "" | "heir" | "current_owner" | "executor" | "not_sure";
  operatorInfo: string;
  offerAmount: string;
  goal: "" | "understand" | "value" | "sell" | "question";
  notes: string;
}

export const EMPTY_INTAKE: IntakeState = {
  state: "",
  county: "",
  producingStatus: "",
  ownerStatus: "",
  operatorInfo: "",
  offerAmount: "",
  goal: "",
  notes: "",
};

export const PRODUCING_OPTIONS = [
  { value: "producing", label: "Producing" },
  { value: "not_producing", label: "Not producing" },
  { value: "not_sure", label: "Not sure" },
] as const;

export const OWNER_STATUS_OPTIONS = [
  { value: "heir", label: "I inherited / am an heir" },
  { value: "current_owner", label: "I already own them" },
  { value: "executor", label: "I'm handling an estate" },
  { value: "not_sure", label: "Not sure yet" },
] as const;

export const GOAL_OPTIONS = [
  { value: "understand", label: "Understand what I have" },
  { value: "value", label: "Estimate the value" },
  { value: "sell", label: "Explore selling" },
  { value: "question", label: "Ask a specific question" },
] as const;

const PRODUCING_LABELS: Record<string, string> = {
  producing: "Producing",
  not_producing: "Not producing",
  not_sure: "Not sure",
};
const OWNER_LABELS: Record<string, string> = {
  heir: "Heir / inherited",
  current_owner: "Current owner",
  executor: "Handling an estate",
  not_sure: "Not sure",
};
const GOAL_LABELS: Record<string, string> = {
  understand: "Understand what they have",
  value: "Estimate value",
  sell: "Explore selling",
  question: "Ask a specific question",
};

/** Maps the assistant's `goal` to the review-form intent for attribution. */
export function goalToIntent(goal: IntakeState["goal"]): "inherited" | "offer" | "value" | "general" {
  if (goal === "value") return "value";
  if (goal === "sell") return "offer";
  if (goal === "understand") return "inherited";
  return "general";
}

/**
 * Build a human-readable summary of the conversation + intake, used as the
 * `notes`/assistantSummary field on the lead and surfaced in Slack.
 */
export function buildAssistantSummary(
  intake: IntakeState,
  transcript: { role: "user" | "assistant"; text: string }[],
): string {
  const lines: string[] = ["— Assistant intake —"];
  if (intake.goal) lines.push(`Goal: ${GOAL_LABELS[intake.goal] ?? intake.goal}`);
  if (intake.state) lines.push(`State: ${intake.state}`);
  if (intake.county) lines.push(`County: ${intake.county}`);
  if (intake.producingStatus)
    lines.push(`Producing: ${PRODUCING_LABELS[intake.producingStatus] ?? intake.producingStatus}`);
  if (intake.ownerStatus)
    lines.push(`Owner status: ${OWNER_LABELS[intake.ownerStatus] ?? intake.ownerStatus}`);
  if (intake.operatorInfo) lines.push(`Operator/royalty: ${intake.operatorInfo}`);
  if (intake.offerAmount) lines.push(`Offer amount: ${intake.offerAmount}`);
  if (intake.notes) lines.push(`Notes: ${intake.notes}`);

  const userTurns = transcript.filter((t) => t.role === "user").slice(-5);
  if (userTurns.length) {
    lines.push("", "— Questions asked —");
    for (const t of userTurns) lines.push(`• ${t.text}`);
  }

  return lines.join("\n").slice(0, 1900);
}

export interface HandoffInput {
  name: string;
  email: string;
  phone: string;
  intake: IntakeState;
  transcript: { role: "user" | "assistant"; text: string }[];
}

/**
 * Build the flat field map submitted to the `private-review-request` Netlify
 * Form for an assistant handoff. Field names mirror the working LeadForm so
 * Netlify (which registered the form from client/index.html) captures every
 * value and fires its email + Slack notifications. The assistant transcript and
 * structured intake are folded into `notes` (the assistant summary). Pure and
 * side-effect-free apart from reading live attribution, so it is unit-testable.
 */
export function buildHandoffPayload({
  name,
  email,
  phone,
  intake,
  transcript,
}: HandoffInput): Record<string, unknown> {
  const intent = goalToIntent(intake.goal);
  const assistantSummary = buildAssistantSummary(intake, transcript);
  const attribution = getAttribution();
  return {
    name,
    email,
    phone,
    state: intake.state,
    county: intake.county,
    producingStatus: intake.producingStatus || "not_sure",
    ownerStatus: intake.ownerStatus || "",
    operatorInfo: intake.operatorInfo,
    offerAmount: intake.offerAmount,
    urgency: intake.goal === "sell" ? "exploring" : "",
    documents: [],
    notes: assistantSummary,
    // `intent=assistant` flags the lead source; `goal`/attribution keep the
    // marketing intent (inherited/offer/value) accurate for downstream reporting.
    intent: "assistant",
    consent: true,
    ...attribution,
    utm_content: attribution.utm_content ?? `assistant-${intent}`,
  };
}
