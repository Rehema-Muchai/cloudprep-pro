import confetti from "canvas-confetti";

export const HYPE_WIN = ["Moto kabisa! 🔥", "You are cooking! 🍳", "Form ni Cloud! ☁️", "Oya, pure genius!"];
export const HYPE_MISS = ["Kaza uzi! (Keep pushing!)", "Almost there, don't give up!", "We move regardless!"];

export const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]!;

/** Hype line for a score ratio (0-1). 80%+ is a win. */
export const scoreHype = (ratio: number) => (ratio >= 0.8 ? pick(HYPE_WIN) : pick(HYPE_MISS));

/** 3-second confetti burst from both sides of the screen. */
export function celebrate() {
  const end = Date.now() + 3000;
  const colors = ["#22d3ee", "#a855f7", "#3b82f6", "#ffffff"];
  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors, zIndex: 9999 });
    confetti({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors, zIndex: 9999 });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
