import { useEffect } from "react";
import { Link } from "wouter";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageShell, DisclaimerNote } from "@/components/SiteLayout";
import { PhoneCTA } from "@/components/PhoneCTA";
import { usePageMeta } from "@/hooks/use-page-meta";
import { trackReviewConversion, DISPLAY_PHONE_NUMBER } from "@/lib/analytics";

const STEPS = [
  "A real person reviews the details you shared — privately.",
  "We look at what we can see about your minerals before any talk of price.",
  "We reach out within a couple of business days to walk you through it.",
];

export default function ThankYouReview() {
  usePageMeta(
    "Thank you — your private review is in | Inherited Mineral Rights",
    "Your private mineral review request was received. Here's what happens next.",
  );

  useEffect(() => {
    trackReviewConversion({ page: "thank-you-review" });
  }, []);

  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <Card className="p-8 text-center sm:p-10" data-testid="card-thankyou-review">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold text-foreground">
            Thank you — your request is in
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            We've received your request for a private review. There's no
            obligation, and you're free to step away at any point.
          </p>

          <ul className="mx-auto mt-7 max-w-md space-y-3 text-left">
            {STEPS.map((s) => (
              <li key={s} className="flex gap-3 text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link href="/start-here">
              <Button variant="outline" data-testid="button-thankyou-secondary">
                While you wait, read the Start Here guide
              </Button>
            </Link>
            {DISPLAY_PHONE_NUMBER && (
              <p className="text-sm text-muted-foreground">
                Have a question now? <PhoneCTA location="thank-you-review" className="ml-1" />
              </p>
            )}
          </div>
        </Card>

        <DisclaimerNote className="mt-8" />
      </section>
    </PageShell>
  );
}
