import { Link } from "wouter";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, ShieldCheck, Lock, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageShell, DisclaimerNote } from "@/components/SiteLayout";
import { PhoneCTA } from "@/components/PhoneCTA";
import { LeadForm, type LeadIntent } from "@/components/LeadForm";
import { usePageMeta } from "@/hooks/use-page-meta";
import { ctaHref } from "@/lib/cta";
import { DISPLAY_PHONE_NUMBER } from "@/lib/analytics";

export interface LandingContent {
  metaTitle: string;
  metaDescription: string;
  campaign: string;
  /** Drives which optional qualifying fields the embedded form shows. */
  intent: LeadIntent;
  badge: string;
  headline: string;
  subhead: string;
  primaryCta: string;
  secondaryCta?: { label: string; route: string; content: string };
  points: { icon: LucideIcon; title: string; body: string }[];
  /** Plain-language list of what happens after the form is submitted. */
  afterSubmit: string[];
  /** Objection-handling Q/A pairs surfaced as short cards. */
  objections: { concern: string; answer: string }[];
  reassurance: string;
  faqs: { q: string; a: string }[];
}

export function LandingPage({ content }: { content: LandingContent }) {
  usePageMeta(content.metaTitle, content.metaDescription);

  return (
    <PageShell>
      {/* Hero */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="strata-rule mb-5" />
          <Badge variant="outline" className="mb-5 border-bronze text-bronze">
            {content.badge}
          </Badge>
          <h1 className="text-balance text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl">
            {content.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {content.subhead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#lead-form">
              <Button size="lg" className="font-medium" data-testid="button-landing-primary">
                {content.primaryCta}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </a>
            {content.secondaryCta && (
              <Link href={ctaHref(content.secondaryCta.route, content.secondaryCta.content)}>
                <Button size="lg" variant="outline" data-testid="button-landing-secondary">
                  {content.secondaryCta.label}
                </Button>
              </Link>
            )}
          </div>

          {DISPLAY_PHONE_NUMBER && (
            <p className="mt-5 text-sm text-muted-foreground">
              Prefer to talk? <PhoneCTA location={`landing-${content.campaign}`} className="ml-1" />
            </p>
          )}

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["No obligation to sell", "Your attorney or CPA welcome", "Private by default"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Value points */}
      <section className="mx-auto max-w-5xl px-4 pt-14 sm:px-6 sm:pt-16">
        <div className="grid gap-5 sm:grid-cols-3">
          {content.points.map((p) => (
            <Card key={p.title} className="p-6">
              <p.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-serif text-lg font-semibold text-foreground">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-10 flex items-start gap-3 border-bronze/30 bg-secondary/40 p-6">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
          <p className="leading-relaxed text-muted-foreground">{content.reassurance}</p>
        </Card>
      </section>

      {/* Form + what-happens-next */}
      <section
        id="lead-form"
        className="mx-auto grid max-w-5xl scroll-mt-20 gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.1fr]"
      >
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-2xl font-semibold text-foreground">What happens after you submit</h2>
          <ol className="mt-5 space-y-4">
            {content.afterSubmit.map((step, i) => (
              <li key={step} className="flex gap-3 text-muted-foreground">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

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
                We expect you to compare your options and talk to your own attorney
                or CPA before deciding anything.
              </p>
            </Card>
          </div>
        </div>

        <div>
          <LeadForm intent={content.intent} location={`landing-${content.campaign}`} submitLabel={content.primaryCta} />
          <DisclaimerNote className="mt-5" />
        </div>
      </section>

      {/* Objection handling */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 className="text-2xl font-semibold text-foreground">Honest answers to what you're probably thinking</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {content.objections.map((o) => (
              <Card key={o.concern} className="p-6">
                <p className="font-serif text-base font-semibold text-foreground">{o.concern}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
        <h2 className="text-2xl font-semibold text-foreground">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="mt-6" data-testid="landing-faq">
          {content.faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-semibold text-foreground">Ready when you are</h2>
          <p className="max-w-xl text-muted-foreground">
            No obligation, no pressure. Share a few details and a real person will
            walk you through what they see.
          </p>
          <a href="#lead-form">
            <Button size="lg" data-testid="button-landing-footer-cta">
              {content.primaryCta}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </a>
        </div>

        <DisclaimerNote className="mt-12" />
      </section>
    </PageShell>
  );
}
