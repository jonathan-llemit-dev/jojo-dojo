// ─────────────────────────────────────────────
// Topic: Custom hooks — a hook sequence with a name of your own
// Added: 2026-10-08 | Status: OK (verified — built and explained)
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)
//
// A custom hook is not a React feature you import. It is a naming convention with teeth: a
// function whose name starts with `use` and which calls other hooks is a custom hook, and
// that prefix is the only thing telling `react-hooks/rules-of-hooks` that hooks are allowed
// inside it. React does not check the name at runtime.
//
// The two panels below are deliberately **different components with different markup** — a
// round clock built around a big readout and two buttons, and a compact rest row with a
// single button. A shared `<Clock>` component could not serve both without growing props for
// every difference. What they share is behaviour, not markup.
//
// Three things the demo shows at once:
//
//   1. the sequence — two pieces of state and one effect — lives in **one** function instead
//      of in every component that needs a ticking count;
//   2. a hook is not a store. Each call to `useTicker(intervalMs)` gets its own state, so
//      starting the round clock leaves the rest row at zero;
//   3. callers see the return value and nothing else. The rest row takes three of the five
//      things and ignores the other two, and neither component can tell an interval is hiding.
//
// **Simplification, and it is visible on purpose.** `useTicker` counts whole ticks. Pause
// after half a tick and that half is discarded, so toggling faster than the interval means
// the count never advances. A real stopwatch records `Date.now()` when it starts and derives
// elapsed time from timestamps, which survives a partial tick. This demo counts ticks because
// the lesson is the extraction, not the arithmetic.
//
// Hands-on task for this topic: see NOTES.md entry 13.
//
// The reference demo uses **only** `useState`, `useEffect` and `useId`. The stopwatch below adds
// `useRef` on purpose, because a timestamp anchor and a banked total are values the render never
// shows: the number on screen is state, and the two refs are bookkeeping behind it.

import { useEffect, useId, useRef, useState } from "react";

/** What `useTicker` hands back — the whole API a caller is allowed to see. */
export type UseTickerResult = {
  ticks: number;
  isRunning: boolean;
  label: string;
  toggle: () => void;
  reset: () => void;
};

type LapEntry = { id: number; time: number };

interface UseContinuousTimer {
  // What the caller gets back from `useContinuousTimer`.
  mainTimer: number;      // total milliseconds elapsed across all runs
  laps: LapEntry[];       // timestamps recorded by each "Lap" press
  isRunning: boolean;     // whether the timer is currently counting
  start: () => void;      // begin (or resume) counting
  stop: () => void;       // pause and bank the elapsed time so far
  reset: () => void;      // clear everything back to zero
  lap: () => void;        // record the current time as a lap entry
}

/**
 * A tick counter, as a hook, for callers that need a clock-shaped number.
 *
 * The effect depends on `isRunning` and `intervalMs` and nothing else. The tick reads the
 * count through the updater form — `setTicks((current) => current + 1)` — so the value that
 * changes every tick never has to appear in the dependency array. Reading `ticks` directly
 * would force `[isRunning, intervalMs, ticks]`, which tears the interval down and rebuilds it
 * on every tick, and the closure would capture the count as it was when the interval started.
 *
 * `if (!isRunning) return;` sits **inside** the effect. That is an early return from a
 * callback, not a conditional hook call: the hook itself still runs on every render.
 *
 * Like every hook, it must be called at the top level — not inside an `if`, a loop or a
 * callback. That is the half of `rules-of-hooks` the name cannot satisfy for you.
 */
function useTicker(intervalMs: number): UseTickerResult {
  const [ticks, setTicks] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const id = window.setInterval(() => {
      setTicks((current) => current + 1);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [isRunning, intervalMs]);

  const minutes = Math.floor(ticks / 60);
  const remainder = ticks % 60;

  // A new object and two new functions on every render. That is fine here: nothing below is
  // memoised, so a fresh identity costs nothing today. `useCallback` earns its keep only when
  // a child is wrapped in `React.memo` or a callback sits in a dependency array.
  return {
    ticks,
    isRunning,
    label: `${minutes}:${String(remainder).padStart(2, "0")}`,
    toggle: () => setIsRunning((running) => !running),
    reset: () => {
      setIsRunning(false);
      setTicks(0);
    },
  };
}

function useContinuousTimer(): UseContinuousTimer {
  const [elapsed, setElapsed] = useState(0); // ms
  const [laps, setLaps] = useState<LapEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // When the current run started, on the monotonic clock. `null` means stopped.
  const startRef = useRef<number | null>(null);
  // Time banked by earlier runs, so Stop then Start resumes instead of restarting.
  const accumulatedRef = useRef(0);

  // The frame loop lives in an effect: starting it is the subscribe, and the cleanup is the
  // cancel. That removes the handle you would otherwise carry by hand, and it removes the
  // recursive callback — a function that calls itself cannot be memoised with empty deps
  // without `react-hooks/immutability` objecting that it reads a name that does not exist yet.
  useEffect(() => {
    if (!isRunning) return;

    let frame = 0;
    const draw = () => {
      const startedAt = startRef.current;
      if (startedAt == null) return;
      setElapsed(accumulatedRef.current + (performance.now() - startedAt));
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [isRunning]);

  // Plain functions, not `useCallback`: nothing compares their identity — no memoised child,
  // no dependency array — so wrapping them would buy nothing.
  const start = () => {
    if (startRef.current != null) return; // already running
    startRef.current = performance.now();
    setIsRunning(true);
  };

  const stop = () => {
    if (startRef.current == null) return;
    accumulatedRef.current += performance.now() - startRef.current;
    startRef.current = null;
    setElapsed(accumulatedRef.current);
    setIsRunning(false);
  };

  const reset = () => {
    startRef.current = null;
    accumulatedRef.current = 0;
    setElapsed(0);
    setLaps([]);
    setIsRunning(false);
  };

  const lap = () => {
    const startedAt = startRef.current;
    const at =
      startedAt != null
        ? accumulatedRef.current + (performance.now() - startedAt)
        : accumulatedRef.current;
    setLaps((prev) => [...prev, { id: prev.length + 1, time: at }]);
  };

  // rAF is paused in a hidden tab, so the readout is stale the moment the tab comes back.
  useEffect(() => {
    if (!isRunning) return;
    const onVisible = () => {
      const startedAt = startRef.current;
      if (document.visibilityState === "visible" && startedAt != null) {
        setElapsed(accumulatedRef.current + (performance.now() - startedAt));
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [isRunning]);

  return {
    mainTimer: elapsed,
    laps,
    isRunning,
    start,
    stop,
    reset,
    lap,
  };
}

/**
 * Turns raw milliseconds into `M:SS.t` — minutes, zero-padded seconds,
 * and one digit of tenths so a stopwatch readout looks fine-grained enough
 * to be credible. The tenths come from `Math.floor((ms % 1000) / 100)`,
 * which is the hundreds digit of the millisecond portion.
 */
function formatTime(ms: number): string {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const tenths = Math.floor((ms % 1000) / 100);
  return `${minutes}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

function StopwatchPanel() {
  // Takes all seven things `useContinuousTimer` returns — it needs laps and a per-lap
  // `lap()` call, which the session row below does not. Two callers shaped differently are
  // what make the hook worth having.
  const headingId = useId();
  const { mainTimer, laps, isRunning, start, stop, reset, lap } =
    useContinuousTimer();

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-3 rounded-lg border border-dojo-border bg-dojo-bg/40 p-4"
    >
      <h3 id={headingId} className="text-xs uppercase tracking-wider text-dojo-muted">
        Stopwatch
      </h3>

      <p
        role="timer"
        aria-label={`Stopwatch: ${formatTime(mainTimer)}`}
        className="font-mono text-4xl tabular-nums text-dojo-ember"
      >
        {formatTime(mainTimer)}
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={isRunning ? stop : start}
          className="rounded-lg bg-dojo-ember px-3 py-2 text-sm font-medium text-black transition hover:bg-dojo-ember-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember"
        >
          {isRunning ? "Stop" : "Start"}
        </button>
        <button
          type="button"
          onClick={lap}
          disabled={!isRunning}
          className="rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember disabled:opacity-40"
        >
          Lap
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={isRunning || mainTimer === 0}
          className="rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-crimson hover:text-dojo-crimson focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      {laps.length > 0 && (
        <ol className="max-h-40 overflow-y-auto rounded-lg border border-dojo-border bg-dojo-bg/60 divide-y divide-dojo-border">
          {laps.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between px-3 py-1.5 text-xs font-mono tabular-nums"
            >
              <span className="text-dojo-muted">Lap {entry.id}</span>
              <span className="text-dojo-ember">{formatTime(entry.time)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function SessionTimerRow() {
  const headingId = useId();
  const { mainTimer, isRunning, start, stop } = useContinuousTimer();

  return (
    <section
      aria-labelledby={headingId}
      className="flex items-center justify-between gap-3 rounded-lg border border-dojo-border bg-dojo-bg/40 px-4 py-3"
    >
      <div className="flex min-w-0 flex-col">
        <h3 id={headingId} className="text-xs uppercase tracking-wider text-dojo-muted">
          Session
        </h3>
        <span className="truncate text-xs text-dojo-muted">
          {isRunning ? "Running — stay focused" : "Idle"}
        </span>
      </div>

      <p
        role="timer"
        aria-label={`Session time: ${formatTime(mainTimer)}`}
        className="font-mono text-xl tabular-nums text-dojo-ember"
      >
        {formatTime(mainTimer)}
      </p>

      <button
        type="button"
        onClick={isRunning ? stop : start}
        className="shrink-0 rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember"
      >
        {isRunning ? "Stop" : "Start"}
      </button>
    </section>
  );
}

function RoundClock({ intervalMs }: { intervalMs: number }) {
  const headingId = useId();
  const { ticks, isRunning, label, toggle, reset } = useTicker(intervalMs);

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-3 rounded-lg border border-dojo-border bg-dojo-bg/40 p-4"
    >
      <h3 id={headingId} className="text-xs uppercase tracking-wider text-dojo-muted">
        Round
      </h3>
      <p
        role="timer"
        aria-label={`Round clock: ${label}`}
        className="font-mono text-3xl tabular-nums text-dojo-ember"
      >
        {label}
      </p>
      <p className="text-[11px] text-dojo-muted/70">
        ticks: {ticks} · every {intervalMs}ms
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={toggle}
          className="rounded-lg bg-dojo-ember px-3 py-2 text-sm font-medium text-black transition hover:bg-dojo-ember-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={!isRunning && ticks === 0}
          className="rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-crimson hover:text-dojo-crimson focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember disabled:opacity-40 disabled:hover:border-dojo-border disabled:hover:text-dojo-muted"
        >
          Reset
        </button>
      </div>
    </section>
  );
}

function RestRow({ intervalMs }: { intervalMs: number }) {
  const headingId = useId();
  const { isRunning, label, toggle } = useTicker(intervalMs);

  return (
    <section
      aria-labelledby={headingId}
      className="flex items-center justify-between gap-3 rounded-lg border border-dojo-border bg-dojo-bg/40 px-4 py-3"
    >
      <div className="flex min-w-0 flex-col">
        <h3 id={headingId} className="text-xs uppercase tracking-wider text-dojo-muted">
          Rest
        </h3>
        {/*
          Deliberately **not** a live region. The button beside it flips between "Rest" and
          "Stop", and pressing it already announces that change; a `role="status"` here would
          say the same thing a second time. The clock itself is a `timer`, which is a live
          region that stays silent — a value changing once a tick must never be announced.
        */}
        <span className="truncate text-xs text-dojo-muted">
          {isRunning ? "Resting — breathe" : "Ready when you are"}
        </span>
      </div>
      <p
        role="timer"
        aria-label={`Rest clock: ${label}`}
        className="font-mono text-xl tabular-nums text-dojo-ember"
      >
        {label}
      </p>
      <button
        type="button"
        onClick={toggle}
        className="shrink-0 rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember"
      >
        {isRunning ? "Stop" : "Rest"}
      </button>
    </section>
  );
}

export function CustomHooksDemo() {
  const [intervalMs, setIntervalMs] = useState(1000);

  return (
    <>
      <div className="flex w-full max-w-lg flex-col gap-3">
        <div role="group" aria-label="Tick speed" className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-dojo-muted">Speed</span>
          <button
            type="button"
            aria-pressed={intervalMs === 1000}
            aria-label="1× speed — one tick per second"
            onClick={() => setIntervalMs(1000)}
            className={`rounded-lg border px-3 py-1 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember ${
              intervalMs === 1000
                ? "border-dojo-ember text-dojo-ember"
                : "border-dojo-border text-dojo-muted hover:text-dojo-ember"
            }`}
          >
            1×
          </button>
          <button
            type="button"
            aria-pressed={intervalMs === 100}
            aria-label="10× speed — ten ticks per second"
            onClick={() => setIntervalMs(100)}
            className={`rounded-lg border px-3 py-1 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember ${
              intervalMs === 100
                ? "border-dojo-ember text-dojo-ember"
                : "border-dojo-border text-dojo-muted hover:text-dojo-ember"
            }`}
          >
            10×
          </button>
        </div>

        <RoundClock intervalMs={intervalMs} />
        <RestRow intervalMs={intervalMs} />

        <p className="text-xs text-dojo-muted">
          Start the round clock, then press Rest. Which clock moved? Both read the same 1× or 10×
          speed, yet each call to useTicker keeps its own counters.
        </p>
      </div>
      <div className="flex w-full max-w-lg flex-col gap-3 mt-6">
        <StopwatchPanel />
        <SessionTimerRow />

        <p className="text-xs text-dojo-muted">
          Start the stopwatch, then start the session timer. Two clocks, two independent
          states — a single call to <code>useContinuousTimer()</code> in one place is not a
          store. Each caller owns its own elapsed time, laps and running flag.
        </p>
      </div>
    </>
  );
}
