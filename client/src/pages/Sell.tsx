import { useState } from "react";
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
import { CheckCircle2, ShieldCheck, Lock, Scale } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PageShell, DisclaimerNote } from "@/components/SiteLayout";
import { PhoneCTA } from "@/components/PhoneCTA";
import { DISPLAY_PHONE_NUMBER } from "@/lib/analytics";
import { HONEST_DEAL, DOC_OPTIONS } from "@/lib/content";
import { getAttribution } from "@/lib/attribution";
import { insertReviewRequestSchema, type InsertReviewRequest } from "@shared/schema";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Florida",
  "Illinois","Kansas","Kentucky","Louisiana","Michigan","Mississippi","Montana",
  "Nebraska","Nevada","New Mexico","North Dakota","Ohio","Oklahoma",
  "Pennsylvania","South Dakota","Texas","Utah","West Virginia","Wyoming","Other",
];

export default function Sell() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<InsertReviewRequest>({
    resolver: zodResolver(insertReviewRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      state: "",
      county: "",
      producingStatus: "not_sure",
      documents: [],
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertReviewRequest) => {
      const res = await apiRequest("POST", "/api/review-requests", {
        ...data,
        ...getAttribution(),
      });
      return await res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      form.reset();
      // The thank-you page confirms next steps and fires the conversion event.
      navigate("/thank-you/review");
    },
    onError: (e: Error) => {
      toast({ title: "Couldn't submit your request", description: e.message, variant: "destructive" });
    },
  });

  return (
    <PageShell>
      {/* Header */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="strata-rule mb-5" />
          <h1 className="text-balance text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl">
            Sell or value your inherited minerals — without the pressure
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            We do buy mineral rights, and we believe the best deals happen when
            owners understand exactly what they have. Share a few details and
            we'll review your situation privately, then walk you through what we
            see — with no obligation to sell.
          </p>
          {DISPLAY_PHONE_NUMBER && (
            <p className="mt-5 text-sm text-muted-foreground">
              Prefer to talk first? <PhoneCTA location="sell-header" className="ml-1" />
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.1fr]">
        {/* Trust column */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-2xl font-semibold text-foreground">How we do business</h2>
          <ul className="mt-5 space-y-4">
            {HONEST_DEAL.map((line) => (
              <li key={line} className="flex gap-3 text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>

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
                We expect you to compare offers and talk to your own attorney or
                CPA before deciding anything.
              </p>
            </Card>
          </div>
        </div>

        {/* Form column */}
        <div>
          {submitted ? (
            <Card className="p-8 text-center sm:p-10" data-testid="card-review-success">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-foreground">
                Thank you — your request is in
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                In this prototype your request was saved securely. In production,
                a real person would review it and reach out within a couple of
                business days to walk you through what we see. There's no
                obligation, and you're free to step away at any point.
              </p>
              <Button
                className="mt-6"
                variant="outline"
                onClick={() => setSubmitted(false)}
                data-testid="button-review-again"
              >
                Submit another request
              </Button>
            </Card>
          ) : (
            <Card className="p-6 sm:p-7">
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
                            <Input placeholder="e.g. Reeves" data-testid="input-county" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                          />
                        </FormControl>
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
                    {mutation.isPending ? "Sending…" : "Request my private review"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    No obligation. We'll never share your details with marketers.
                    By submitting, you agree to our{" "}
                    <a href="#/privacy" className="underline hover:text-primary">Privacy Policy</a>{" "}
                    and{" "}
                    <a href="#/terms" className="underline hover:text-primary">Terms of Use</a>.
                  </p>
                </form>
              </Form>
            </Card>
          )}

          <DisclaimerNote className="mt-5" />
        </div>
      </section>
    </PageShell>
  );
}
