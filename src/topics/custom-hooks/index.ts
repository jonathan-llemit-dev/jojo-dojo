import type { Topic } from "../types";
import { CustomHooksDemo } from "./demo";

/** Registry entry for the `custom-hooks` React lesson. */
export const customHooksTopic: Topic = {
  slug: "custom-hooks",
  title: "Custom Hooks — Extracting a Repeated Hook Sequence",
  shortTitle: "Custom Hooks",
  belt: "white",
  description:
    "Write a repeated hook sequence once, give it a name starting with use, and call it wherever it is needed — without sharing its state.",
  longDescription:
    "A round timer and a rest timer need the same four things: a count, a running flag, an interval that ticks " +
    "the count, and a cleanup that stops the interval. Written out twice, that is the same block of code in two " +
    "components, and a fix to one is a fix you have to remember to make in the other.\n\n" +
    "A custom hook is how you write that sequence once. It is not a React feature you import — it is an " +
    "ordinary function whose name starts with `use` and which calls other hooks. `useStopwatch` holds two " +
    "`useState` calls and one `useEffect`, and hands back only what a clock needs.\n\n" +
    "```\n// twice, in two components\nconst [seconds, setSeconds] = useState(0);\nconst [isRunning, setIsRunning] = useState(false);\nuseEffect(() => {\n  if (!isRunning) return;\n  const id = window.setInterval(() => setSeconds((c) => c + 1), 1000);\n  return () => window.clearInterval(id);\n}, [isRunning]);\n\n// once, in a function of your own\nfunction useStopwatch() {\n  // …the same three hooks, written once\n}\n```\n\n" +
    "The `use` prefix is not decoration. ESLint's `rules-of-hooks` decides whether hooks may be called inside a " +
    "function by reading its name: rename `useStopwatch` to `stopwatch` and it reports `React Hook \"useState\" is " +
    "called in function \"stopwatch\" that is neither a React function component nor a custom React Hook " +
    "function.`\n\n" +
    "A hook is not a store. Every call gets its own state, so the round clock and the rest row below keep " +
    "separate times even though one function produces both. Sharing state between components is `useContext`'s " +
    "job: a hook shares the code, not the data.\n\n" +
    "Callers see the return value and nothing else. The rest row takes the three things it needs and ignores " +
    "the reset, and neither component can tell that two pieces of state and an effect are hiding inside — which " +
    "is what lets the hook be rewritten without touching a call site. That is the bargain a component already " +
    "makes with its props, one level down.\n\n" +
    "Extract when a sequence actually repeats. A hook written before the second copy exists is an indirection " +
    "you pay for and never collect on. The second copy is the signal, and the test is whether the two callers " +
    "would have to change together.",
  // Flush against the left margin on purpose: a template literal preserves
  // indentation, so indenting this to match the surrounding code would render as
  // ragged leading whitespace in the "Sample Code" panel.
  //
  // A real mirror of `./demo.tsx` — the two are kept in step. Regenerated from the
  // demo mechanically (comments and blank lines stripped) rather than retyped.
  codeExample: `import { useEffect, useState } from "react";
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
    label: \`\${minutes}:\${String(remainder).padStart(2, "0")}\`,
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
}`,
  component: CustomHooksDemo,
};
