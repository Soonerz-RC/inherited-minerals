import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { DOC_OPTIONS } from "@/lib/content";
import { getAttribution } from "@/lib/attribution";
import { submitReviewRequest } from "@/lib/leads";
import { insertReviewRequestSchema, type InsertReviewRequest } from "@shared/schema";

export const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Florida",
  "Illinois","Kansas","Kentucky","Louisiana","Michigan","Mississippi","Montana",
  "Nebraska","Nevada","New Mexico","North Dakota","Ohio","Oklahoma",
  "Pennsylvania","South Dakota","Texas","Utah","West Virginia","Wyoming","Other",
];

export type LeadIntent = "inherited" | "offer" | "value" | "general";

const OWNER_STATUS_OPTIONS = [
  { v: "heir", l: "I inherited / am an heir" },
  { v: "current_owner", l: "I already own them" },
  { v: "executor", l: "I'm handling an estate" },
  { v: "not_sure", l: "Not sure yet" },
] as const;

const URGENCY_OPTIONS = [
  { v: "just_curious", l: "Just learning" },
  { v: "exploring", l: "Exploring options" },
  { v: "within_3_months", l: "Within a few months" },
  { v: "ready_now", l: "Ready now" },
] as const;

export interface LeadFormProps {
  /** Tailors which optional qualifying fields appear and the submit label. */
  intent?: LeadIntent;
  /** Analytics/attribution label, e.g. "landing-got-an-offer". */
  location?: string;
  /** Submit button label. Sensible per-intent default if omitted. */
  submitLabel?: string;
  className?: string;
}

const DEFAULT_SUBMIT_LABEL: Record<LeadIntent, string> = {
  inherited: "Request my private review",
  offer: "Get a no-pressure second opinion",
  value: "Request my valuation review",
  general: "Request my private review",
};

export function LeadForm({
  intent = "general",
  location,
  submitLabel,
  className = "",
}: LeadFormProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm<InsertReviewRequest>({
    resolver: zodResolver(insertReviewRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      state: "",
      county: "",
      producingStatus: "not_sure",
      ownerStatus: undefined,
      operatorInfo: "",
      offerAmount: "",
      urgency: undefined,
      documents: [],
      notes: "",
      intent,
      consent: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertReviewRequest) => {
      await submitReviewRequest({
        ...data,
        intent,
        ...getAttribution(),
      });
    },
    onSuccess: () => {
      form.reset();
      // The thank-you page confirms next steps and fires the conversion event.
      navigate("/thank-you/review");
    },
    onError: (e: Error) => {
      toast({ title: "Couldn't submit your request", description: e.message, variant: "destructive" });
    },
  });

  const showOffer = intent === "offer";
  const showOperator = intent === "value" || intent === "offer";

  return (
    <Card className={`p-6 sm:p-7 ${className}`}>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-bronze text-bronze">
          Private review
        </Badge>
        <span className="text-sm text-muted-foreground">Takes about 2 minutes</span>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
          className="mt-5 space-y-5"
          data-testid={`lead-form-${intent}`}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" data-testid="input-name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" data-testid="input-email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="So we can call if you prefer" data-testid="input-phone" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State where minerals are located</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-state">
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-64">
                      {US_STATES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="county"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>County (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Reeves" data-testid="input-county" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="ownerStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Which best describes you? (optional)</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid gap-2 sm:grid-cols-2"
                  >
                    {OWNER_STATUS_OPTIONS.map((o) => (
                      <label
                        key={o.v}
                        htmlFor={`owner-${o.v}`}
                        className="hover-elevate flex cursor-pointer items-center gap-2.5 rounded-md border border-border p-3 text-sm"
                        data-testid={`radio-owner-${o.v}`}
                      >
                        <RadioGroupItem id={`owner-${o.v}`} value={o.v} />
                        {o.l}
                      </label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="producingStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Are the minerals currently producing?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid gap-2 sm:grid-cols-3"
                  >
                    {[
                      { v: "producing", l: "Producing" },
                      { v: "not_producing", l: "Not producing" },
                      { v: "not_sure", l: "Not sure" },
                    ].map((o) => (
                      <label
                        key={o.v}
                        htmlFor={`prod-${o.v}`}
                        className="hover-elevate flex cursor-pointer items-center gap-2.5 rounded-md border border-border p-3 text-sm"
                        data-testid={`radio-producing-${o.v}`}
                      >
                        <RadioGroupItem id={`prod-${o.v}`} value={o.v} />
                        {o.l}
                      </label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {showOperator && (
            <FormField
              control={form.control}
              name="operatorInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operator or royalty check details (optional)</FormLabel>
                  <FormDescription>
                    Who pays the royalty, or what a recent check shows — even a rough idea helps.
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="e.g. Devon Energy, ~$120/mo"
                      data-testid="input-operator"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {showOffer && (
            <FormField
              control={form.control}
              name="offerAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer amount, if you've received one (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. $25,000"
                      data-testid="input-offer-amount"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="urgency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where are you in the process? (optional)</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid gap-2 sm:grid-cols-2"
                  >
                    {URGENCY_OPTIONS.map((o) => (
                      <label
                        key={o.v}
                        htmlFor={`urg-${o.v}`}
                        className="hover-elevate flex cursor-pointer items-center gap-2.5 rounded-md border border-border p-3 text-sm"
                        data-testid={`radio-urgency-${o.v}`}
                      >
                        <RadioGroupItem id={`urg-${o.v}`} value={o.v} />
                        {o.l}
                      </label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="documents"
            render={() => (
              <FormItem>
                <FormLabel>Which documents do you have? (optional)</FormLabel>
                <FormDescription>Check any that apply — it helps us understand your situation.</FormDescription>
                <div className="mt-1 grid gap-2 sm:grid-cols-2">
                  {DOC_OPTIONS.map((doc) => (
                    <FormField
                      key={doc}
                      control={form.control}
                      name="documents"
                      render={({ field }) => {
                        const checked = field.value?.includes(doc);
                        return (
                          <label
                            htmlFor={`doc-${doc}`}
                            className="hover-elevate flex cursor-pointer items-center gap-2.5 rounded-md border border-border p-3 text-sm"
                            data-testid={`checkbox-doc-${doc.slice(0, 8)}`}
                          >
                            <Checkbox
                              id={`doc-${doc}`}
                              checked={checked}
                              onCheckedChange={(c) => {
                                const set = new Set(field.value ?? []);
                                if (c) set.add(doc);
                                else set.delete(doc);
                                field.onChange(Array.from(set));
                              }}
                            />
                            {doc}
                          </label>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anything else? (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us anything that would help — when you inherited, whether you've received offers, what you're hoping to figure out."
                    className="min-h-[6rem]"
                    data-testid="input-notes"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consent"
            render={({ field }) => (
              <FormItem>
                <label
                  htmlFor="consent"
                  className="hover-elevate flex cursor-pointer items-start gap-2.5 rounded-md border border-border p-3 text-sm"
                  data-testid="checkbox-consent"
                >
                  <FormControl>
                    <Checkbox
                      id="consent"
                      checked={field.value === true}
                      onCheckedChange={(c) => field.onChange(c === true)}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <span className="leading-relaxed text-muted-foreground">
                    I agree to be contacted about my request and accept the{" "}
                    <a href="#/privacy" className="underline hover:text-primary">Privacy Policy</a>{" "}
                    and{" "}
                    <a href="#/terms" className="underline hover:text-primary">Terms of Use</a>.
                  </span>
                </label>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={mutation.isPending}
            data-testid="button-submit-review"
          >
            {mutation.isPending ? "Sending…" : submitLabel ?? DEFAULT_SUBMIT_LABEL[intent]}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            No obligation. We'll never share your details with marketers. This is
            general information, not legal, tax, or financial advice.
          </p>
        </form>
      </Form>
    </Card>
  );
}
