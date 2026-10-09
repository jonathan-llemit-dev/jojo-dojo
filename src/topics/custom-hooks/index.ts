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
    "A round clock and a rest row need the same three hooks: a count, a running flag, and one effect that ticks " +
    "the count and stops itself on cleanup. Written twice, that is the same block of code in two components, " +
    "and a fix to one is a fix you have to remember to make in the other.\n\n" +
    "Before this: `useState`, and the cleanup half of `useEffect`. Nothing else is assumed — `useId` appears " +
    "below only to label each panel.\n\n" +
    "```tsx\n// the same six lines, in RoundClock and again in RestRow\nconst [ticks, setTicks] = useState(0);\nconst [isRunning, setIsRunning] = useState(false);\nuseEffect(() => {\n  if (!isRunning) return;\n  const id = window.setInterval(() => setTicks((c) => c + 1), intervalMs);\n  return () => window.clearInterval(id);\n}, [isRunning, intervalMs]);\n```\n\n" +
    "A custom hook is how you write that once. It is not a React feature you import — it is an ordinary " +
    "function whose name starts with `use` and which calls other hooks:\n\n" +
    "```tsx\nfunction useTicker(intervalMs: number): UseTickerResult {\n  const [ticks, setTicks] = useState(0);\n  const [isRunning, setIsRunning] = useState(false);\n\n  useEffect(() => {\n    if (!isRunning) return;\n    const id = window.setInterval(() => setTicks((c) => c + 1), intervalMs);\n    return () => window.clearInterval(id);\n  }, [isRunning, intervalMs]);\n\n  const minutes = Math.floor(ticks / 60);\n  const remainder = ticks % 60;\n\n  return {\n    ticks,\n    isRunning,\n    label: `${minutes}:${String(remainder).padStart(2, \"0\")}`,\n    toggle: () => setIsRunning((running) => !running),\n    reset: () => {\n      setIsRunning(false);\n      setTicks(0);\n    },\n  };\n}\n\n// then, in either component, with no props passed between them:\nconst { label, isRunning, toggle } = useTicker(intervalMs);\n```\n\n" +
    "Arguments in, return value out — that is the whole interface: `useTicker(intervalMs)` takes the tick " +
    "length and returns `{ ticks, isRunning, label, toggle, reset }`. The same keys come back on every render, " +
    "whatever the state, because a field that appears only sometimes is a trap for whoever destructures it.\n\n" +
    "The object and both of its functions are new on every render. That costs nothing while nothing is " +
    "memoised — but hand one to a `React.memo` child, or list it in an effect's dependencies, and the new " +
    "identity becomes real work. That is where `useCallback` starts to earn its keep.\n\n" +
    "You may reach for a shared component instead, and the two panels are shaped too differently for one. The " +
    "round clock is a card with a big readout and two buttons; the rest row is a line with one button. A " +
    "component serving both would need a prop for every difference. A hook shares the behaviour and leaves " +
    "the markup to whoever calls it.\n\n" +
    "A hook is not a store. Each call gets its own state, so the round clock and the rest row keep separate " +
    "counts even though one function produces both.\n\n" +
    "To share state you lift it to a common parent. Context then delivers it down the tree, but `useContext` " +
    "only *reads* it — the state itself still lives in a `useState` or `useReducer` somewhere above. An " +
    "external store is the third option. A hook shares the code, not the data.\n\n" +
    "The effect depends on `isRunning` and `intervalMs` and nothing else. The tick uses the updater form — " +
    "`setTicks((current) => current + 1)` — so the count never enters the dependency array.\n\n" +
    "Read `ticks` directly instead and the interval is rebuilt on every tick, with a stale number frozen in " +
    "its closure. And `if (!isRunning) return;` sits inside the effect: that is an early return from a " +
    "callback, not a conditional hook call.\n\n" +
    "The `use` prefix is not decoration: ESLint's `rules-of-hooks` reads the name to decide whether hooks may " +
    "be called in a function at all. Rename `useTicker` to `ticker` and it prints this, once for each hook " +
    "inside:\n\n" +
    "```\nReact Hook \"useState\" is called in function \"ticker\" that is neither a React function component nor a custom React Hook function. React component names must start with an uppercase letter. React Hook names must start with the word \"use\".   react-hooks/rules-of-hooks\n```\n\n" +
    "The same rule has a second half, and it covers every hook, not only yours: call them at the top level of " +
    "a component or another hook — never inside an `if`, a loop or a callback. Wrap `useTicker` in a condition " +
    "and it fails even though the name is right.\n\n" +
    "React itself never checks the name at runtime — the prefix and the placement are conventions enforced by " +
    "tooling.\n\n" +
    "If you have this code in an editor, three edits teach more than reading. Remove `intervalMs` from the " +
    "dependency array and change speed while the clock runs. Swap the updater form for `setTicks(ticks + 1)` " +
    "and do what the linter asks next. Call the hook inside an `if` and watch the linter refuse.\n\n" +
    "Testing a hook does not need a component around it: `renderHook` from `@testing-library/react` mounts a " +
    "throwaway one and exposes the return value on `result.current`.\n\n" +
    "Extraction earns its keep when a sequence repeats: duplication is the strongest signal, because two " +
    "copies have to be changed together. A hook called in one place can still be right when it names a " +
    "concept the component would otherwise spell out, or hides an effect behind a verb. The test is whether " +
    "the callers would change together, not how many there are.\n\n" +
    "**Simplification:** this demo counts whole ticks, so pausing halfway through one discards it — toggle " +
    "faster than the interval and the count never moves. A real stopwatch records `Date.now()` on start and " +
    "derives elapsed time from timestamps, which is what keeps partial ticks. Counting ticks keeps the " +
    "lesson on the extraction.",
  // Flush against the left margin on purpose: a template literal preserves
  // indentation, so indenting this to match the surrounding code would render as
  // ragged leading whitespace in the "Sample Code" panel.
  //
  // A real mirror of `./demo.tsx` — the two are kept in step. Regenerate with
  // `npm run sync:samples` rather than editing by hand; `npm run check:repo`
  // fails if they drift.
  codeExample: `import { useEffect, useId, useState } from "react";
export type UseTickerResult = {
  ticks: number;
  isRunning: boolean;
  label: string;
  toggle: () => void;
  reset: () => void;
};
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
  return {
    ticks,
    isRunning,
    label: \`\${minutes}:\${String(remainder).padStart(2, "0")}\`,
    toggle: () => setIsRunning((running) => !running),
    reset: () => {
      setIsRunning(false);
      setTicks(0);
    },
  };
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
        aria-label={\`Round clock: \${label}\`}
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
        <span className="truncate text-xs text-dojo-muted">
          {isRunning ? "Resting — breathe" : "Ready when you are"}
        </span>
      </div>
      <p
        role="timer"
        aria-label={\`Rest clock: \${label}\`}
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
    <div className="flex w-full max-w-lg flex-col gap-3">
      <div role="group" aria-label="Tick speed" className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-dojo-muted">Speed</span>
        <button
          type="button"
          aria-pressed={intervalMs === 1000}
          aria-label="1× speed — one tick per second"
          onClick={() => setIntervalMs(1000)}
          className={\`rounded-lg border px-3 py-1 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember \${
            intervalMs === 1000
              ? "border-dojo-ember text-dojo-ember"
              : "border-dojo-border text-dojo-muted hover:text-dojo-ember"
          }\`}
        >
          1×
        </button>
        <button
          type="button"
          aria-pressed={intervalMs === 100}
          aria-label="10× speed — ten ticks per second"
          onClick={() => setIntervalMs(100)}
          className={\`rounded-lg border px-3 py-1 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember \${
            intervalMs === 100
              ? "border-dojo-ember text-dojo-ember"
              : "border-dojo-border text-dojo-muted hover:text-dojo-ember"
          }\`}
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
  );
}`,
  component: CustomHooksDemo,
};
