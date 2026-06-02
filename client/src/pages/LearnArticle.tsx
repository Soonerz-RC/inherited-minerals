import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { PageShell, DisclaimerNote } from "@/components/SiteLayout";
import { usePageMeta } from "@/hooks/use-page-meta";
import {
  articlesBySlug,
  CTA_LABELS,
  CTA_ROUTES,
  type Article,
  type Block,
  type CtaSpec,
} from "@/lib/learn";
import NotFound from "@/pages/not-found";

function CtaBlock({ cta }: { cta: CtaSpec }) {
  return (
    <Card
      className="my-8 flex flex-col gap-4 border-bronze/40 bg-secondary/60 p-6 sm:flex-row sm:items-center sm:justify-between"
      data-testid={`cta-${cta.kind}`}
    >
      <p className="text-base font-medium leading-relaxed text-foreground">
        {cta.text}
      </p>
      <Link href={CTA_ROUTES[cta.kind]} className="shrink-0">
        <Button className="w-full sm:w-auto" data-testid={`button-cta-${cta.kind}`}>
          {CTA_LABELS[cta.kind]}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </Link>
    </Card>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="mt-4 leading-relaxed text-foreground/90">{block.text}</p>;
    case "bullets":
      return (
        <ul className="mt-4 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2.5 leading-relaxed text-foreground/90">
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-bronze" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div className="mt-5 rounded-lg border border-border bg-card p-5">
          {block.title && (
            <p className="font-semibold text-foreground">{block.title}</p>
          )}
          <p className="mt-1 leading-relaxed text-muted-foreground">{block.text}</p>
        </div>
      );
    case "cta":
      return <CtaBlock cta={block.cta} />;
  }
}

function RelatedArticles({ slugs }: { slugs: string[] }) {
  const related = slugs
    .map((s) => articlesBySlug[s])
    .filter((a): a is Article => Boolean(a));
  if (related.length === 0) return null;
  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-foreground">Related guides</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {related.map((a) => (
          <Card key={a.slug} className="p-5" data-testid={`related-${a.slug}`}>
            <Badge variant="outline" className="mb-2 w-fit border-bronze/60 text-bronze">
              {a.category}
            </Badge>
            <h3 className="text-base font-semibold leading-snug text-foreground">
              <Link href={`/learn/${a.slug}`} className="hover:text-primary">
                {a.title}
              </Link>
            </h3>
            <Link
              href={`/learn/${a.slug}`}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Read <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function LearnArticle() {
  const [, params] = useRoute("/learn/:slug");
  const slug = params?.slug ?? "";
  const article = articlesBySlug[slug];

  // Hooks must run before any early return; pass safe fallbacks when missing.
  usePageMeta(
    article?.metaTitle ?? "Learning Center | Inherited Mineral Rights",
    article?.metaDescription,
  );

  if (!article) return <NotFound />;

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/learn" className="inline-flex items-center gap-1 hover:text-primary" data-testid="link-back-learn">
            <ArrowLeft className="h-4 w-4" />
            Learning Center
          </Link>
        </nav>

        {/* Header */}
        <header className="mt-5">
          <Badge variant="outline" className="mb-3 border-bronze text-bronze">
            {article.category}
          </Badge>
          <h1 className="text-balance text-3xl font-semibold leading-[1.15] text-foreground sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {article.intro}
          </p>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {article.readingMinutes} min read
          </p>
        </header>

        {/* Top disclaimer */}
        <DisclaimerNote className="mt-8" />

        {/* Top CTA */}
        <CtaBlock cta={article.topCta} />

        {/* Body */}
        <div className="mt-2">
          {article.sections.map((section) => (
            <section key={section.heading} className="mt-10">
              <h2 className="text-2xl font-semibold text-foreground">
                {section.heading}
              </h2>
              {section.blocks.map((block, i) => (
                <BlockView key={i} block={block} />
              ))}
            </section>
          ))}
        </div>

        {/* Article-specific guardrails */}
        {article.guardrails.length > 0 && (
          <div
            className="mt-12 rounded-lg border border-bronze/40 bg-secondary/60 p-5"
            data-testid="article-guardrails"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-bronze" />
              <h2 className="text-base font-semibold text-foreground">
                Important cautions for this topic
              </h2>
            </div>
            <ul className="mt-3 space-y-2">
              {article.guardrails.map((g, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-bronze" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sources / citations */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-foreground">Sources & further reading</h2>
          <ul className="mt-4 space-y-2.5">
            {article.sources.map((s) => (
              <li key={s.url} className="flex gap-2 text-sm leading-relaxed">
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-primary hover:underline"
                  data-testid="link-source"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            External links are provided for reference and education. We don’t
            control or endorse third-party content; verify details with the
            source and a licensed professional.
          </p>
        </div>

        {/* Bottom CTA */}
        <CtaBlock cta={article.topCta} />

        {/* Related */}
        <RelatedArticles slugs={article.related} />

        {/* Conversion landing links */}
        <div className="mt-12 rounded-lg border border-border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground">
            Ready when you are
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            No pressure, no obligation — just a starting point whenever you want one.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link href="/sell" className="flex-1">
              <Button variant="outline" className="w-full" data-testid="link-landing-review">
                Request a private review
              </Button>
            </Link>
            <Link href="/got-an-offer" className="flex-1">
              <Button variant="outline" className="w-full" data-testid="link-landing-offer">
                I received an offer
              </Button>
            </Link>
            <Link href="/ask" className="flex-1">
              <Button variant="outline" className="w-full" data-testid="link-landing-ask">
                Ask a question
              </Button>
            </Link>
          </div>
        </div>

        {/* Final disclaimer */}
        <DisclaimerNote className="mt-10" />
      </article>
    </PageShell>
  );
}
