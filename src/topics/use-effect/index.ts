import type { Topic } from "../types";
import { UseEffectDemo } from "./demo";

/** Registry entry for the `use-effect` React lesson. */
export const useEffectTopic: Topic = {
  slug: "use-effect",
  title: "useEffect — Dependencies, Cleanup & When Not To",
  shortTitle: "useEffect",
  belt: "white",
  description:
    "Run code after render to talk to something outside React — with an honest dependency array and a cleanup that undoes it.",
  longDescription:
    "Everything you have written so far happens during render: React calls your component, it\n" +
    "returns elements, React puts them on screen. `useEffect` is for what happens after that —\n" +
    "talking to something outside React.\n\n" +
    "That outside thing is the point of the hook, and it is the fastest way to know when you\n" +
    "need one. Timers, event listeners, network requests, `document.title`, third-party\n" +
    "widgets: none of them are React, so none of them can happen during render, and none of\n" +
    "them update themselves when your state changes. An effect is the bridge.\n\n" +
    "An effect runs after the render it belongs to, never during it. That ordering is why the\n" +
    "demo's clock can be driven by state: the interval calls a setter, React re-renders, the\n" +
    "new time is on screen.\n\n" +
    "The second argument decides when the effect runs, and the rest of the lesson is that one\n" +
    "decision:\n" +
    "- `[]` — run once after the first render. Right for setup that never depends on a value.\n" +
    "- `[isRunning]` — run after the first render, and again whenever `isRunning` changes.\n" +
    "  This is the common case, and the array is a promise: every value the effect reads from\n" +
    "  the component must appear in it.\n" +
    "- no array at all — run after every render. Almost never what you want.\n\n" +
    "`react-hooks/exhaustive-deps` checks that promise for you and names the value you left\n" +
    "out. Take the warning seriously rather than silencing it: a missing dependency is how an\n" +
    "effect ends up reading a stale value forever.\n\n" +
    "Cleanup is the half people skip, and it is the half that bites. An effect may return a\n" +
    "function, which React runs before the next run of that effect and once more when the\n" +
    "component unmounts. Whatever the body started, the cleanup stops:\n\n" +
    "```\nuseEffect(() => {\n  const id = setInterval(() => setSeconds((s) => s + 1), 1000);\n  return () => clearInterval(id);\n}, [isRunning]);\n```\n\n" +
    "Delete that `return` line and nothing breaks immediately — which is exactly the problem.\n" +
    "Each change to `isRunning` leaves the previous interval alive and starts another, so the\n" +
    "clock ticks twice as fast, then three times as fast. A leak is not a thing that shrinks\n" +
    "your app; it is a thing that compounds. The symptom arrives a few interactions after the\n" +
    "mistake, which is why this bug survives so long in real code.\n\n" +
    "Two rules of thumb worth keeping:\n" +
    "- If the effect body reads a prop or a piece of state, name it in the dependencies. If\n" +
    "  that makes the effect re-run too often, the fix is usually the updater form of the\n" +
    "  setter — `setSeconds((s) => s + 1)` — rather than leaving the value out.\n" +
    "- If the effect body starts something, return the thing that stops it. Fetching needs an\n" +
    "  `AbortController`; a listener needs `removeEventListener`; a timer needs `clearInterval`.\n\n" +
    "There is a third rule, and it is the one React's own documentation leads with: you might\n" +
    "not need an effect at all. If you are reaching for `useEffect` to compute a value from\n" +
    "props or state, you almost certainly do not want one — compute it during render instead.\n" +
    "Deriving a value in an effect costs a second render and shows the reader a stale value for\n" +
    "one frame. The demo shows the pattern: the formatted clock is computed in the component\n" +
    "body, not in an effect, because it is a function of state that already exists.\n\n" +
    "Two `useEffect` mistakes are worth knowing by name, because both are easy to write and\n" +
    "hard to spot. Deriving a value with an effect — `useEffect(() => setCount(prop), [prop])` —\n" +
    "costs an extra render and briefly shows a stale value; compute it during render instead.\n" +
    "And a dependency array that lies (`[]` when the effect reads something that changes) leaves\n" +
    "the effect closing over a value frozen at the render it last ran in.",
  // Flush against the left margin on purpose: a template literal preserves
  // indentation, so indenting this to match the surrounding code would render as
  // ragged leading whitespace in the "Sample Code" panel.
  //
  // A real mirror of `./demo.tsx` — the two are kept in step.
  codeExample: `import { useEffect, useState } from "react";

export function UseEffectDemo() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  const clock = \`\${minutes}:\${String(remainder).padStart(2, "0")}\`;

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
}`,
  component: UseEffectDemo,
};
