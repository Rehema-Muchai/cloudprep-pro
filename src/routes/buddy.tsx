import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, User } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { BUDDY_TOPICS } from "@/lib/data";

export const Route = createFileRoute("/buddy")({
  head: () => ({
    meta: [
      { title: "AI Study Buddy — CloudPrep Pro" },
      { name: "description", content: "AZ-900 concepts explained with relatable African examples." },
      { property: "og:title", content: "AI Study Buddy — CloudPrep Pro" },
      { property: "og:description", content: "AZ-900 concepts explained with relatable African examples." },
    ],
  }),
  component: Buddy,
});

type Msg = { from: "bot" | "me"; text: string };

function answer(input: string) {
  const words = input.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
  let best = { score: 0, a: "" };
  for (const t of BUDDY_TOPICS) {
    const hay = (t.q + " " + t.a).toLowerCase();
    const score = words.filter((w) => hay.includes(w)).length + (t.q.toLowerCase().includes(input.toLowerCase()) ? 5 : 0);
    if (score > best.score) best = { score, a: t.a };
  }
  return best.score > 0 ? best.a : "I don't have that one yet! Try one of the topic buttons below — like Availability Zones or CapEx vs OpEx.";
}

function Buddy() {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: "Habari! I'm your Study Buddy. Pick a concept below or ask me something, and I'll explain it with an example from home." }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), [msgs, typing]);

  const ask = (q: string) => {
    if (!q.trim() || typing) return;
    setMsgs((m) => [...m, { from: "me", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => { setMsgs((m) => [...m, { from: "bot", text: answer(q) }]); setTyping(false); }, 700);
  };

  return (
    <>
      <PageHeader title="AI Study Buddy" sub="Tricky concepts, explained with everyday African examples." />
      <div className="flex h-[60vh] flex-col overflow-hidden rounded-2xl bg-card shadow-soft">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.from === "me" ? "flex-row-reverse" : ""}`}>
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${m.from === "bot" ? "bg-brand text-primary-foreground" : "bg-muted"}`}>
                {m.from === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <p className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.from === "bot" ? "bg-muted" : "bg-primary text-primary-foreground"}`}>{m.text}</p>
            </div>
          ))}
          {typing && <p className="pl-11 text-sm text-muted-foreground animate-pulse">Buddy is typing…</p>}
          <div ref={end} />
        </div>
        <div className="border-t p-3">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {BUDDY_TOPICS.map((t) => (
              <button key={t.q} onClick={() => ask(t.q)}
                className="shrink-0 rounded-full border border-secondary/40 bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-secondary hover:text-secondary-foreground">
                {t.q}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about a concept…"
              className="flex-1 rounded-lg border bg-background px-3 py-2.5 text-sm" />
            <button aria-label="Send" className="grid w-11 place-items-center rounded-lg bg-brand text-primary-foreground"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      </div>
    </>
  );
}
