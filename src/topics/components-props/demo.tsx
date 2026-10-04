// ─────────────────────────────────────────────
// Topic: Components & Props — data flows down, actions flow up
// Added: 2026-10-04 | Status: OK
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)
//
// This lesson began as a fix-it exercise and was verified on 2026-10-04. It now
// demonstrates the two things props are actually for:
//   1. The parent owns the state and passes the count down — data flows down.
//   2. The child renders what it is handed. It never keeps its own copy, because
//      props are a fresh snapshot on every render, not something to store.

import { useState } from "react";

type DrillProps = {
  /**
   * Heading shown for this drill.
   *
   * Deliberately **required**, not optional. `label?: string` would permit "a drill
   * with no name" — a state this component cannot render meaningfully — and the first
   * version of this lesson shipped exactly that bug: the parent forgot the label and
   * the row rendered blank. A required prop makes the compiler find every call site
   * that forgets one, instead of failing silently at render time.
   */
  label: string;
  /** The rep count. It is owned by the parent and handed down. */
  reps: number;
};

/** One drill row. It displays what its parent gives it. */
function Drill({ label, reps }: DrillProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-dojo-border bg-dojo-surface/60 px-4 py-3">
      <span className="font-medium">{label}</span>
      <span className="font-mono text-2xl tabular-nums text-dojo-ember">
        {reps}
      </span>
    </div>
  );
}

/** Live demo: the parent owns the state, and passes it down to its children. */
export function PropsDemo() {
  const [reps, setReps] = useState(0);

  return (
    <div className="w-full max-w-md rounded-xl border border-dojo-border bg-dojo-surface/30 p-6">
      <p className="text-xs uppercase tracking-wider text-dojo-muted">
        Session total
      </p>
      <p className="mt-1 font-mono text-4xl tabular-nums text-dojo-ember">
        {reps}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => setReps((r) => r + 1)}
          className="rounded-lg bg-dojo-ember px-4 py-2 font-medium text-black transition hover:bg-dojo-ember-bright"
        >
          Add a rep
        </button>
        <button
          onClick={() => setReps(0)}
          className="rounded-lg border border-dojo-border px-4 py-2 transition hover:border-dojo-crimson hover:text-dojo-crimson"
        >
          Reset
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Drill label="Roundhouse kicks" reps={reps} />
        <Drill label="Front kicks" reps={reps} />
      </div>
    </div>
  );
}
