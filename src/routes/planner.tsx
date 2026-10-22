import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { buildPlan } from "@/lib/plan";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Personal Study Planner — CloudPrep Pro" },
      { name: "description", content: "Generate a week-by-week AZ-900 study plan up to your exam date." },
      { property: "og:title", content: "Personal Study Planner — CloudPrep Pro" },
      { property: "og:description", content: "Generate a week-by-week AZ-900 study plan up to your exam date." },
    ],
  }),
  component: Planner,
});

function Planner() {
  const [date, setDate] = useState("");
  const [hours, setHours] = useState(2);
  const [plan, setPlan] = useState<ReturnType<typeof buildPlan> | null>(null);

  return (
    <>
      <PageHeader title="Personal Study Planner" sub="Tell us your timeline and we'll map out your weeks." />
      <form onSubmit={(e) => { e.preventDefault(); if (date) setPlan(buildPlan(new Date(), new Date(date), hours)); }}
        className="grid gap-4 rounded-2xl bg-card p-6 shadow-soft md:grid-cols-3 md:items-end">
        <label className="text-sm font-medium">
          <span className="mb-1.5 flex items-center gap-1"><CalendarDays className="h-4 w-4 text-secondary" /> When is your exam date?</span>
          <input type="date" required value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2.5" />
        </label>
        <label className="text-sm font-medium">
          <span className="mb-1.5 flex items-center gap-1"><Clock className="h-4 w-4 text-secondary" /> How many hours can you study per day?</span>
          <input type="number" min={0.5} max={12} step={0.5} value={hours} onChange={(e) => setHours(Number(e.target.value))}
            className="w-full rounded-lg border bg-background px-3 py-2.5" />
        </label>
        <button className="rounded-lg bg-brand py-2.5 font-semibold text-primary-foreground shadow-soft">Generate my plan</button>
      </form>

      {plan && (
        <div className="mt-8">
          <p className="mb-4 text-sm text-muted-foreground">
            {plan.days} days · about <b className="text-foreground">{plan.totalHours} study hours</b> total
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plan.weeks.map((w) => (
              <div key={w.week} className="rounded-2xl border-t-4 border-secondary bg-card p-5 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Week {w.week}</p>
                <p className="text-xs text-muted-foreground">{w.range}</p>
                <h3 className="mt-2 font-bold">{w.focus}</h3>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {w.tasks.map((t) => <li key={t}>• {t}</li>)}
                </ul>
                <p className="mt-3 text-xs font-medium text-primary">{w.hours} hrs this week</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
