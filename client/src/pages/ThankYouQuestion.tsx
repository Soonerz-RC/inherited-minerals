import { useEffect } from "react";
import { Link } from "wouter";
import { CheckCircle2, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageShell, DisclaimerNote } from "@/components/SiteLayout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { trackQuestionConversion } from "@/lib/analytics";

const STEPS = [
  "Your question is posted to the community so others can learn from it.",
  "People who've navigated inherited minerals can weigh in with experience.",
  "Keep it general — never share account numbers or sensitive personal details.",
];

export default function ThankYouQuestion() {
  usePageMeta(
    "Thank you — your question is posted | Inherited Mineral Rights",
    "Your community question was received. Here's what happens next.",
  );

  useEffect(() => {
    trackQuestionConversion({ page: "thank-you-question" });
  }, []);

  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <Card className="p-8 text-center sm:p-10" data-testid="card-thankyou-question">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MessagesSquare className="h-7 w-7 text-primary" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold text-foreground">
            Thanks — your question is posted
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Thank you for sharing. Questions like yours help everyone who's
            trying to understand what they inherited.
          </p>

          <ul className="mx-auto mt-7 max-w-md space-y-3 text-left">
            {STEPS.map((s) => (
              <li key={s} className="flex gap-3 text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/community">
              <Button variant="outline" data-testid="button-thankyou-community">
                Back to Community Q&amp;A
              </Button>
            </Link>
            <Link href="/sell">
              <Button data-testid="button-thankyou-review">
                Want a private review of your own minerals?
              </Button>
            </Link>
          </div>
        </Card>

        <DisclaimerNote className="mt-8" />
      </section>
    </PageShell>
  );
}
