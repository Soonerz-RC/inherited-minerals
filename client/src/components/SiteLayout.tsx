import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Menu, X, ShieldCheck } from "lucide-react";

const NAV = [
  { href: "/start-here", label: "Start Here" },
  { href: "/learn", label: "Learning Center" },
  { href: "/ask", label: "Ask the Assistant" },
  { href: "/community", label: "Community Q&A" },
  { href: "/sell", label: "Sell or Value" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" data-testid="link-home-logo" className="hover-elevate rounded-md px-1 py-1">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`link-nav-${item.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className={`hover-elevate rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "text-primary" : "text-foreground/80"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/sell" className="ml-2">
            <Button data-testid="button-header-cta" className="font-medium">
              Request a private review
            </Button>
          </Link>
        </nav>

        <button
          className="hover-elevate rounded-md p-2 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          data-testid="button-menu-toggle"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                data-testid={`link-mobile-${item.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className="hover-elevate rounded-md px-3 py-3 text-base font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/sell" onClick={() => setOpen(false)} className="mt-2">
              <Button className="w-full" data-testid="button-mobile-cta">
                Request a private review
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Plain-English help for people who inherited oil and gas mineral
              rights. Understand what you own before you make any decision.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">Learn</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/start-here" className="hover:text-primary">Start Here guide</Link></li>
              <li><Link href="/learn" className="hover:text-primary">Learning Center</Link></li>
              <li><Link href="/ask" className="hover:text-primary">Ask the assistant</Link></li>
              <li><Link href="/community" className="hover:text-primary">Community Q&A</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">Owners</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/value-my-minerals" className="hover:text-primary">Value my minerals</Link></li>
              <li><Link href="/got-an-offer" className="hover:text-primary">I got an offer</Link></li>
              <li><Link href="/sell" className="hover:text-primary">Request a private review</Link></li>
            </ul>
            <h2 className="mt-6 text-sm font-semibold text-foreground">Legal</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms of Use</Link></li>
              <li><Link href="/disclaimer" className="hover:text-primary">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Educational information only — not legal, tax, or financial advice.
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link href="/privacy" className="hover:text-primary">Privacy</Link>
            <Link href="/terms" className="hover:text-primary">Terms</Link>
            <Link href="/disclaimer" className="hover:text-primary">Disclaimer</Link>
            <span>© {new Date().getFullYear()} InheritedMineralRights.com</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

/** Reusable disclaimer block used across education / assistant pages. */
export function DisclaimerNote({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex gap-3 rounded-lg border border-border bg-secondary/60 p-4 text-sm leading-relaxed text-muted-foreground ${className}`}
      data-testid="note-disclaimer"
    >
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <p>
        <span className="font-medium text-foreground">A note on this content. </span>
        Everything here is general education to help you ask better questions. It
        is not legal, tax, or financial advice, and reading it does not create an
        attorney–client relationship. For your specific situation, talk with a
        qualified attorney, CPA, or licensed professional.
      </p>
    </div>
  );
}
