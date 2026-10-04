// ─────────────────────────────────────────────
// Topic: useState — Stateful Components & Counters
// Added: 2026-10-01 | Status: LD
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)

import { useState } from "react";

/**
 * Live working component for the `useState` topic.
 * Extracted from the original App.tsx "Training / Focus & Discipline" section.
 * Demonstrates: stateful function component, functional updates, conditional rendering.
 */
export function CounterDemo() {
  const [count, setCount] = useState(0);

  return (
    <div className="inline-flex flex-col items-center gap-6 p-6 rounded-xl border border-dojo-border bg-dojo-surface/60">
      <div className="inline-flex items-center gap-6">
        <button
          onClick={() => setCount((c) => Math.max(0, c - 1))}
          className="w-11 h-11 rounded-lg border border-dojo-border hover:border-dojo-crimson hover:bg-dojo-crimson/10 transition text-xl"
          aria-label="Decrease reps"
        >
          −
        </button>
        <div className="min-w-[4rem] text-center">
          <span className="text-4xl font-mono tabular-nums text-dojo-ember">
            {count}
          </span>
          <p className="text-xs text-dojo-muted mt-1">reps</p>
        </div>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="w-11 h-11 rounded-lg border border-dojo-border hover:border-dojo-ember hover:bg-dojo-ember/10 transition text-xl"
          aria-label="Increase reps"
        >
          +
        </button>
      </div>

      {count > 0 && (
        <p className="text-sm text-dojo-muted">
          {count < 5 && "🌱 Warming up…"}
          {count >= 5 && count < 20 && "🔥 Getting stronger."}
          {count >= 20 && count < 50 && "💪 Serious training."}
          {count >= 50 && "🥋 Master level."}
        </p>
      )}
    </div>
  );
}
