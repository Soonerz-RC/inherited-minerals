import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { PageShell } from "@/components/SiteLayout";

export default function NotFound() {
  return (
    <PageShell>
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:py-32">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Compass className="h-7 w-7 text-primary" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-foreground">
          We couldn't find that page
        </h1>
        <p className="mt-3 text-muted-foreground">
          The page you're looking for may have moved. Let's get you back on solid
          ground.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/">
            <Button data-testid="button-404-home">Back to home</Button>
          </Link>
          <Link href="/start-here">
            <Button variant="outline" data-testid="button-404-start">
              Start Here guide
            </Button>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
