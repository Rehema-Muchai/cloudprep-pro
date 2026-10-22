import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, ChevronDown, X, Trophy } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { QUIZZES, PILLAR_LABELS, type Pillar } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Smart Quiz Builder — CloudPrep Pro" },
      { name: "description", content: "Practice AZ-900 questions with instant feedback and explanations." },
      { property: "og:title", content: "Smart Quiz Builder — CloudPrep Pro" },
      { property: "og:description", content: "Practice AZ-900 questions with instant feedback and explanations." },
    ],
  }),
  component: Quiz,
});

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

function Quiz() {
  const { recordAnswer, log } = useStore();
  const [filter, setFilter] = useState<Pillar | "All">("All");
  const [round, setRound] = useState(0);
  const questions = useMemo(
    () => shuffle(QUIZZES.filter((q) => filter === "All" || q.topic === filter)).slice(0, 10),
    [filter, round],
  );
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [why, setWhy] = useState(false);
  const [score, setScore] = useState(0);

  const restart = (f = filter) => { setFilter(f); setRound((r) => r + 1); setI(0); setPicked(null); setWhy(false); setScore(0); };
  const done = i >= questions.length;
  const q = questions[i];

  const choose = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    const ok = opt === q.correctAnswer;
    if (ok) setScore((s) => s + 1);
    recordAnswer(q.topic, ok);
  };
  const next = () => {
    if (i + 1 >= questions.length) log(`Completed Quiz: ${score}/${questions.length}`);
    setI(i + 1); setPicked(null); setWhy(false);
  };

  return (
    <>
      <PageHeader title="Smart Quiz Builder" sub={`${QUIZZES.length} questions in the bank. Pick a pillar or mix them all.`} />
      <div className="mb-6 flex flex-wrap gap-2">
        {(["All", ...Object.keys(PILLAR_LABELS)] as (Pillar | "All")[]).map((f) => (
          <button key={f} onClick={() => restart(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${filter === f ? "bg-brand text-primary-foreground shadow-soft" : "bg-card hover:bg-accent"}`}>
            {f === "All" ? "All topics" : PILLAR_LABELS[f]}
          </button>
        ))}
      </div>

      {done ? (
        <div className="rounded-2xl bg-card p-10 text-center shadow-soft">
          <Trophy className="mx-auto h-12 w-12 text-warning" />
          <h2 className="mt-4 text-2xl font-bold">You scored {score}/{questions.length}</h2>
          <p className="mt-2 text-muted-foreground">Your readiness tracker has been updated.</p>
          <button onClick={() => restart()} className="mt-6 rounded-lg bg-brand px-6 py-2.5 font-medium text-primary-foreground">New quiz</button>
        </div>
      ) : (
        <div className="rounded-2xl bg-card p-6 shadow-soft md:p-8">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="rounded-full bg-accent px-3 py-1 font-medium text-accent-foreground">{PILLAR_LABELS[q.topic]}</span>
            <span className="text-muted-foreground">Question {i + 1} of {questions.length} · Score {score}</span>
          </div>
          <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-brand transition-all" style={{ width: `${(i / questions.length) * 100}%` }} />
          </div>
          <h2 className="mb-6 text-xl font-semibold leading-snug">{q.question}</h2>
          <div className="grid gap-3">
            {q.options.map((opt) => {
              const isRight = opt === q.correctAnswer, isPicked = opt === picked;
              const cls = !picked ? "border-border hover:border-secondary hover:bg-accent"
                : isRight ? "border-success bg-success/10 text-success"
                : isPicked ? "border-destructive bg-destructive/10 text-destructive" : "border-border opacity-50";
              return (
                <button key={opt} onClick={() => choose(opt)} disabled={!!picked}
                  className={`flex items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left font-medium transition ${cls}`}>
                  {opt}
                  {picked && isRight && <Check className="h-5 w-5" />}
                  {picked && isPicked && !isRight && <X className="h-5 w-5" />}
                </button>
              );
            })}
          </div>
          {picked && (
            <div className="mt-6 space-y-4">
              <button onClick={() => setWhy(!why)} className="flex w-full items-center justify-between rounded-xl bg-muted px-4 py-3 font-medium">
                Why?
                <ChevronDown className={`h-4 w-4 transition ${why ? "rotate-180" : ""}`} />
              </button>
              {why && <p className="animate-in fade-in slide-in-from-top-1 rounded-xl border-l-4 border-secondary bg-accent/50 px-4 py-3 text-sm">{q.explanation}</p>}
              <button onClick={next} className="w-full rounded-xl bg-brand py-3 font-semibold text-primary-foreground shadow-soft">
                {i + 1 >= questions.length ? "See results" : "Next question"}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
