// ─────────────────────────────────────────────
// Topic: useRef — a mutable box that survives renders, and a handle on a DOM node
// Added: 2026-10-07 | Status: RV (Reviewing)
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)
//
// `useRef` returns one object with a `current` property, and it is the **same object on
// every render**. Two jobs follow from that:
//
//   1. a **handle on a DOM node** — hand the ref to `ref={...}`, and React fills in
//      `.current` once the element exists. That is why the first render sees `null`, and
//      why every read is written `inputRef.current?.focus()`;
//   2. a **mutable value that outlives the render** — a plain `let` cannot, because the
//      component function starts over every render and would reset it.
//
// The rule that keeps both honest: a ref holds values that are **not needed for
// rendering**. Note where this file reads `.current` — a mount effect and two click
// handlers, and nowhere else. React does not watch a ref, so writing to one schedules no
// re-render; a number the screen depended on would sit there stale, which is what
// `useState` is for. `react-hooks/refs` rejects reading a ref during render outright.

import { useEffect, useRef, useState } from "react";

export function UseRefDemo() {
  const [reps, setReps] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLInputElement>(null);
  const tally = useRef({ renders: 0, lastReps: 0 });

  // `[]` — runs once, after the first render, which is the first moment the input exists
  // to be focused. The effect reads no state and no props, so the empty array is honest.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // No dependency array — runs after every render, which is what makes this a *previous*
  // value: read the ref before writing it, and each run holds the count from the render
  // that just ended. Nothing here re-renders the card; the ref only accumulates.
  useEffect(() => {
    tally.current.lastReps = reps;
    tally.current.renders += 1;
  });

  const handleAddRep = () => {
    setReps((current) => current + 1);
  };

  const handleClearReps = () => {
    setReps(0);
  };

  const handleReadLog = () => {
    const { renders, lastReps } = tally.current;
    const log = logRef.current;
    if (log) log.value = `${renders} render(s) so far · reps stood at ${lastReps}`;
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-dojo-border bg-dojo-surface/30 p-6">
      <div className="flex items-baseline justify-between">
        <span className="text-sm uppercase tracking-wider text-dojo-muted">
          Reps logged
        </span>
        <span className="font-mono text-3xl tabular-nums text-dojo-ember">{reps}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleAddRep}
          className="rounded-lg bg-dojo-ember px-4 py-2 text-sm font-medium text-black transition hover:bg-dojo-ember-bright"
        >
          Add a rep
        </button>
        <button
          onClick={handleClearReps}
          className="rounded-lg border border-dojo-border px-4 py-2 text-sm transition hover:border-dojo-crimson hover:text-dojo-crimson"
        >
          Clear
        </button>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-dojo-muted">
          Focus lands here on load
        </span>
        <input
          ref={inputRef}
          placeholder="Already focused — just start typing…"
          className="w-full rounded-md border border-dojo-border bg-dojo-bg/60 px-3 py-2 text-sm text-dojo-text outline-none focus:border-dojo-ember"
        />
      </label>

      <div className="flex flex-col gap-2">
        <input
          ref={logRef}
          readOnly
          placeholder="The ref's running log shows up here"
          className="w-full rounded-md border border-dojo-border bg-dojo-bg/60 px-3 py-2 font-mono text-xs text-dojo-muted outline-none focus:border-dojo-ember"
        />
        <button
          onClick={handleReadLog}
          className="w-fit rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-ember"
        >
          Read the ref's log
        </button>
      </div>

      <p className="text-xs text-dojo-muted">
        The log is kept in a ref, so writing to it never re-renders this card. The box
        changes only because a click handler put the text there.
      </p>
    </div>
  );
}
