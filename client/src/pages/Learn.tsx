import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { PageShell, DisclaimerNote } from "@/components/SiteLayout";
import { usePageMeta } from "@/hooks/use-page-meta";
import { articles, CATEGORIES, LEARN_INTRO } from "@/lib/learn";

export default function Learn() {
  usePageMeta(LEARN_INTRO.metaTitle, LEARN_INTRO.metaDescription);

  return (
    <PageShell>
      {/* Header */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <Badge variant="outline" className="mb-4 border-bronze text-bronze">
            <BookOpen className="mr-1 h-3.5 w-3.5" /> Learning Center
          </Badge>
          <h1 className="text-balance text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl">
            {LEARN_INTRO.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {LEARN_INTRO.subhead}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/sell">
              <Button className="w-full sm:w-auto" data-testid="button-learn-review">
                Request a private review
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/ask">
              <Button variant="outline" className="w-full sm:w-auto" data-testid="button-learn-ask">
                Ask a question
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category overview */}
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Browse by topic
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground"
              data-testid={`chip-category-${cat.toLowerCase().replace(/[^a-z]+/g, "-")}`}
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Article grid */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Card
              key={a.slug}
              className="flex flex-col p-6 transition-shadow hover:shadow-md"
              data-testid={`card-article-${a.slug}`}
            >
              <Badge variant="outline" className="mb-3 w-fit border-bronze/60 text-bronze">
                {a.category}
              </Badge>
              <h3 className="text-lg font-semibold leading-snug text-foreground">
                <Link href={`/learn/${a.slug}`} className="hover:text-primary">
                  {a.title}
                </Link>
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {a.summary}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {a.readingMinutes} min read
                </span>
                <Link
                  href={`/learn/${a.slug}`}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  data-testid={`link-read-${a.slug}`}
                >
                  Read <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA + disclaimer */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
          <Card className="bg-secondary/60 p-8 text-center sm:p-10">
            <h2 className="text-2xl font-semibold text-foreground">
              Still not sure what you actually own?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Reading helps, but every situation is different. Request a private,
              no-pressure review and a real person will help you get oriented.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/sell">
                <Button className="w-full sm:w-auto" data-testid="button-learn-cta-review">
                  Request a private review
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/got-an-offer">
                <Button variant="outline" className="w-full sm:w-auto" data-testid="button-learn-cta-offer">
                  I received an offer
                </Button>
              </Link>
            </div>
          </Card>
          <DisclaimerNote className="mt-10" />
        </div>
      </section>
    </PageShell>
  );
}
