import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, ShieldAlert } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PageShell } from "@/components/SiteLayout";
import { LogoMark } from "@/components/Logo";
import type { AssistantResponse } from "@shared/schema";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const STARTERS = [
  "I just inherited minerals — where do I start?",
  "What documents do I need to claim inherited minerals?",
  "How do royalty checks and division orders work?",
  "How is the value of mineral rights estimated?",
  "What should I check before considering an offer?",
];

const WELCOME =
  "Hi — I'm the Inherited Mineral Rights assistant. I can explain probate and title, royalty checks, valuation basics, leasing, and what to consider before selling, all in plain English. Tell me a bit about your situation (for example, what state the minerals are in and whether they're producing) and I'll point you to the right concepts and next steps.";

export default function Ask() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", "/api/assistant", { message });
      return (await res.json()) as AssistantResponse;
    },
    onSuccess: (data) => {
      setMessages((m) => [...m, { role: "assistant", text: data.reply }]);
    },
    onError: () => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Sorry — I couldn't respond just now. Please try again in a moment.",
        },
      ]);
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, mutation.isPending]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || mutation.isPending) return;
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    mutation.mutate(trimmed);
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="text-center">
          <Badge variant="outline" className="mb-4 border-bronze text-bronze">
            <Sparkles className="mr-1 h-3.5 w-3.5" /> Preview · educational only
          </Badge>
          <h1 className="text-balance text-3xl font-semibold text-foreground sm:text-4xl">
            Ask the inherited minerals assistant
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            A plain-English starting point for your questions. This is an early
            preview that gives general educational answers — it is not legal,
            tax, or financial advice.
          </p>
        </div>

        {/* Disclaimer banner */}
        <div
          className="mt-8 flex gap-3 rounded-lg border border-bronze/40 bg-secondary/60 p-4 text-sm leading-relaxed text-muted-foreground"
          data-testid="banner-ai-disclaimer"
        >
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-bronze" />
          <p>
            <span className="font-medium text-foreground">Preview notice. </span>
            Answers are general education and may be incomplete. The assistant
            won't act as your attorney or accountant. Always confirm specifics
            with a qualified professional before making a decision.
          </p>
        </div>

        {/* Chat window */}
        <Card className="mt-6 flex h-[28rem] flex-col overflow-hidden">
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
                    {m.text}
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
                    send(input);
                  }
                }}
                placeholder="Ask about probate, royalty checks, valuation, offers…"
                className="max-h-32 min-h-[2.75rem] resize-none"
                rows={1}
                data-testid="input-assistant"
              />
              <Button
                onClick={() => send(input)}
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

        {/* Starter prompts */}
        <div className="mt-5">
          <p className="text-sm font-medium text-muted-foreground">Try asking:</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={mutation.isPending}
                className="hover-elevate rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground disabled:opacity-50"
                data-testid={`chip-starter-${s.slice(0, 10)}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
