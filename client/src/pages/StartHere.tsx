import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { PageShell, DisclaimerNote } from "@/components/SiteLayout";
import { STEPS } from "@/lib/content";
import docsImg from "@assets/documents-still-life.png";

const PITFALLS = [
  "Signing a division order or offer before confirming what you actually own.",
  "Assuming a single unsolicited offer reflects the true value of the acreage.",
  "Letting royalty checks pile up uncashed instead of getting title corrected.",
  "Treating minerals in different states as one problem — each follows its own rules.",
];

export default function StartHere() {
  return (
    <PageShell>
      {/* Header */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <Badge variant="outline" className="mb-4 border-bronze text-bronze">
              The Start Here guide
            </Badge>
            <h1 className="text-balance text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl">
              You just inherited mineral rights. Here's what to do, in order.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              This is the calm, step-by-step path most heirs wish someone had
              handed them on day one. Work through it at your own pace — nothing
              here is urgent, and understanding always comes before deciding.
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            <img
              src={docsImg}
              alt="Inherited estate documents, a deed, and a land map on a table"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <ol className="space-y-12">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="relative pl-16" data-testid={`guide-step-${i + 1}`}>
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-serif text-lg font-semibold text-primary-foreground">
                  {i + 1}
                </div>
                <div className="flex items-center gap-2.5">
                  <Icon className="h-5 w-5 text-bronze" />
                  <h2 className="text-2xl font-semibold text-foreground">
                    {step.title}
                  </h2>
                </div>
                <p className="mt-3 text-lg font-medium leading-relaxed text-foreground">
                  {step.summary}
                </p>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {step.detail}
                </p>
                {i < STEPS.length - 1 && (
                  <div className="strata-rule mt-8 opacity-60" />
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* Common pitfalls */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-6 w-6 text-bronze" />
            <h2 className="text-2xl font-semibold text-foreground">
              Common mistakes to avoid
            </h2>
          </div>
          <p className="mt-3 text-muted-foreground">
            None of these are the end of the world — but knowing them ahead of
            time saves stress, time, and sometimes real money.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {PITFALLS.map((p) => (
              <Card key={p} className="flex gap-3 p-5">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-bronze" />
                <span className="leading-relaxed text-muted-foreground">{p}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + disclaimer */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
        <DisclaimerNote className="mb-10" />
        <Card className="bg-secondary/60 p-8 text-center sm:p-10">
          <h2 className="text-2xl font-semibold text-foreground">
            Have a specific question?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Ask our assistant for plain-English context, or post to the community
            and hear from people who've been through it.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/ask">
              <Button className="w-full sm:w-auto" data-testid="button-guide-ask">
                Ask the assistant
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/community">
              <Button variant="outline" className="w-full sm:w-auto" data-testid="button-guide-community">
                Visit the community
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
