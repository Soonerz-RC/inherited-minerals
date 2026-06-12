import { useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowDown,
  ArrowUp,
  Calculator,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { PageShell, DisclaimerNote } from "@/components/SiteLayout";
import { PhoneCTA } from "@/components/PhoneCTA";
import { US_STATES } from "@/components/LeadForm";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useToast } from "@/hooks/use-toast";
import { getAttribution } from "@/lib/attribution";
import { submitCalculatorReview } from "@/lib/leads";
import { trackEvent, trackMetaEvent, DISPLAY_PHONE_NUMBER } from "@/lib/analytics";
import {
  estimateValue,
  parseAmount,
  formatUsd,
  type CalculatorInput,
  type EstimateResult,
  type ProducingStatus,
  type OwnerStatus,
} from "@/lib/calculator";

const PRODUCING_OPTIONS: { v: ProducingStatus; l: string }[] = [
  { v: "producing", l: "Producing" },
  { v: "not_producing", l: "Not producing" },
  { v: "not_sure", l: "Not sure" },
];

const OWNER_OPTIONS: { v: OwnerStatus; l: string }[] = [
  { v: "self", l: "In my name" },
  { v: "estate_trust", l: "Estate or trust" },
  { v: "co_owned", l: "Co-owned with others" },
  { v: "not_sure", l: "Not sure" },
];

const DOC_OPTIONS = [
  "Deed",
  "Probate order",
  "Lease",
  "Division order",
  "Royalty check stub",
  "Tax statement",
  "Offer letter",
  "Not sure",
];

const PRODUCING_LABELS: Record<ProducingStatus, string> = {
  producing: "Producing",
  not_producing: "Not producing",
  not_sure: "Not sure",
};
const OWNER_LABELS: Record<OwnerStatus, string> = {
  self: "In my name",
  estate_trust: "Estate or trust",
  co_owned: "Co-owned",
  not_sure: "Not sure",
};

interface FormState {
  state: string;
  county: string;
  netAcres: string;
  acresNotSure: boolean;
  producingStatus: ProducingStatus;
  monthlyRoyalty: string;
  offerAmount: string;
  ownerStatus: OwnerStatus;
  documents: string[];
  // Contact / review fields (shown with the result).
  name: string;
  email: string;
  phone: string;
  notes: string;
  consent: boolean;
}

const EMPTY: FormState = {
  state: "",
  county: "",
  netAcres: "",
  acresNotSure: false,
  producingStatus: "not_sure",
  monthlyRoyalty: "",
  offerAmount: "",
  ownerStatus: "not_sure",
  documents: [],
  name: "",
  email: "",
  phone: "",
  notes: "",
  consent: false,
};

function toCalculatorInput(f: FormState): CalculatorInput {
  return {
    state: f.state,
    county: f.county,
    netAcres: f.acresNotSure ? undefined : parseAmount(f.netAcres),
    producingStatus: f.producingStatus,
    monthlyRoyalty: parseAmount(f.monthlyRoyalty),
    offerAmount: parseAmount(f.offerAmount),
    ownerStatus: f.ownerStatus,
  };
}

/** Build the `notes` block folded into the lead so Slack/Airtable see it all. */
function buildReviewNotes(f: FormState, result: EstimateResult): string {
  const lines: string[] = ["— Value calculator review —"];
  lines.push(`State: ${f.state || "—"}`);
  lines.push(`County: ${f.county || "—"}`);
  lines.push(
    `Net mineral acres: ${f.acresNotSure || !f.netAcres ? "Not sure" : f.netAcres}`,
  );
  lines.push(`Producing status: ${PRODUCING_LABELS[f.producingStatus]}`);
  if (f.monthlyRoyalty) lines.push(`Avg monthly royalty: ${f.monthlyRoyalty}`);
  if (f.offerAmount) lines.push(`Offer received: ${f.offerAmount}`);
  lines.push(`Ownership/title: ${OWNER_LABELS[f.ownerStatus]}`);
  if (f.documents.length) lines.push(`Documents available: ${f.documents.join(", ")}`);

  lines.push("", "— Rough estimate shown —");
  if (result.kind === "range" && result.low != null && result.high != null) {
    lines.push(`Range: ${formatUsd(result.low)} – ${formatUsd(result.high)} (${result.basis})`);
  } else {
    lines.push("Range: review needed (insufficient inputs for a number)");
  }
  if (result.offerComparison) {
    lines.push(`Offer vs range: ${result.offerComparison.position}`);
  }
  if (f.notes.trim()) lines.push("", `What they want reviewed: ${f.notes.trim()}`);

  return lines.join("\n").slice(0, 1900);
}

export default function InheritedMineralRightsCalculator() {
  usePageMeta(
    "Inherited Mineral Rights Value Calculator | InheritedMineralRights.com",
    "A free, educational rough-estimate calculator for inherited oil and gas mineral rights. Get a conservative value range and what moves it — not an appraisal or an offer.",
  );

  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const startedRef = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    // Fire a one-time "calculator started" event on first interaction.
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("calculator_started", { tool: "inherited-mineral-rights-calculator" });
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canCalculate = form.state.trim() !== "" && form.county.trim() !== "";

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) {
      toast({
        title: "A little more info needed",
        description: "Please choose a state and enter the county to see a rough estimate.",
        variant: "destructive",
      });
      return;
    }
    const r = estimateValue(toCalculatorInput(form));
    setResult(r);
    trackEvent("calculator_result", {
      tool: "inherited-mineral-rights-calculator",
      kind: r.kind,
      basis: r.basis,
      producing_status: form.producingStatus,
      offer_comparison: r.offerComparison?.position ?? "none",
    });
    // Scroll the result into view after it renders.
    requestAnimationFrame(() =>
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!result) return;
      const notes = buildReviewNotes(form, result);
      await submitCalculatorReview({
        name: form.name,
        email: form.email,
        phone: form.phone,
        state: form.state,
        county: form.county,
        producingStatus: form.producingStatus,
        ownerStatus: form.ownerStatus,
        operatorInfo: form.monthlyRoyalty ? `~${form.monthlyRoyalty}/mo royalty` : "",
        offerAmount: form.offerAmount,
        documents: form.documents,
        notes,
        intent: "calculator",
        consent: true,
        ...getAttribution(),
      });
    },
    onSuccess: () => {
      trackEvent("calculator_submitted", { tool: "inherited-mineral-rights-calculator" });
      trackMetaEvent("Lead", { content_name: "value_calculator" });
      // The thank-you page confirms next steps and fires the conversion event.
      navigate("/thank-you/review");
    },
    onError: (err: Error) =>
      toast({
        title: "Couldn't send your estimate",
        description: err.message,
        variant: "destructive",
      }),
  });

  const canSubmit =
    form.name.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.consent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || mutation.isPending) return;
    mutation.mutate();
  };

  const toggleDoc = (doc: string, checked: boolean) => {
    setForm((prev) => {
      const next = new Set(prev.documents);
      if (checked) next.add(doc);
      else next.delete(doc);
      return { ...prev, documents: Array.from(next) };
    });
  };

  return (
    <PageShell>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <Badge variant="outline" className="border-bronze text-bronze">
            Free tool · Educational
          </Badge>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl">
            Inherited mineral rights value calculator
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Just inherited oil and gas minerals and wondering what they might be
            worth? Answer a few questions for a rough, conservative range and a
            plain-English explanation of what moves it. This is a starting point
            to help you ask better questions — not an appraisal or an offer.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        {/* --- Inputs --- */}
        <Card className="p-6 sm:p-7">
          <form onSubmit={handleCalculate} className="space-y-6" data-testid="calculator-inputs">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground" htmlFor="calc-state">
                  State where the minerals are located <span className="text-bronze">*</span>
                </label>
                <Select value={form.state} onValueChange={(v) => set("state", v)}>
                  <SelectTrigger id="calc-state" data-testid="select-calc-state" className="mt-1.5">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {US_STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground" htmlFor="calc-county">
                  County <span className="text-bronze">*</span>
                </label>
                <Input
                  id="calc-county"
                  value={form.county}
                  onChange={(e) => set("county", e.target.value)}
                  placeholder="e.g. Canadian"
                  data-testid="input-calc-county"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="calc-acres">
                Approximate net mineral acres
              </label>
              <Input
                id="calc-acres"
                inputMode="decimal"
                value={form.netAcres}
                onChange={(e) => set("netAcres", e.target.value)}
                placeholder="e.g. 40"
                disabled={form.acresNotSure}
                data-testid="input-calc-acres"
                className="mt-1.5"
              />
              <label
                htmlFor="calc-acres-notsure"
                className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"
                data-testid="checkbox-calc-acres-notsure"
              >
                <Checkbox
                  id="calc-acres-notsure"
                  checked={form.acresNotSure}
                  onCheckedChange={(c) => set("acresNotSure", c === true)}
                />
                I'm not sure how many acres
              </label>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Net mineral acres is your share of the acreage. If you don't know it,
                that's fine — we'll show a review-based result instead of a number.
              </p>
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-foreground">
                Are the minerals currently producing?
              </legend>
              <RadioGroup
                value={form.producingStatus}
                onValueChange={(v) => set("producingStatus", v as ProducingStatus)}
                className="mt-2 grid gap-2 sm:grid-cols-3"
              >
                {PRODUCING_OPTIONS.map((o) => (
                  <label
                    key={o.v}
                    htmlFor={`calc-prod-${o.v}`}
                    className="hover-elevate flex cursor-pointer items-center gap-2.5 rounded-md border border-border p-3 text-sm"
                    data-testid={`radio-calc-producing-${o.v}`}
                  >
                    <RadioGroupItem id={`calc-prod-${o.v}`} value={o.v} />
                    {o.l}
                  </label>
                ))}
              </RadioGroup>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground" htmlFor="calc-royalty">
                  Average monthly royalty check (optional)
                </label>
                <Input
                  id="calc-royalty"
                  inputMode="decimal"
                  value={form.monthlyRoyalty}
                  onChange={(e) => set("monthlyRoyalty", e.target.value)}
                  placeholder="e.g. $120"
                  data-testid="input-calc-royalty"
                  className="mt-1.5"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground" htmlFor="calc-offer">
                  Offer amount received (optional)
                </label>
                <Input
                  id="calc-offer"
                  inputMode="decimal"
                  value={form.offerAmount}
                  onChange={(e) => set("offerAmount", e.target.value)}
                  placeholder="e.g. $25,000"
                  data-testid="input-calc-offer"
                  className="mt-1.5"
                />
              </div>
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-foreground">
                Ownership / title status
              </legend>
              <RadioGroup
                value={form.ownerStatus}
                onValueChange={(v) => set("ownerStatus", v as OwnerStatus)}
                className="mt-2 grid gap-2 sm:grid-cols-2"
              >
                {OWNER_OPTIONS.map((o) => (
                  <label
                    key={o.v}
                    htmlFor={`calc-owner-${o.v}`}
                    className="hover-elevate flex cursor-pointer items-center gap-2.5 rounded-md border border-border p-3 text-sm"
                    data-testid={`radio-calc-owner-${o.v}`}
                  >
                    <RadioGroupItem id={`calc-owner-${o.v}`} value={o.v} />
                    {o.l}
                  </label>
                ))}
              </RadioGroup>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-medium text-foreground">
                Which documents do you have? (optional)
              </legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {DOC_OPTIONS.map((doc) => (
                  <label
                    key={doc}
                    htmlFor={`calc-doc-${doc}`}
                    className="hover-elevate flex cursor-pointer items-center gap-2.5 rounded-md border border-border p-3 text-sm"
                    data-testid={`checkbox-calc-doc-${doc.slice(0, 8)}`}
                  >
                    <Checkbox
                      id={`calc-doc-${doc}`}
                      checked={form.documents.includes(doc)}
                      onCheckedChange={(c) => toggleDoc(doc, c === true)}
                    />
                    {doc}
                  </label>
                ))}
              </div>
            </fieldset>

            <Button type="submit" size="lg" className="w-full" data-testid="button-calculate">
              <Calculator className="mr-2 h-4 w-4" />
              Show my rough estimate
            </Button>
          </form>
        </Card>

        {/* --- Result --- */}
        {result && (
          <div ref={resultRef} className="mt-8 scroll-mt-24" data-testid="calculator-result">
            <Card className="p-6 sm:p-7">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Your rough estimate
                </h2>
              </div>

              {result.kind === "range" && result.low != null && result.high != null ? (
                <p className="mt-4 text-3xl font-semibold text-foreground" data-testid="text-estimate-range">
                  {formatUsd(result.low)} – {formatUsd(result.high)}
                </p>
              ) : (
                <p className="mt-4 text-2xl font-semibold text-foreground" data-testid="text-estimate-review">
                  Review needed
                </p>
              )}

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {result.method}
              </p>

              {result.offerComparison && (
                <div
                  className="mt-5 rounded-lg border border-border bg-secondary/60 p-4 text-sm leading-relaxed text-muted-foreground"
                  data-testid="text-offer-comparison"
                >
                  <span className="font-medium text-foreground">About the offer you entered. </span>
                  {result.offerComparison.message}
                </div>
              )}

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <ArrowUp className="h-4 w-4 text-primary" /> What could move this up
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {result.increaseFactors.map((f) => (
                      <li key={f} className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <ArrowDown className="h-4 w-4 text-bronze" /> What could move this down
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {result.decreaseFactors.map((f) => (
                      <li key={f} className="flex gap-2">
                        <span className="text-bronze">•</span>
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex gap-3 rounded-lg border border-border bg-secondary/60 p-4 text-sm leading-relaxed text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p>
                  <span className="font-medium text-foreground">This is a rough range, not an appraisal or an offer. </span>
                  It does not account for your exact net acres, decimal interest,
                  lease terms, title status, or current prices. It is not legal,
                  tax, or financial advice. Your title and documents need to be
                  reviewed before any real valuation or sale.
                </p>
              </div>
            </Card>

            {/* --- Lead handoff --- */}
            <Card className="mt-6 p-6 sm:p-7" data-testid="calculator-review-form">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-bronze text-bronze">
                  Private review
                </Badge>
                <span className="text-sm text-muted-foreground">No obligation</span>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-foreground">
                Send this estimate for a private review
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                A real person will look at the details you entered — privately —
                and walk you through a more grounded range, what would tighten it,
                and what to check on title. We'll include everything from above so
                you don't have to retype it.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4" data-testid="form-calc-review">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground" htmlFor="calc-name">Your name</label>
                    <Input id="calc-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Full name" data-testid="input-calc-name" className="mt-1.5" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground" htmlFor="calc-email">Email</label>
                    <Input id="calc-email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="you@example.com" data-testid="input-calc-email" className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground" htmlFor="calc-phone">Phone (optional)</label>
                  <Input id="calc-phone" type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="So we can call if you prefer" data-testid="input-calc-phone" className="mt-1.5" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground" htmlFor="calc-notes">What would you like reviewed? (optional)</label>
                  <Textarea id="calc-notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Anything that would help — when you inherited, whether the offer has a deadline, what you're trying to decide." className="mt-1.5 min-h-[5rem]" data-testid="input-calc-notes" />
                </div>

                <label htmlFor="calc-consent" className="hover-elevate flex cursor-pointer items-start gap-2.5 rounded-md border border-border p-3 text-sm" data-testid="checkbox-calc-consent">
                  <Checkbox id="calc-consent" checked={form.consent} onCheckedChange={(c) => setForm((p) => ({ ...p, consent: c === true }))} className="mt-0.5" />
                  <span className="leading-relaxed text-muted-foreground">
                    I agree to be contacted about my request and accept the{" "}
                    <a href="#/privacy" className="underline hover:text-primary">Privacy Policy</a>{" "}
                    and{" "}
                    <a href="#/terms" className="underline hover:text-primary">Terms of Use</a>.
                  </span>
                </label>

                <Button type="submit" size="lg" className="w-full" disabled={!canSubmit || mutation.isPending} data-testid="button-calc-submit">
                  {mutation.isPending ? "Sending…" : "Send this estimate for review"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  No obligation. We'll never share your details with marketers. This is
                  general information, not legal, tax, or financial advice.
                </p>
              </form>

              {DISPLAY_PHONE_NUMBER && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Prefer to talk it through? <PhoneCTA location="calculator-result" className="ml-1" />
                </p>
              )}
            </Card>
          </div>
        )}

        <DisclaimerNote className="mt-8" />
      </section>
    </PageShell>
  );
}
