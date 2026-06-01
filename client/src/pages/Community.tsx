import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { MessageCircleQuestion, MessagesSquare, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PageShell, DisclaimerNote } from "@/components/SiteLayout";
import {
  QA_CATEGORIES,
  SAMPLE_QUESTIONS,
} from "@/lib/content";
import { insertQuestionSchema, type InsertQuestion, type Question } from "@shared/schema";

export default function Community() {
  const { toast } = useToast();

  const { data: posted = [] } = useQuery<Question[]>({
    queryKey: ["/api/questions"],
  });

  const form = useForm<InsertQuestion>({
    resolver: zodResolver(insertQuestionSchema),
    defaultValues: {
      title: "",
      body: "",
      category: "",
      state: "",
      displayName: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertQuestion) => {
      const res = await apiRequest("POST", "/api/questions", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      form.reset();
      toast({
        title: "Question posted",
        description:
          "Thanks for sharing. In this prototype your question is saved and shown below.",
      });
      document.getElementById("recent-questions")?.scrollIntoView({ behavior: "smooth" });
    },
    onError: (e: Error) => {
      toast({ title: "Couldn't post your question", description: e.message, variant: "destructive" });
    },
  });

  return (
    <PageShell>
      {/* Header */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="strata-rule mb-5" />
          <h1 className="text-balance text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl">
            Community Q&amp;A
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Real questions from people navigating inherited minerals — answered
            with experience, not sales pressure. Browse by topic, learn from
            others, and ask your own.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {QA_CATEGORIES.map((c) => (
              <Badge key={c.label} variant="secondary" className="font-normal">
                {c.label}
                <span className="ml-1.5 text-muted-foreground">{c.count}</span>
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.4fr_1fr]">
        {/* Question feed */}
        <div>
          <div className="flex items-center gap-2.5">
            <MessagesSquare className="h-6 w-6 text-bronze" />
            <h2 className="text-2xl font-semibold text-foreground">Popular questions</h2>
          </div>

          <div className="mt-6 space-y-4">
            {SAMPLE_QUESTIONS.map((q) => (
              <Card
                key={q.title}
                className="hover-elevate cursor-pointer p-5"
                data-testid={`card-question-${q.title.slice(0, 12)}`}
              >
                <div className="flex items-start gap-3">
                  <MessageCircleQuestion className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {q.title}
                    </h3>
                    <p className="mt-1.5 leading-relaxed text-muted-foreground">{q.excerpt}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{q.category}</Badge>
                      <span>·</span>
                      <span>{q.state}</span>
                      <span>·</span>
                      <span>{q.answers} answers</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Recently posted (from prototype DB) */}
          <div id="recent-questions" className="mt-10 scroll-mt-24">
            <h2 className="text-xl font-semibold text-foreground">
              Recently posted here
            </h2>
            {posted.length === 0 ? (
              <Card className="mt-4 border-dashed p-6 text-center text-muted-foreground" data-testid="empty-questions">
                <MessageCircleQuestion className="mx-auto h-7 w-7 text-muted-foreground/60" />
                <p className="mt-2 text-sm">
                  No community questions yet. Be the first to ask using the form.
                </p>
              </Card>
            ) : (
              <div className="mt-4 space-y-3">
                {posted.map((q) => (
                  <Card key={q.id} className="p-5" data-testid={`card-posted-${q.id}`}>
                    <h3 className="font-serif font-semibold text-foreground">{q.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{q.body}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{q.category}</Badge>
                      {q.state && (<><span>·</span><span>{q.state}</span></>)}
                      {q.displayName && (<><span>·</span><span>{q.displayName}</span></>)}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ask form */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-foreground">Ask the community</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Keep it general — please don't share full names, account numbers, or
              sensitive personal details.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
                className="mt-5 space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Do I need probate to transfer inherited minerals?"
                          data-testid="input-question-title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share the context — what arrived, what state the minerals are in, what you're trying to figure out."
                          className="min-h-[7rem]"
                          data-testid="input-question-body"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-question-category">
                              <SelectValue placeholder="Choose a topic" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {QA_CATEGORIES.map((c) => (
                              <SelectItem key={c.label} value={c.label}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Texas" data-testid="input-question-state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display name (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Heir in Oklahoma" data-testid="input-question-name" {...field} />
                      </FormControl>
                      <FormDescription>Use a nickname — no need for your real name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending}
                  data-testid="button-post-question"
                >
                  {mutation.isPending ? "Posting…" : "Post question"}
                </Button>
              </form>
            </Form>
          </Card>

          <DisclaimerNote className="mt-5" />
        </div>
      </section>
    </PageShell>
  );
}
