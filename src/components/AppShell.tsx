import { Link } from "@tanstack/react-router";
import { LayoutDashboard, ListChecks, Layers, CalendarDays, MessageCircle, Cloud } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { FocusTimer } from "./FocusTimer";
import { CertSwitcher } from "./CertSwitcher";
import { useStore } from "@/lib/store";
import { celebrate } from "@/lib/hype";
import type { Pillar } from "@/lib/data";

const PILLARS: Pillar[] = ["Cloud Concepts", "Architecture", "Management"];

// Fires confetti when any pillar newly reaches 100%.
function usePillarCelebration() {
  const { pillarScore } = useStore();
  const scores = PILLARS.map(pillarScore);
  const prev = useRef<number[] | null>(null);
  useEffect(() => {
    if (prev.current && scores.some((v, i) => v === 100 && prev.current![i]! < 100)) celebrate();
    prev.current = scores;
  }, [scores.join(",")]);
}

const NAV = [
  { to: "/", label: "Readiness", icon: LayoutDashboard },
  { to: "/quiz", label: "Quiz", icon: ListChecks },
  { to: "/flashcards", label: "Flashcards", icon: Layers },
  { to: "/planner", label: "Planner", icon: CalendarDays },
  { to: "/buddy", label: "Study Buddy", icon: MessageCircle },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  usePillarCelebration();
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-navy p-5 text-navy-foreground md:flex">
        <div className="mb-10 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand"><Cloud className="h-5 w-5" /></div>
          <div>
            <p className="font-display text-lg font-bold leading-none">CloudPrep Pro</p>
            <p className="text-xs opacity-60">AZ-900 Toolkit</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: true }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium opacity-70 transition hover:bg-navy-foreground/10 hover:opacity-100"
              activeProps={{ className: "!opacity-100 bg-brand shadow-soft" }}>
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-0 z-40 flex items-center justify-between gap-2 border-x-0 border-t-0 px-4 py-2.5 md:justify-end md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand"><Cloud className="h-4 w-4" /></div>
            <p className="font-display font-bold">CloudPrep Pro</p>
          </div>
          <FocusTimer />
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-8">{children}</main>
        <footer className="border-t px-4 py-4 pb-24 text-center text-xs text-muted-foreground md:pb-4">
          Unofficial study tool. Not affiliated with Microsoft. Built for the Vibe Coding Hackathon.
        </footer>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-around border-t bg-navy py-2 text-navy-foreground md:hidden">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: true }}
            className="flex flex-col items-center gap-0.5 px-2 text-[10px] opacity-60"
            activeProps={{ className: "!opacity-100 text-accent" }}>
            <Icon className="h-5 w-5" /> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function PageHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-2 text-muted-foreground">{sub}</p>
    </div>
  );
}
