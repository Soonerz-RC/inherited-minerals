import { Link } from "wouter";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageShell, DisclaimerNote } from "@/components/SiteLayout";
import { PhoneCTA } from "@/components/PhoneCTA";
import { usePageMeta } from "@/hooks/use-page-meta";
import { ctaHref } from "@/lib/cta";
import { DISPLAY_PHONE_NUMBER } from "@/lib/analytics";

export interface LandingContent {
  metaTitle: string;
  metaDescription: string;
  campaign: string;
  badge: string;
  headline: string;
  subhead: string;
  primaryCta: string;
  secondaryCta?: { label: string; route: string; content: string };
  points: { icon: LucideIcon; title: string; body: string }[];
  reassurance: string;
}

export function LandingPage({ content }: { content: LandingContent }) {
  usePageMeta(content.metaTitle, content.metaDescription);

  return (
    <PageShell>
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
            <Link href={ctaHref("/sell", content.campaign)}>
              <Button size="lg" className="font-medium" data-testid="button-landing-primary">
                {content.primaryCta}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
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
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
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

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-semibold text-foreground">Ready when you are</h2>
          <p className="max-w-xl text-muted-foreground">
            No obligation, no pressure. Share a few details and a real person will
            walk you through what they see.
          </p>
          <Link href={ctaHref("/sell", `${content.campaign}-footer`)}>
            <Button size="lg" data-testid="button-landing-footer-cta">
              {content.primaryCta}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
          <ul className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["No obligation to sell", "Your advisors welcome", "Private by default"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <DisclaimerNote className="mt-12" />
      </section>
    </PageShell>
  );
}
