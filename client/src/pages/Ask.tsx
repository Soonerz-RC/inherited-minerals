import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, ShieldAlert, BookOpen, ArrowRight, MessageCircleQuestion } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PageShell } from "@/components/SiteLayout";
import { LogoMark } from "@/components/Logo";
import { AssistantHandoff } from "@/components/AssistantHandoff";
import { usePageMeta } from "@/hooks/use-page-meta";
import { ctaHref } from "@/lib/cta";
import { CTA_ROUTES, CTA_LABELS } from "@/lib/learn";
import {
  GUIDED_TOPICS,
  relatedArticles,
  EMPTY_INTAKE,
  type IntakeState,
  type GuidedTopic,
} from "@/lib/assistant";
import type { AssistantResponse } from "@shared/schema";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  // Guided-topic articles (Phase 1) or cited articles from the AI (Phase 2).
  articles?: { slug: string; title: string }[];
  // Conversion CTA suggested alongside an assistant answer.
  cta?: { route: string; label: string };
  // Marks the static guided answer so we can label it.
  guided?: boolean;
}

const WELCOME =
  "Hi — I'm the Inherited Mineral Rights assistant. I can explain probate and title, royalty checks and division orders, valuation basics, leasing, and what to consider before selling — all in plain English. Pick a question below or tell me about your situation (for example, what state the minerals are in and whether they're producing).";

function ArticleLinks({ articles }: { articles: { slug: string; title: string }[] }) {
  if (!articles.length) return null;
  return (
    <div className="mt-3 border-t border-border/60 pt-3">
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <BookOpen className="h-3.5 w-3.5" /> Related guides
      </p>
      <ul className="mt-1.5 space-y-1">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/learn/${a.slug}`}
              className="text-sm text-primary hover:underline"
              data-testid={`link-article-${a.slug}`}
            >
              {a.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CtaButton({ cta }: { cta: { route: string; label: string } }) {
  return (
    <Link href={ctaHref(cta.route, "assistant")}>
      <Button variant="outline" size="sm" className="mt-3" data-testid="button-answer-cta">
        {cta.label}
        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    </Link>
  );
}

export default function Ask() {
  usePageMeta(
    "Ask the Inherited Minerals Assistant — Plain-English Answers",
    "A free, plain-English assistant for people who inherited oil and gas mineral rights. Get guided answers on probate, royalty checks, division orders, valuation, and offers — then request a private review.",
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [intake, setIntake] = useState<IntakeState>(EMPTY_INTAKE);
  const scrollRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation({
    mutationFn: async ({ message, history }: { message: string; history: ChatMessage[] }) => {
      const res = await apiRequest("POST", "/api/assistant-chat", {
        message,
        history: history.map((m) => ({ role: m.role, text: m.text })),
        intake,
      });
      return (await res.json()) as AssistantResponse;
    },
    onSuccess: (data) => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: data.reply,
          articles: data.articles?.map((a) => ({ slug: a.slug, title: a.title })),
          cta: data.cta,
        },
      ]);
    },
    onError: () => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Sorry — I couldn't respond just now. You can still use the suggested questions above for guided answers, or send your situation for a private review below.",
        },
      ]);
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, mutation.isPending]);

  // Phase 1: a guided topic answers instantly from local content (no backend).
  const sendGuided = (topic: GuidedTopic) => {
    if (mutation.isPending) return;
    const arts = relatedArticles(topic.articleSlugs);
    setMessages((m) => [
      ...m,
      { role: "user", text: topic.prompt },
      {
        role: "assistant",
        guided: true,
        text: topic.answer.join("\n\n") + (topic.steps ? "\n\n• " + topic.steps.join("\n• ") : ""),
        articles: arts,
        cta: { route: CTA_ROUTES[topic.cta], label: CTA_LABELS[topic.cta] },
      },
    ]);
  };

  // Phase 2: free-text questions go to the grounded AI chat endpoint.
  const sendFree = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || mutation.isPending) return;
    const history = messages;
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    mutation.mutate({ message: trimmed, history });
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="text-center">
          <Badge variant="outline" className="mb-4 border-bronze text-bronze">
            <Sparkles className="mr-1 h-3.5 w-3.5" /> Educational only
          </Badge>
          <h1 className="text-balance text-3xl font-semibold text-foreground sm:text-4xl">
            Ask the inherited minerals assistant
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            A plain-English starting point for your questions about inherited
            mineral rights. Tap a topic for an instant guided answer, or type
            your own question.
          </p>
        </div>

        {/* Disclaimer banner */}
        <div
          className="mt-8 flex gap-3 rounded-lg border border-bronze/40 bg-secondary/60 p-4 text-sm leading-relaxed text-muted-foreground"
          data-testid="banner-ai-disclaimer"
        >
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-bronze" />
          <p>
            <span className="font-medium text-foreground">Educational only. </span>
            These answers are general education and may be incomplete. This is
            not legal, tax, or financial advice, and it doesn't create an
            attorney–client relationship. State and county rules vary — always
            confirm specifics with a qualified attorney or CPA before deciding.
          </p>
        </div>

        {/* Suggested prompts (Phase 1 guided topics) */}
        <div className="mt-6">
          <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <MessageCircleQuestion className="h-4 w-4" /> Common questions — tap for a guided answer
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {GUIDED_TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => sendGuided(t)}
                disabled={mutation.isPending}
                className="hover-elevate rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground disabled:opacity-50"
                data-testid={`chip-topic-${t.id}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <Card className="mt-6 flex h-[30rem] flex-col overflow-hidden">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div
                  key={i}
                  className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground"
                  data-testid={`message-user-${i}`}
                >
                  {m.text}
                </div>
              ) : (
                <div key={i} className="flex max-w-[92%] gap-2.5" data-testid={`message-assistant-${i}`}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <LogoMark className="h-5 w-5" />
                  </span>
                  <div className="rounded-2xl rounded-bl-sm border border-border bg-secondary/40 px-4 py-3 text-sm leading-relaxed text-foreground">
                    {m.text.split("\n").map((line, j) => (
                      <p key={j} className={line.startsWith("•") ? "pl-1" : j > 0 ? "mt-2" : ""}>
                        {line}
                      </p>
                    ))}
                    {m.articles && m.articles.length > 0 && <ArticleLinks articles={m.articles} />}
                    {m.cta && <CtaButton cta={m.cta} />}
                  </div>
                </div>
              )
            )}

            {mutation.isPending && (
              <div className="flex max-w-[92%] gap-2.5" data-testid="message-typing">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <LogoMark className="h-5 w-5" />
                </span>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-secondary/40 px-4 py-3.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-border bg-background p-3 sm:p-4">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendFree(input);
                  }
                }}
                placeholder="Ask about probate, royalty checks, valuation, offers…"
                className="max-h-32 min-h-[2.75rem] resize-none"
                rows={1}
                data-testid="input-assistant"
              />
              <Button
                onClick={() => sendFree(input)}
                disabled={!input.trim() || mutation.isPending}
                size="icon"
                className="h-11 w-11 shrink-0"
                data-testid="button-send"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Phase 3 — lead summary handoff */}
        <div className="mt-10">
          <AssistantHandoff intake={intake} setIntake={setIntake} transcript={messages} />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Prefer to read first?{" "}
          <Link href="/learn" className="text-primary hover:underline" data-testid="link-to-learn">
            Browse the Learning Center
          </Link>
          .
        </p>
      </section>
    </PageShell>
  );
}
