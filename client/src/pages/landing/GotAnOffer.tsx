import { Scale, Search, Clock } from "lucide-react";
import { LandingPage, type LandingContent } from "@/components/LandingPage";

const content: LandingContent = {
  metaTitle: "I Got an Offer for My Mineral Rights — Is It Fair? | Inherited Mineral Rights",
  metaDescription:
    "Received an unsolicited offer to buy your inherited mineral rights? Before you sign, understand what you own and whether the offer is fair. Get a private, no-pressure review.",
  campaign: "got-an-offer",
  badge: "An offer just landed",
  headline: "You got an offer for your minerals. Don't sign yet.",
  subhead:
    "An unsolicited offer can feel like a windfall or a deadline. It's neither. A fair buyer will give you time to understand what you own, compare more than one offer, and read exactly what's being conveyed.",
  primaryCta: "Have my offer reviewed",
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
  reassurance:
    "We do buy mineral rights — and we still tell you plainly that you don't have to sell, and rarely need to sell quickly. We'll explain what we see before we ever talk price, and we welcome your attorney or CPA at the table.",
};

export default function GotAnOffer() {
  return <LandingPage content={content} />;
}
