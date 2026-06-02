import { FileSearch, Landmark, Compass } from "lucide-react";
import { LandingPage, type LandingContent } from "@/components/LandingPage";

const content: LandingContent = {
  metaTitle: "I Inherited Mineral Rights — What Do I Do Now? | Inherited Mineral Rights",
  metaDescription:
    "Just inherited oil and gas mineral rights? Get a plain-English starting point: documents, title, royalty checks, and a private, no-pressure review of what you own.",
  campaign: "inherited-minerals",
  intent: "inherited",
  badge: "You just inherited minerals",
  headline: "You inherited mineral rights. Here's how to understand them.",
  subhead:
    "A royalty check, an old deed, or a probate file just made you a mineral owner — and probably left you with more questions than answers. Start by understanding exactly what you own, before anyone asks you to sign anything.",
  primaryCta: "Get a private review",
  secondaryCta: { label: "Read the Start Here guide", route: "/start-here", content: "inherited-secondary" },
  points: [
    {
      icon: FileSearch,
      title: "Know what you hold",
      body: "We help you make sense of deeds, royalty stubs, and division orders so you can see what was actually passed down to you.",
    },
    {
      icon: Landmark,
      title: "Get title sorted",
      body: "Operators won't pay you until the record shows you as the owner. We explain the usual paths — probate, affidavit of heirship, or a recorded deed.",
    },
    {
      icon: Compass,
      title: "Decide on your terms",
      body: "Hold, lease, or sell — that's your call. We give you the context to make it without pressure or a ticking clock.",
    },
  ],
  afterSubmit: [
    "A real person reviews the details you share — privately, with no automated sales sequence.",
    "We help you map what you inherited: the state and county, whether it's producing, and what documents you still need.",
    "We reach out within a couple of business days with plain-English next steps — no obligation, no price talk unless you ask.",
  ],
  objections: [
    {
      concern: "I don't even know what I inherited.",
      answer:
        "That's the most common place to start. A recent check stub, an old deed, or estate paperwork is usually enough for us to point you in the right direction. Share what you have and we'll work from there.",
    },
    {
      concern: "Is this going to cost me anything?",
      answer:
        "The review is free and there's no obligation. We make our living buying minerals from owners who choose to sell — but understanding comes first, and many people we help never sell at all.",
    },
    {
      concern: "I'm worried about being pressured to sell.",
      answer:
        "There is rarely any reason to rush an inheritance decision. We won't push you, and we expect you to talk with your own attorney or CPA before deciding anything.",
    },
    {
      concern: "The estate is still in probate.",
      answer:
        "That's fine — many people reach out mid-probate. We can explain how minerals typically pass to heirs and what to have ready once title clears, so you're not caught flat-footed.",
    },
  ],
  reassurance:
    "There is rarely any reason to rush an inheritance decision. We won't ask you to sell, and we expect you to talk with your own attorney or CPA. Our goal is simply that you understand what you inherited first.",
  faqs: [
    {
      q: "I just inherited mineral rights — what's the very first thing I should do?",
      a: "Gather what you have: a death certificate, any will or estate paperwork, prior mineral deeds, and recent royalty or check stubs. These documents tell the story of what was owned and how it passes to you. You don't need everything to start — even one document helps.",
    },
    {
      q: "How do I get the mineral rights put into my name?",
      a: "Operators and buyers won't recognize you as owner until the public record shows it. The usual paths are probate, an affidavit of heirship, or a recorded deed, and the right one depends on the state and how the estate was set up. This is typically where a qualified attorney earns their fee.",
    },
    {
      q: "A royalty check arrived in my late relative's name. Can I cash it?",
      a: "Hold off until title is updated. Checks made out to someone who has passed away usually need the ownership corrected first, and the operator may place payments in 'suspense' until that happens. We can explain how to get those payments released to you.",
    },
    {
      q: "What's a division order, and should I sign the one I received?",
      a: "A division order states your decimal ownership interest — how much you'll be paid going forward. It's worth checking that decimal against your deed before signing, because it controls your share. We can help you understand it before you commit.",
    },
    {
      q: "Do I have to sell my inherited minerals?",
      a: "No. Holding, leasing, and selling are all valid choices, and there's rarely a reason to rush. Our goal is to help you understand what you own so any decision — including doing nothing — is an informed one.",
    },
    {
      q: "Will you share my information with anyone?",
      a: "No. Your details are used only to review your situation and are never sold or shared with marketers. You can step away at any point.",
    },
  ],
};

export default function InheritedMineralRights() {
  return <LandingPage content={content} />;
}
