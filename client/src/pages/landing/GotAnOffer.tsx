import { Scale, Search, Clock } from "lucide-react";
import { LandingPage, type LandingContent } from "@/components/LandingPage";

const content: LandingContent = {
  metaTitle: "I Got an Offer for My Mineral Rights — Is It Fair? | Inherited Mineral Rights",
  metaDescription:
    "Received an unsolicited offer to buy your inherited mineral rights? Before you sign, understand what you own and whether the offer is fair. Get a private, no-pressure second opinion.",
  campaign: "got-an-offer",
  intent: "offer",
  badge: "An offer just landed",
  headline: "You got an offer for your minerals. Don't sign yet.",
  subhead:
    "An unsolicited offer can feel like a windfall or a deadline. It's neither. A fair buyer will give you time to understand what you own, compare more than one offer, and read exactly what's being conveyed. Get a free second opinion first.",
  primaryCta: "Get a no-pressure second opinion",
  secondaryCta: { label: "How offers work", route: "/start-here", content: "offer-secondary" },
  points: [
    {
      icon: Search,
      title: "See the whole picture",
      body: "An offer is only as good as what you're giving up. We help you understand the acreage, production, and lease terms behind the number.",
    },
    {
      icon: Scale,
      title: "Compare, don't react",
      body: "One offer is not a market. We encourage you to gather more than one and to read whether it conveys all minerals or just a fraction.",
    },
    {
      icon: Clock,
      title: "Take your time",
      body: "Pressure to sign fast is a red flag, not a feature. A legitimate buyer expects you to review with your own advisors.",
    },
  ],
  afterSubmit: [
    "Tell us the offer amount and who it's from — even a rough figure helps us put it in context.",
    "We review what we can see about the acreage, production, and what the offer actually conveys.",
    "We give you an honest read within a couple of business days, so you can negotiate, compare, or walk away from a position of knowledge.",
  ],
  objections: [
    {
      concern: "The buyer says the offer expires soon.",
      answer:
        "Artificial deadlines are one of the clearest red flags in this business. A legitimate buyer expects you to review, compare, and talk to your advisors. Real value doesn't evaporate in 48 hours.",
    },
    {
      concern: "Aren't you also a buyer? Why would your opinion be honest?",
      answer:
        "We do buy minerals — and we'll tell you plainly when an offer in front of you looks fair, even if it isn't ours. A reputation for straight answers is worth more to us than any single deal.",
    },
    {
      concern: "The number sounds high. Isn't that good enough?",
      answer:
        "Maybe — but 'high' only means something next to what the minerals actually produce and what else they could fetch. We'll help you see whether the figure reflects real value or just a confident sales pitch.",
    },
    {
      concern: "I don't want to offend the person who made the offer.",
      answer:
        "Getting a second opinion is normal and expected. Any buyer worth working with understands you're doing your homework. You owe a stranger's offer nothing.",
    },
  ],
  reassurance:
    "We do buy mineral rights — and we still tell you plainly that you don't have to sell, and rarely need to sell quickly. We'll explain what we see before we ever talk price, and we welcome your attorney or CPA at the table.",
  faqs: [
    {
      q: "How do I know if an offer for my inherited minerals is fair?",
      a: "Fairness depends on what the acreage produces, where it sits relative to active drilling, the lease terms, and current commodity prices. A single lump-sum number means little without that context. We help you compare the offer against what the minerals are reasonably worth.",
    },
    {
      q: "Should I accept the first offer I get?",
      a: "Rarely. One offer is not a market. Gathering a second or third opinion costs you little and often reveals a wide spread. The first unsolicited offer is frequently a starting point, not a ceiling.",
    },
    {
      q: "What are the red flags in a mineral rights offer?",
      a: "Watch for pressure to sign fast, vague language about what's being conveyed (all minerals vs. a fraction), reluctance to put terms in writing, and discouragement from talking to your own attorney. Any of these is reason to slow down.",
    },
    {
      q: "Does the offer cover all my minerals or just part?",
      a: "Read it carefully — some offers convey your entire interest, others only a fraction or only the producing portion. The exact language controls what you keep and what you give up. We can help you understand what a specific offer actually transfers.",
    },
    {
      q: "Is your second opinion really free and no-obligation?",
      a: "Yes. We'll give you an honest read whether or not you ever work with us, and whether or not you decide to sell at all. There's no fee and no commitment.",
    },
    {
      q: "Can I have my attorney or CPA involved?",
      a: "Absolutely — we encourage it. Selling minerals has legal and tax consequences, and your own advisors are welcome at every step. We never ask you to decide without them.",
    },
  ],
};

export default function GotAnOffer() {
  return <LandingPage content={content} />;
}
