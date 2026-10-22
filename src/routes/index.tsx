import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowRight, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { PILLAR_LABELS, type Pillar } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Readiness Tracker — CloudPrep Pro AZ-900" },
      { name: "description", content: "Track your AZ-900 exam readiness across all three pillars." },
      { property: "og:title", content: "Readiness Tracker — CloudPrep Pro AZ-900" },
      { property: "og:description", content: "Track your AZ-900 exam readiness across all three pillars." },
    ],
  }),
  component: Dashboard,
});

function Ring({ value }: { value: number }) {
  const r = 70, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 180 180" className="h-48 w-48">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--secondary)" />
        </linearGradient>
      </defs>
      <circle cx="90" cy="90" r={r} fill="none" stroke="var(--muted)" strokeWidth="14" />
      <circle cx="90" cy="90" r={r} fill="none" stroke="url(#g)" strokeWidth="14" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} transform="rotate(-90 90 90)"
        className="transition-all duration-700" />
      <text x="90" y="88" textAnchor="middle" className="fill-foreground font-display text-4xl font-bold">{value}%</text>
      <text x="90" y="112" textAnchor="middle" className="fill-muted-foreground text-xs">ready</text>
    </svg>
  );
}

function Dashboard() {
  const { totalScore, pillarScore, pillars, activity, reset } = useStore();
  return (
    <>
      <PageHeader title="Readiness Tracker" sub="Every quiz answer and flashcard review moves these numbers." />
      <div className="grid gap-6 lg:grid-cols-5">
        <section className="flex flex-col items-center justify-center rounded-2xl bg-card p-6 shadow-soft lg:col-span-2">
          <h2 className="mb-2 font-semibold">Total Readiness Score</h2>
          <Ring value={totalScore} />
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {totalScore >= 80 ? "Moto kabisa! 🔥 You're exam ready." : totalScore >= 50 ? "You are cooking! 🍳 Keep going." : "Kaza uzi! (Keep pushing!)"}
          </p>
        </section>
        <section className="rounded-2xl bg-card p-6 shadow-soft lg:col-span-3">
          <h2 className="mb-5 font-semibold">AZ-900 Pillars</h2>
          <div className="space-y-6">
            {(Object.keys(PILLAR_LABELS) as Pillar[]).map((p) => {
              const v = pillarScore(p), s = pillars[p];
              return (
                <div key={p}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium">{PILLAR_LABELS[p]}</span>
                    <span className="font-semibold text-primary">{v}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${v}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{s.correct}/{s.attempted} quiz correct · {s.reviewed} cards reviewed</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl bg-card p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold"><Activity className="h-4 w-4 text-secondary" /> Recent Activity</h2>
          {activity.length > 0 && (
            <button onClick={reset} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
              <RotateCcw className="h-3 w-3" /> Reset progress
            </button>
          )}
        </div>
        {activity.length === 0 ? (
          <div className="flex flex-col items-start gap-3 text-sm text-muted-foreground">
            No activity yet. Start with a quiz to see your score climb.
            <Link to="/quiz" className="inline-flex items-center gap-1 rounded-lg bg-brand px-4 py-2 font-medium text-primary-foreground">
              Start a quiz <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <ul className="divide-y">
            {activity.map((a) => (
              <li key={a.id} className="flex justify-between py-2.5 text-sm">
                <span>{a.text}</span>
                <span className="text-xs text-muted-foreground">{new Date(a.at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
