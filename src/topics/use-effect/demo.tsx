// ─────────────────────────────────────────────
// Topic: useEffect — synchronising with a timer, dependencies and cleanup
// Added: 2026-10-04 | Status: OK
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)
//
// The demo is a training timer. The only effect in the file starts and stops an
// interval, and the cleanup function is the half that makes it correct: without it,
// every change to `isRunning` would leave the previous interval running, and the clock
// would tick twice as fast, then three times as fast.

import { useEffect, useState } from "react";

/**
 * A session timer plus a text area to log what you trained.
 *
 * The two pieces of state are deliberately independent: `seconds` is driven by the
 * interval (an external system), while `draft` is driven by the input. That separation
 * is what keeps the dependency array honest — the effect below depends on `isRunning`
 * and nothing else, so typing never restarts the timer.
 */
export function UseEffectDemo() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    // The effect BODY runs after render, when `isRunning` has changed. It sets up an
    // external system — an interval living outside React — and declares that this
    // subscription depends on `isRunning` alone.
    if (!isRunning) return;

    const id = setInterval(() => {
      // The updater form, so the interval never needs to know the current value.
      // Reading `seconds` directly here would need `seconds` in the dependency array,
      // which would tear down and rebuild the interval every single second.
      setSeconds((current) => current + 1);
    }, 1000);

    // The CLEANUP. React runs it before the next run of this effect, and once more
    // when the component unmounts. Stopping the timer is what this returns.
    return () => clearInterval(id);
  }, [isRunning]);

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  const clock = `${minutes}:${String(remainder).padStart(2, "0")}`;

  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-dojo-border bg-dojo-surface/30 p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm uppercase tracking-wider text-dojo-muted">
          Session
        </span>
        <span className="font-mono text-3xl tabular-nums text-dojo-ember">
          {clock}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setIsRunning((running) => !running)}
          className="rounded-lg bg-dojo-ember px-4 py-2 font-medium text-black transition hover:bg-dojo-ember-bright"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setSeconds(0);
          }}
          className="rounded-lg border border-dojo-border px-4 py-2 transition hover:border-dojo-crimson hover:text-dojo-crimson"
        >
          Reset
        </button>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs text-dojo-muted">
          What did you drill? {draft.length} characters logged.
        </span>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          placeholder="Roundhouse kicks, 3 sets…"
          className="w-full resize-none rounded-md border border-dojo-border bg-dojo-bg/60 px-3 py-2 text-sm text-dojo-text outline-none focus:border-dojo-ember"
        />
      </label>

      <p className="text-xs text-dojo-muted">
        {isRunning
          ? "Timer running — keep going!"
          : seconds > 0
            ? "Paused - Taking a break is fine, but never give up!"
            : "Timer not started."}
      </p>
    </div>
  );
}
