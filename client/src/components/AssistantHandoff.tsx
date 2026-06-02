import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { US_STATES } from "@/components/LeadForm";
import { getAttribution } from "@/lib/attribution";
import { submitReviewRequest } from "@/lib/leads";
import {
  type IntakeState,
  PRODUCING_OPTIONS,
  OWNER_STATUS_OPTIONS,
  GOAL_OPTIONS,
  goalToIntent,
  buildAssistantSummary,
} from "@/lib/assistant";

type Transcript = { role: "user" | "assistant"; text: string }[];

interface Props {
  intake: IntakeState;
  setIntake: (next: IntakeState) => void;
  transcript: Transcript;
}

/**
 * Phase 3 — structured guided intake + "send this summary for review" handoff.
 * Submits to the existing `private-review-request` Netlify Form (source of
 * record), which in turn fires the Slack outgoing webhook. On success it routes
 * to /thank-you/review so the existing conversion tracking still fires.
 */
export function AssistantHandoff({ intake, setIntake, transcript }: Props) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  const set = <K extends keyof IntakeState>(key: K, value: IntakeState[K]) =>
    setIntake({ ...intake, [key]: value });

  const mutation = useMutation({
    mutationFn: async () => {
      const intent = goalToIntent(intake.goal);
      const assistantSummary = buildAssistantSummary(intake, transcript);
      await submitReviewRequest({
        name,
        email,
        phone,
        state: intake.state,
        county: intake.county,
        producingStatus: intake.producingStatus || "not_sure",
        ownerStatus: intake.ownerStatus || undefined,
        operatorInfo: intake.operatorInfo,
        offerAmount: intake.offerAmount,
        urgency: intake.goal === "sell" ? "exploring" : undefined,
        notes: assistantSummary,
        intent: "assistant",
        consent: true,
        ...getAttribution(),
        // keep attribution intent accurate for downstream reporting
        utm_content: getAttribution().utm_content ?? `assistant-${intent}`,
      });
    },
    onSuccess: () => navigate("/thank-you/review"),
    onError: (e: Error) =>
      toast({
        title: "Couldn't send your summary",
        description: e.message,
        variant: "destructive",
      }),
  });

  const canSubmit =
    name.trim().length >= 2 && /\S+@\S+\.\S+/.test(email) && intake.state && consent;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || mutation.isPending) return;
    mutation.mutate();
  };

  return (
    <Card className="p-6 sm:p-7" data-testid="assistant-handoff">
      <h2 className="text-xl font-semibold text-foreground">
        Send this summary for a private review
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Share a few details and we'll review your situation privately — no
        obligation, no pressure. We use what you've explored here to get you a
        head start.
      </p>

      <form onSubmit={submit} className="mt-5 space-y-4" data-testid="form-assistant-handoff">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="ah-name">Your name</label>
            <Input id="ah-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" data-testid="input-ah-name" className="mt-1.5" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="ah-email">Email</label>
            <Input id="ah-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" data-testid="input-ah-email" className="mt-1.5" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="ah-phone">Phone (optional)</label>
            <Input id="ah-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="So we can call if you prefer" data-testid="input-ah-phone" className="mt-1.5" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="ah-goal">Your main goal</label>
            <Select value={intake.goal} onValueChange={(v) => set("goal", v as IntakeState["goal"])}>
              <SelectTrigger id="ah-goal" data-testid="select-ah-goal" className="mt-1.5">
                <SelectValue placeholder="What are you hoping to do?" />
              </SelectTrigger>
              <SelectContent>
                {GOAL_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="ah-state">State where minerals are located</label>
            <Select value={intake.state} onValueChange={(v) => set("state", v)}>
              <SelectTrigger id="ah-state" data-testid="select-ah-state" className="mt-1.5">
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
            <label className="text-sm font-medium text-foreground" htmlFor="ah-county">County (optional)</label>
            <Input id="ah-county" value={intake.county} onChange={(e) => set("county", e.target.value)} placeholder="e.g. Reeves" data-testid="input-ah-county" className="mt-1.5" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="ah-producing">Producing status</label>
            <Select value={intake.producingStatus} onValueChange={(v) => set("producingStatus", v as IntakeState["producingStatus"])}>
              <SelectTrigger id="ah-producing" data-testid="select-ah-producing" className="mt-1.5">
                <SelectValue placeholder="Are they producing?" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCING_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="ah-owner">Which describes you?</label>
            <Select value={intake.ownerStatus} onValueChange={(v) => set("ownerStatus", v as IntakeState["ownerStatus"])}>
              <SelectTrigger id="ah-owner" data-testid="select-ah-owner" className="mt-1.5">
                <SelectValue placeholder="Probate / ownership status" />
              </SelectTrigger>
              <SelectContent>
                {OWNER_STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="ah-operator">Operator / royalty info (optional)</label>
            <Input id="ah-operator" value={intake.operatorInfo} onChange={(e) => set("operatorInfo", e.target.value)} placeholder="e.g. Devon Energy, ~$120/mo" data-testid="input-ah-operator" className="mt-1.5" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="ah-offer">Offer amount, if any (optional)</label>
            <Input id="ah-offer" value={intake.offerAmount} onChange={(e) => set("offerAmount", e.target.value)} placeholder="e.g. $25,000" data-testid="input-ah-offer" className="mt-1.5" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="ah-notes">Anything else? (optional)</label>
          <Textarea id="ah-notes" value={intake.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Tell us anything that would help." className="mt-1.5 min-h-[5rem]" data-testid="input-ah-notes" />
        </div>

        <label htmlFor="ah-consent" className="hover-elevate flex cursor-pointer items-start gap-2.5 rounded-md border border-border p-3 text-sm" data-testid="checkbox-ah-consent">
          <Checkbox id="ah-consent" checked={consent} onCheckedChange={(c) => setConsent(c === true)} className="mt-0.5" />
          <span className="leading-relaxed text-muted-foreground">
            I agree to be contacted about my request and accept the{" "}
            <a href="#/privacy" className="underline hover:text-primary">Privacy Policy</a>{" "}and{" "}
            <a href="#/terms" className="underline hover:text-primary">Terms of Use</a>.
          </span>
        </label>

        <Button type="submit" size="lg" className="w-full" disabled={!canSubmit || mutation.isPending} data-testid="button-ah-submit">
          {mutation.isPending ? "Sending…" : "Send this summary for review"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          No obligation. This is general information, not legal, tax, or financial advice.
        </p>
      </form>
    </Card>
  );
}
