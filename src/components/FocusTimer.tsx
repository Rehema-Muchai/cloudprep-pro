import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";

const DEFAULT = 25 * 60;

export function FocusTimer() {
  const [left, setLeft] = useState(DEFAULT);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) { setRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5">
      <Timer className="h-4 w-4 opacity-70" />
      <span className={`font-display text-sm font-semibold tabular-nums ${running ? "timer-glow" : ""}`}>
        {mm}:{ss}
      </span>
      <button aria-label={running ? "Pause focus timer" : "Start focus timer"}
        onClick={() => { if (left === 0) setLeft(DEFAULT); setRunning(!running); }}
        className="grid h-7 w-7 place-items-center rounded-full bg-brand text-primary-foreground transition hover:scale-105">
        {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>
      {left !== DEFAULT && !running && (
        <button aria-label="Reset focus timer" onClick={() => setLeft(DEFAULT)} className="opacity-60 hover:opacity-100">
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
