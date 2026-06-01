import { Gauge, MapPin, ReceiptText } from "lucide-react";
import { LandingPage, type LandingContent } from "@/components/LandingPage";

const content: LandingContent = {
  metaTitle: "What Are My Inherited Mineral Rights Worth? | Inherited Mineral Rights",
  metaDescription:
    "Wondering what your inherited mineral rights are worth? Value depends on production, location, lease terms, and prices. Get a private, no-pressure review of your minerals.",
  campaign: "value-my-minerals",
  badge: "Value my minerals",
  headline: "What are your inherited minerals actually worth?",
  subhead:
    "Two parcels in the same county can be worth wildly different amounts. Value depends on whether the acreage is producing, the lease terms, location relative to active drilling, and commodity prices. We'll help you make sense of it.",
  primaryCta: "Get a private valuation review",
  secondaryCta: { label: "Ask the assistant", route: "/ask", content: "value-secondary" },
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
  reassurance:
    "Be cautious with any single figure presented as 'the' value of your minerals. We'll walk you through how we arrive at a range and what would move it — and you're free to take that to your own advisors.",
};

export default function ValueMyMinerals() {
  return <LandingPage content={content} />;
}
