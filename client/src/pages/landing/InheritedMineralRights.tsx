import { FileSearch, Landmark, Compass } from "lucide-react";
import { LandingPage, type LandingContent } from "@/components/LandingPage";

const content: LandingContent = {
  metaTitle: "I Inherited Mineral Rights — What Do I Do Now? | Inherited Mineral Rights",
  metaDescription:
    "Just inherited oil and gas mineral rights? Get a plain-English starting point: documents, title, royalty checks, and a private, no-pressure review of what you own.",
  campaign: "inherited-minerals",
  badge: "You just inherited minerals",
  headline: "You inherited mineral rights. Here's how to understand them.",
  subhead:
    "A royalty check, an old deed, or a probate file just made you a mineral owner — and probably left you with more questions than answers. Start by understanding exactly what you own, before anyone asks you to sign anything.",
  primaryCta: "Get a private review",
  secondaryCta: { label: "Ask the assistant", route: "/ask", content: "inherited-secondary" },
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
  reassurance:
    "There is rarely any reason to rush an inheritance decision. We won't ask you to sell, and we expect you to talk with your own attorney or CPA. Our goal is simply that you understand what you inherited first.",
};

export default function InheritedMineralRights() {
  return <LandingPage content={content} />;
}
