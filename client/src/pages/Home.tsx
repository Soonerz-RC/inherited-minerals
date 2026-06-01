import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  MessageCircleQuestion,
  Sparkles,
  Users,
  ShieldCheck,
  CheckCircle2,
  HandCoins,
} from "lucide-react";
import { PageShell } from "@/components/SiteLayout";
import { LogoMark } from "@/components/Logo";
import {
  SITUATIONS,
  STEPS,
  QA_CATEGORIES,
  HONEST_DEAL,
} from "@/lib/content";
import heroImg from "@assets/hero-landscape.png";

export default function Home() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <PageShell>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Rural ranchland at golden hour with a distant pumpjack"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="mb-5 border-bronze bg-background/70 text-bronze"
              data-testid="badge-hero"
            >
              For families who inherited oil &amp; gas minerals
            </Badge>
            <h1 className="text-balance text-4xl font-semibold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
              Understand what you inherited before you sign.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Inheriting mineral rights can be confusing — probate, title,
              royalty checks, surprise offers. We explain it in plain English,
              answer your questions, and help you decide on your own terms.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/start-here">
                <Button size="lg" className="w-full sm:w-auto" data-testid="button-hero-start">
                  Start here — it's free
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sell">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full bg-background/70 sm:w-auto"
                  data-testid="button-hero-review"
                >
                  Request a private review
                </Button>
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              No pressure, no obligation, and no advice you didn't ask for.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- SITUATION CARDS ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <div className="strata-rule mb-5" />
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
            Does one of these sound like you?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Most people land here because something arrived in the mail or a
            family conversation raised more questions than answers. You're not
            behind — you're just getting started.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {SITUATIONS.map((s) => (
            <Card
              key={s.title}
              className="p-6"
              data-testid={`card-situation-${s.title.slice(0, 12)}`}
            >
              <h3 className="font-serif text-lg font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-2.5 leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------------- FIRST FIVE STEPS ---------------- */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="strata-rule mb-5" />
              <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
                Your first five steps
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A calm order of operations, from the moment you realize you've
                inherited minerals to the moment you're ready to make a choice.
              </p>
            </div>
            <Link href="/start-here" className="shrink-0">
              <Button variant="outline" data-testid="button-steps-full-guide">
                See the full guide
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.title}>
                  <Card className="flex h-full flex-col p-5" data-testid={`card-step-${i + 1}`}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-sm font-semibold text-primary-foreground">
                        {i + 1}
                      </span>
                      <Icon className="h-5 w-5 text-bronze" />
                    </div>
                    <h3 className="mt-4 font-serif text-base font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.summary}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ---------------- AI ASSISTANT TEASER ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Card className="overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="p-8 sm:p-10">
              <Badge variant="outline" className="mb-4 border-bronze text-bronze">
                <Sparkles className="mr-1 h-3.5 w-3.5" /> Coming soon · preview
              </Badge>
              <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
                Ask a plain-English question, any time
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Our assistant is being trained specifically on inherited mineral
                rights — probate, title, royalty checks, valuation, and what to
                watch for in an offer. It explains concepts and points you to the
                right next step. It will never pretend to be your lawyer or
                accountant.
              </p>
              <Link href="/ask">
                <Button className="mt-6" data-testid="button-ai-teaser">
                  Try the preview
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="border-t border-border bg-secondary/50 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="space-y-3">
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground">
                  I just inherited minerals in Reeves County, TX. Where do I even
                  start?
                </div>
                <div className="flex max-w-[90%] gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <LogoMark className="h-5 w-5" />
                  </span>
                  <div className="rounded-2xl rounded-bl-sm border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground">
                    A good first step is to gather the death certificate, any
                    will, the prior mineral deed, and recent check stubs — then
                    confirm the minerals are in your name on the county record.
                    Here's the order most people follow…
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ---------------- Q&A / COMMUNITY TEASER ---------------- */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <div className="strata-rule mb-5" />
              <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
                A community of people in the same boat
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Real questions from real heirs — and answers grounded in
                experience, not sales pitches. Browse by topic or ask your own.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {QA_CATEGORIES.map((c) => (
                  <Badge
                    key={c.label}
                    variant="secondary"
                    className="font-normal"
                    data-testid={`badge-category-${c.label.slice(0, 8)}`}
                  >
                    {c.label}
                    <span className="ml-1.5 text-muted-foreground">{c.count}</span>
                  </Badge>
                ))}
              </div>
              <Link href="/community">
                <Button className="mt-7" data-testid="button-community-teaser">
                  <Users className="mr-1.5 h-4 w-4" />
                  Browse the community
                </Button>
              </Link>
            </div>

            <Card className="p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <MessageCircleQuestion className="mt-0.5 h-6 w-6 shrink-0 text-bronze" />
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    “My dad passed and I got a royalty check in his name — what now?”
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    The check came from an operator I've never heard of, made out
                    to my late father. I don't want to do anything wrong by
                    cashing it. What's the right first step?
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                    <Badge variant="outline">Royalty checks</Badge>
                    <span>·</span>
                    <span>Texas</span>
                    <span>·</span>
                    <span>7 answers</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ---------------- SELLING / VALUE ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="strata-rule mb-5" />
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Thinking about selling? Start by understanding value.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              We do buy mineral rights — and we believe the best transactions
              happen when owners fully understand what they have. If you'd like,
              we'll review your situation privately and walk you through what we
              see, with no obligation to sell.
            </p>

            <ul className="mt-6 space-y-3">
              {HONEST_DEAL.map((line) => (
                <li key={line} className="flex gap-3 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>

            <Link href="/sell">
              <Button size="lg" className="mt-8" data-testid="button-sell-section">
                <HandCoins className="mr-1.5 h-4 w-4" />
                Request a private review
              </Button>
            </Link>
          </div>

          <Card className="bg-primary p-8 text-primary-foreground sm:p-10">
            <p className="font-serif text-xl font-medium leading-relaxed">
              “We'd rather you walk away understanding your minerals than sign
              something you'll regret. That's not a slogan — it's how we want to
              do business.”
            </p>
            <div className="mt-6 flex items-center gap-3 border-t border-primary-foreground/20 pt-6">
              <LogoMark className="h-9 w-9 text-primary-foreground" />
              <div className="text-sm">
                <div className="font-medium">Inherited Mineral Rights</div>
                <div className="text-primary-foreground/70">
                  Education first. Offers second.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ---------------- TRUST / DISCLAIMER ---------------- */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <ShieldCheck className="h-8 w-8 shrink-0 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Honest about what this is — and isn't
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Everything on this site is general education to help you ask
                better questions and avoid common mistakes. It is{" "}
                <span className="font-medium text-foreground">
                  not legal, tax, or financial advice
                </span>
                , and using it does not create an attorney–client relationship.
                Mineral rights rules vary by state and by your specific
                documents. Before making any decision — especially selling —
                please talk with a qualified attorney, CPA, or licensed
                professional who can review your situation directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Card className="overflow-hidden border-bronze/40 bg-secondary/60 p-10 text-center sm:p-14">
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold text-foreground sm:text-4xl">
            Take the next step at your own pace
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Start with the free guide, ask the assistant a question, or request a
            private review. There's no wrong door, and no clock running.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/start-here">
              <Button size="lg" className="w-full sm:w-auto" data-testid="button-final-start">
                Read the Start Here guide
              </Button>
            </Link>
            <Link href="/ask">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                data-testid="button-final-ask"
              >
                Ask the assistant
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
