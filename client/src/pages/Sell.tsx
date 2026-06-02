import { Card } from "@/components/ui/card";
import { CheckCircle2, Lock, Scale } from "lucide-react";
import { PageShell, DisclaimerNote } from "@/components/SiteLayout";
import { PhoneCTA } from "@/components/PhoneCTA";
import { LeadForm } from "@/components/LeadForm";
import { usePageMeta } from "@/hooks/use-page-meta";
import { DISPLAY_PHONE_NUMBER } from "@/lib/analytics";
import { HONEST_DEAL } from "@/lib/content";

export default function Sell() {
  usePageMeta(
    "Sell or Value Your Inherited Minerals — Without the Pressure | Inherited Mineral Rights",
    "Request a private, no-pressure review of your inherited oil and gas mineral rights. Understand what you own before you decide to hold, lease, or sell.",
  );

  return (
    <PageShell>
      {/* Header */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="strata-rule mb-5" />
          <h1 className="text-balance text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl">
            Sell or value your inherited minerals — without the pressure
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            We do buy mineral rights, and we believe the best deals happen when
            owners understand exactly what they have. Share a few details and
            we'll review your situation privately, then walk you through what we
            see — with no obligation to sell.
          </p>
          {DISPLAY_PHONE_NUMBER && (
            <p className="mt-5 text-sm text-muted-foreground">
              Prefer to talk first? <PhoneCTA location="sell-header" className="ml-1" />
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.1fr]">
        {/* Trust column */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-2xl font-semibold text-foreground">How we do business</h2>
          <ul className="mt-5 space-y-4">
            {HONEST_DEAL.map((line) => (
              <li key={line} className="flex gap-3 text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-3">
            <Card className="flex items-start gap-3 p-4">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">Private by default. </span>
                Your information is used only to review your situation — never sold
                or shared with marketers.
              </p>
            </Card>
            <Card className="flex items-start gap-3 p-4">
              <Scale className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">Your advisors welcome. </span>
                We expect you to compare offers and talk to your own attorney or
                CPA before deciding anything.
              </p>
            </Card>
          </div>
        </div>

        {/* Form column */}
        <div>
          <LeadForm intent="general" location="sell" />
          <DisclaimerNote className="mt-5" />
        </div>
      </section>
    </PageShell>
  );
}
