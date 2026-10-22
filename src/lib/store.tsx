import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Pillar } from "./data";

type PillarStat = { correct: number; attempted: number; reviewed: number; mastered: number };
export type Rating = "hard" | "good" | "easy";
type Activity = { id: number; text: string; at: number };

type State = {
  pillars: Record<Pillar, PillarStat>;
  cardRatings: Record<number, Rating>;
  activity: Activity[];
};

const empty = (): PillarStat => ({ correct: 0, attempted: 0, reviewed: 0, mastered: 0 });
const initial: State = {
  pillars: { "Cloud Concepts": empty(), Architecture: empty(), Management: empty() },
  cardRatings: {},
  activity: [],
};

type Ctx = State & {
  recordAnswer: (topic: Pillar, correct: boolean) => void;
  rateCard: (id: number, topic: Pillar, r: Rating) => void;
  log: (text: string) => void;
  pillarScore: (p: Pillar) => number;
  totalScore: number;
  reset: () => void;
};

const StoreCtx = createContext<Ctx | null>(null);
const KEY = "cloudprep-state-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, loaded]);

  const log = (text: string) =>
    setState((s) => ({ ...s, activity: [{ id: Date.now() + Math.random(), text, at: Date.now() }, ...s.activity].slice(0, 12) }));

  const recordAnswer = (topic: Pillar, correct: boolean) =>
    setState((s) => {
      const p = s.pillars[topic];
      return { ...s, pillars: { ...s.pillars, [topic]: { ...p, attempted: p.attempted + 1, correct: p.correct + (correct ? 1 : 0) } } };
    });

  const rateCard = (id: number, topic: Pillar, r: Rating) =>
    setState((s) => {
      const p = s.pillars[topic];
      return {
        ...s,
        cardRatings: { ...s.cardRatings, [id]: r },
        pillars: { ...s.pillars, [topic]: { ...p, reviewed: p.reviewed + 1, mastered: p.mastered + (r === "easy" ? 1 : r === "good" ? 0.5 : 0) } },
      };
    });

  // Quiz accuracy weighs 70%, flashcard confidence 30%.
  const pillarScore = (topic: Pillar) => {
    const p = state.pillars[topic];
    const quiz = p.attempted ? p.correct / p.attempted : 0;
    const cards = p.reviewed ? p.mastered / p.reviewed : 0;
    const confidence = Math.min(1, (p.attempted + p.reviewed) / 10);
    return Math.round((quiz * 0.7 + cards * 0.3) * confidence * 100);
  };
  const totalScore = Math.round(
    (["Cloud Concepts", "Architecture", "Management"] as Pillar[]).reduce((a, p) => a + pillarScore(p), 0) / 3,
  );

  return (
    <StoreCtx.Provider value={{ ...state, recordAnswer, rateCard, log, pillarScore, totalScore, reset: () => setState(initial) }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
