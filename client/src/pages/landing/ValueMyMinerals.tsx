import { Gauge, MapPin, ReceiptText } from "lucide-react";
import { LandingPage, type LandingContent } from "@/components/LandingPage";

const content: LandingContent = {
  metaTitle: "What Are My Inherited Mineral Rights Worth? | Inherited Mineral Rights",
  metaDescription:
    "Wondering what your inherited mineral rights are worth? Value depends on production, location, lease terms, and prices. Get a private, no-pressure valuation review of your minerals.",
  campaign: "value-my-minerals",
  intent: "value",
  badge: "Value my minerals",
  headline: "What are your inherited minerals actually worth?",
  subhead:
    "Two parcels in the same county can be worth wildly different amounts. Value depends on whether the acreage is producing, the lease terms, location relative to active drilling, and commodity prices. We'll help you make sense of it — privately and at no cost.",
  primaryCta: "Get a private valuation review",
  secondaryCta: {
    label: "Try the value calculator",
    route: "/tools/inherited-mineral-rights-calculator",
    content: "value-calculator",
  },
  points: [
    {
      icon: Gauge,
      title: "Producing or not",
      body: "Whether your minerals are currently producing — and how much — is the single biggest driver of value. We start there.",
    },
    {
      icon: MapPin,
      title: "Location matters",
      body: "Acreage near active drilling can carry future upside that a flat offer ignores. Where the minerals sit shapes the number.",
    },
    {
      icon: ReceiptText,
      title: "The paper tells the story",
      body: "Recent check stubs, the lease, and a description of the acreage are the inputs most valuations start from. Bring what you have.",
    },
  ],
  afterSubmit: [
    "Share the basics — county and state, whether it's producing, and the operator or a recent check stub if you have one.",
    "We look at production, location relative to active drilling, and lease terms to frame a realistic range — not a single inflated number.",
    "We walk you through how we got there and what would move it, within a couple of business days. No obligation to sell.",
  ],
  objections: [
    {
      concern: "Why won't you just give me one number?",
      answer:
        "Because honest valuation is a range, not a single figure. Anyone who hands you one precise number sight-unseen is selling, not valuing. We'll show you the range and exactly what moves it.",
    },
    {
      concern: "My minerals aren't producing — are they worth anything?",
      answer:
        "Possibly. Non-producing acreage can still carry value from nearby drilling, lease potential, or future development. It's a different calculation than producing minerals, and worth understanding before you write it off — or sell it cheap.",
    },
    {
      concern: "I only have a check stub, not the full paperwork.",
      answer:
        "A recent check stub is one of the most useful things you can share — it often reveals the operator, your decimal interest, and roughly what the acreage pays. Bring what you have and we'll work from there.",
    },
    {
      concern: "Is this just a way to make me a lowball offer?",
      answer:
        "No. The valuation review stands on its own, whether or not you ever sell. We'd rather you understand the real range — even if it means you hold, or take a better offer elsewhere.",
    },
  ],
  reassurance:
    "Be cautious with any single figure presented as 'the' value of your minerals. We'll walk you through how we arrive at a range and what would move it — and you're free to take that to your own advisors.",
  faqs: [
    {
      q: "What determines the value of inherited mineral rights?",
      a: "The biggest factors are whether the minerals are currently producing and how much, the location relative to active drilling, the lease terms, your decimal ownership interest, and current oil and gas prices. Two parcels in the same county can be worth very different amounts because of these.",
    },
    {
      q: "What's the difference between producing and non-producing minerals?",
      a: "Producing minerals generate royalty income now, so they're valued largely on that cash flow. Non-producing minerals have no current income but may hold value from nearby drilling, future leasing, or development potential. They're valued differently, and non-producing doesn't mean worthless.",
    },
    {
      q: "What information do you need to estimate value?",
      a: "Ideally the county and state, whether it's producing, the operator name, your decimal interest, and a recent check stub or lease. Even a subset helps — a single check stub often reveals the operator and roughly what the acreage pays.",
    },
    {
      q: "How do I find out who operates my minerals or what my royalty is?",
      a: "A recent royalty check stub usually names the operator and shows your decimal interest. If you don't have one, the state oil and gas commission and the county records where the minerals sit can help identify the operator. We can point you to the right place.",
    },
    {
      q: "Will you give me an exact dollar figure?",
      a: "We give you a realistic range and explain what moves it, rather than a single number. Honest valuation accounts for uncertainty — production decline, prices, and title all factor in. A precise figure offered sight-unseen is usually a sales tactic.",
    },
    {
      q: "Is the valuation review free, and do I have to sell?",
      a: "The review is free and there's no obligation to sell. Many owners use it simply to understand what they hold. You're free to take our range to your own advisors or to other buyers.",
    },
  ],
};

export default function ValueMyMinerals() {
  return <LandingPage content={content} />;
}
