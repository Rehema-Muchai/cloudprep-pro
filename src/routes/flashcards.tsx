import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RotateCw, Flame } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { FLASHCARDS, PILLAR_LABELS, type FlashItem } from "@/lib/data";
import { useStore, type Rating } from "@/lib/store";

export const Route = createFileRoute("/flashcards")({
  head: () => ({
    meta: [
      { title: "Flashcard Coach — CloudPrep Pro" },
      { name: "description", content: "Spaced-repetition AZ-900 flashcards that resurface hard concepts." },
      { property: "og:title", content: "Flashcard Coach — CloudPrep Pro" },
      { property: "og:description", content: "Spaced-repetition AZ-900 flashcards that resurface hard concepts." },
    ],
  }),
  component: Flashcards,
});

// Spaced repetition: Hard cards come back after 2 cards, Good after 6, Easy go to the end.
const GAP: Record<Rating, number> = { hard: 2, good: 6, easy: Infinity };

function Flashcards() {
  const { rateCard, cardRatings, log } = useStore();
  const [queue, setQueue] = useState<FlashItem[]>(() => [...FLASHCARDS]);
  const [flipped, setFlipped] = useState(false);
  const [session, setSession] = useState(0);
  const card = queue[0]!;
  const hardCount = Object.values(cardRatings).filter((r) => r === "hard").length;

  const rate = (r: Rating) => {
    rateCard(card.id, card.topic, r);
    const rest = queue.slice(1);
    const pos = Math.min(GAP[r], rest.length);
    rest.splice(pos, 0, card);
    setQueue(rest);
    setFlipped(false);
    const n = session + 1;
    setSession(n);
    if (n % 5 === 0) log(`Reviewed ${n} Flashcards — ${n >= 15 ? "Form ni Cloud! ☁️" : "We move regardless!"}`);
  };

  return (
    <>
      <PageHeader title="Flashcard Coach" sub="Tap the card to flip. Rate yourself honestly — Hard cards come back sooner." />
      <div className="mb-6 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full bg-card px-4 py-1.5 shadow-soft">Reviewed this session: <b>{session}</b></span>
        <span className="flex items-center gap-1 rounded-full bg-card px-4 py-1.5 shadow-soft"><Flame className="h-4 w-4 text-destructive" /> Hard cards: <b>{hardCount}</b></span>
      </div>

      <div className="perspective mx-auto max-w-xl">
        <button onClick={() => setFlipped(!flipped)} aria-label="Flip card"
          className={`preserve-3d relative h-72 w-full transition-transform duration-700 ${flipped ? "rotate-y-180" : ""}`}>
          <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-brand p-8 text-primary-foreground shadow-soft">
            <span className="absolute left-5 top-5 rounded-full bg-primary-foreground/20 px-3 py-1 text-xs">{PILLAR_LABELS[card.topic]}</span>
            {cardRatings[card.id] === "hard" && <Flame className="absolute right-5 top-5 h-5 w-5" />}
            <h2 className="text-center text-2xl font-bold md:text-3xl">{card.term}</h2>
            <span className="absolute bottom-5 flex items-center gap-1 text-xs opacity-80"><RotateCw className="h-3 w-3" /> Tap to reveal</span>
          </div>
          <div className="backface-hidden rotate-y-180 absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-secondary bg-card p-8 shadow-soft">
            <p className="text-center text-lg leading-relaxed">{card.definition}</p>
          </div>
        </button>

        <div className={`mt-6 grid grid-cols-3 gap-3 transition-opacity ${flipped ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <button onClick={() => rate("hard")} className="rounded-xl bg-destructive py-3 font-semibold text-destructive-foreground">Hard</button>
          <button onClick={() => rate("good")} className="rounded-xl bg-primary py-3 font-semibold text-primary-foreground">Good</button>
          <button onClick={() => rate("easy")} className="rounded-xl bg-success py-3 font-semibold text-success-foreground">Easy</button>
        </div>
      </div>
    </>
  );
}
