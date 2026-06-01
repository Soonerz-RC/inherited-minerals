import {
  FileSearch,
  Landmark,
  ReceiptText,
  Scale,
  Map,
  HandCoins,
} from "lucide-react";

// Shared content used across the homepage and Start Here guide so copy stays
// consistent and easy to edit in one place.

export const SITUATIONS = [
  {
    title: "“I got a letter offering to buy my minerals.”",
    body: "An offer arrived before you even understood what you own. You want to know if it's fair — and what you'd be giving up.",
  },
  {
    title: "“A royalty check showed up in a relative's name.”",
    body: "Money is arriving, but the paperwork still points to someone who passed away. You're not sure how to get it corrected.",
  },
  {
    title: "“The estate is in probate and minerals came up.”",
    body: "An attorney or family member mentioned mineral rights, and now you're trying to understand how they pass to you.",
  },
  {
    title: "“I have a deed but no idea what it's worth.”",
    body: "You found an old mineral deed in a drawer. You don't know if it's producing, leased, or worth anything at all.",
  },
];

export const STEPS = [
  {
    icon: FileSearch,
    title: "Gather the documents",
    summary:
      "Collect the death certificate, any will or estate paperwork, prior mineral deeds, and recent royalty or check stubs.",
    detail:
      "These documents tell the story of what was owned and how it should pass to you. Keep originals together in one folder and make copies before mailing anything. If you can't find a deed, the county clerk's office where the minerals are located keeps recorded copies.",
  },
  {
    icon: Map,
    title: "Locate the minerals",
    summary:
      "Pin down the state and county where the minerals sit, and the legal description of the acreage.",
    detail:
      "Mineral ownership is tied to a specific piece of ground, described by section, township, and range (or by survey). The same family can own minerals in more than one county or state, each handled separately under that state's rules.",
  },
  {
    icon: Landmark,
    title: "Clear and update title",
    summary:
      "Work out what's needed to move ownership into your name — often probate, an affidavit of heirship, or a recorded deed.",
    detail:
      "Operators and buyers won't recognize you as the owner until the public record shows it. The right path depends on the state and how the estate was set up, so this is usually where a qualified attorney earns their fee.",
  },
  {
    icon: ReceiptText,
    title: "Understand the income",
    summary:
      "Learn how royalty checks, division orders, and any 'suspense' payments work before you sign anything.",
    detail:
      "A division order states your decimal ownership interest. It's worth checking that decimal against your deed before signing, because it controls how much you're paid going forward. Held-up payments often release once updated title is on file.",
  },
  {
    icon: Scale,
    title: "Decide what's right for you",
    summary:
      "Only after you understand what you own should you weigh whether to hold, lease, or consider an offer.",
    detail:
      "There's rarely a reason to rush. A legitimate buyer will give you time to review, compare more than one offer, and talk to your own advisors. Understanding comes first — decisions come second.",
  },
];

export const QA_CATEGORIES = [
  { label: "Probate & estate", count: 48 },
  { label: "Title & deeds", count: 36 },
  { label: "Royalty checks", count: 41 },
  { label: "Division orders", count: 22 },
  { label: "Valuation", count: 29 },
  { label: "Leasing", count: 18 },
  { label: "Selling & offers", count: 33 },
  { label: "Taxes", count: 15 },
];

export const SAMPLE_QUESTIONS = [
  {
    title: "My dad passed and I got a royalty check in his name — what now?",
    category: "Royalty checks",
    state: "Texas",
    excerpt:
      "The check came from an operator I've never heard of, made out to my late father. I don't want to do anything wrong by cashing it. What's the right first step?",
    answers: 7,
  },
  {
    title: "Is an affidavit of heirship enough, or do we need full probate?",
    category: "Probate & estate",
    state: "Oklahoma",
    excerpt:
      "There's no will, just a few of us siblings. Someone said an affidavit of heirship can transfer the minerals without probate. Is that true everywhere?",
    answers: 12,
  },
  {
    title: "How do I know if a buyer's offer for inherited minerals is fair?",
    category: "Selling & offers",
    state: "New Mexico",
    excerpt:
      "We got an unsolicited offer of a lump sum. It sounds like a lot, but we have no idea what the acreage actually produces. How do people sanity-check this?",
    answers: 9,
  },
  {
    title: "What does the decimal on my division order actually mean?",
    category: "Division orders",
    state: "North Dakota",
    excerpt:
      "The operator sent a division order with a tiny decimal number next to my name. How is that calculated, and should I verify it before signing?",
    answers: 5,
  },
];

export const HONEST_DEAL = [
  "We tell you plainly that you do not have to sell — and that selling is rarely urgent.",
  "We explain what we can see about your minerals before we ever talk price.",
  "We encourage you to compare any offer and to talk to your own attorney or CPA.",
  "We put the terms in writing in plain English, so you know exactly what's being conveyed.",
];

export const DOC_OPTIONS = [
  "Prior mineral deed",
  "Recent royalty / check stub",
  "Division order",
  "Lease agreement",
  "Probate or estate paperwork",
  "Not sure / none yet",
];

export { HandCoins };
