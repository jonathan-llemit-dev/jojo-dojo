// ─────────────────────────────────────────────
// Topic: Conditional Rendering — &&, ternary, early return
// Added: 2026-10-04 | Status: OK
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)
//
// This lesson began as a fix-it exercise and was verified on 2026-10-04. It now
// demonstrates the two decisions conditional rendering is really made of:
//
//   1. WHICH construct. A ternary when both outcomes are real — it cannot leave a
//      gap. `&&` when there is only a "show it" and a "show nothing". Two separate
//      `&&`s are not an either/or: nothing ties them together, so they can overlap
//      (both appear) or leave a gap (neither appears).
//   2. WHAT the left side of `&&` is. `reps && …` renders the number 0 itself when
//      reps is 0, because `&&` returns the falsy left operand rather than coercing.
//      Naming the condition — `const isTraining = reps > 0;` — keeps the left side
//      a real boolean, which is the habit that prevents the whole class of bug.

import { useState } from "react";

type SummaryRowProps = {
  label: string;
  value: string;
};

/** One line of the session summary. Props again — data flows down. */
function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-dojo-muted">{label}</span>
      <span className="font-mono tabular-nums text-dojo-ember">{value}</span>
    </div>
  );
}

/** Live demo: which parts of the summary appear depends on the rep count. */
export function ConditionalDemo() {
  const [reps, setReps] = useState(0);
  const isTraining = reps > 0;

  return (
    <div className="w-full max-w-md rounded-xl border border-dojo-border bg-dojo-surface/30 p-6">
      <h2 className="text-lg font-semibold text-dojo-ember">Session summary</h2>

      {/* Status badge. The h-6 keeps the row's height stable so the layout does
          not jump when the badge text changes length. */}
      <div className="mt-3 flex h-6 items-center gap-2">
        {isTraining ? (
          <span className="inline-flex items-center rounded-full border border-dojo-ember px-3 py-0.5 text-xs text-dojo-ember">
            Training
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full border border-dojo-border px-3 py-0.5 text-xs text-dojo-muted">
            Rest day
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <SummaryRow label="Reps logged" value={String(reps)} />
        {isTraining && (
          <SummaryRow label="Nice work" value={`${reps} reps in the bank`} />
        )}
      </div>

      {reps >= 10 && reps <= 20 && (
        <p className="mt-4 text-sm text-dojo-ember">
          🥋 Milestone: 10 reps reached.
        </p>
      )}

      {reps > 20 && (
        <p className="mt-4 text-sm text-dojo-ember">
          😵 You may get overfatigued.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => setReps((r) => r + 1)}
          className="rounded-lg bg-dojo-ember px-4 py-2 font-medium text-black transition hover:bg-dojo-ember-bright"
        >
          Log a rep
        </button>
        <button
          onClick={() => setReps(0)}
          className="rounded-lg border border-dojo-border px-4 py-2 transition hover:border-dojo-crimson hover:text-dojo-crimson"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
