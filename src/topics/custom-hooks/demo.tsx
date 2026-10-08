// ─────────────────────────────────────────────
// Topic: Custom hooks — a hook sequence with a name of your own
// Added: 2026-10-08 | Status: LD (lecture live — hands-on build outstanding)
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)
//
// A custom hook is not a React feature you import. It is a naming convention with teeth: a
// function whose name starts with `use` and which calls other hooks is a custom hook, and
// that prefix is the only thing telling `react-hooks/rules-of-hooks` that hooks are allowed
// inside it.
//
// The two panels below are deliberately **different components with different markup** — a
// round clock built around a big readout and two buttons, and a compact rest row with a
// single button. What they share is a sequence: two `useState` calls, an effect that runs an
// interval, and a cleanup that stops it. Without `useStopwatch` that sequence would be
// written twice, and the two copies would have to change together.
//
// Three things the demo shows at once:
//
//   1. the sequence lives in **one** function instead of in every component that needs a
//      ticking clock;
//   2. a hook is not a store. Each call to `useStopwatch()` gets its own state, so starting
//      the round clock leaves the rest row at zero;
//   3. callers see the return value and nothing else — the rest row takes the three things it
//      needs and ignores the fourth, and neither component can tell that an interval is
//      hiding inside.
//
// Hands-on task for this topic: see NOTES.md entry 13.

import { useEffect, useState } from "react";

/**
 * A stopwatch, as a hook. The caller gets a clock; the machinery behind it is private.
 *
 * The effect depends on `isRunning` and nothing else. The tick reads the count through the
 * updater form — `setSeconds((current) => current + 1)` — so the value that changes every
 * second never has to appear in the dependency array. Reading `seconds` directly would force
 * `[isRunning, seconds]`, tearing the interval down and rebuilding it on every tick.
 */
function useStopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const id = window.setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(id);
  }, [isRunning]);

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return {
    isRunning,
    label: `${minutes}:${String(remainder).padStart(2, "0")}`,
    toggle: () => setIsRunning((running) => !running),
    reset: () => {
      setIsRunning(false);
      setSeconds(0);
    },
  };
}

function RoundClock() {
  const { label, isRunning, toggle, reset } = useStopwatch();

  return (
    <section
      aria-label="Round clock"
      className="flex flex-col gap-3 rounded-lg border border-dojo-border bg-dojo-bg/40 p-4"
    >
      <h3 className="text-xs uppercase tracking-wider text-dojo-muted">Round</h3>
      <p className="font-mono text-3xl tabular-nums text-dojo-ember">{label}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={toggle}
          className="rounded-lg bg-dojo-ember px-3 py-2 text-sm font-medium text-black transition hover:bg-dojo-ember-bright"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-crimson hover:text-dojo-crimson"
        >
          Reset
        </button>
      </div>
    </section>
  );
}

function RestRow() {
  const { label, isRunning, toggle } = useStopwatch();

  return (
    <section
      aria-label="Rest clock"
      className="flex items-center justify-between gap-3 rounded-lg border border-dojo-border bg-dojo-bg/40 px-4 py-3"
    >
      <div className="flex min-w-0 flex-col">
        <h3 className="text-xs uppercase tracking-wider text-dojo-muted">Rest</h3>
        <span className="truncate text-xs text-dojo-muted">
          {isRunning ? "Resting — breathe" : "Ready when you are"}
        </span>
      </div>
      <span className="font-mono text-xl tabular-nums text-dojo-ember">{label}</span>
      <button
        type="button"
        onClick={toggle}
        className="shrink-0 rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-ember"
      >
        {isRunning ? "Stop" : "Rest"}
      </button>
    </section>
  );
}

export function CustomHooksDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <RoundClock />
      <RestRow />
      <p className="text-xs text-dojo-muted">
        Two different components, one hook. Each call to useStopwatch keeps its own clock, so
        the round timer and the rest timer never touch.
      </p>
    </div>
  );
}
