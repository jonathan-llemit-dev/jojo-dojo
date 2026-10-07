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
    "Say you want a clock that counts up while you train. You write the interval, you render the\n" +
    "seconds — and nothing appears, because React has no idea your timer exists.\n\n" +
    "That is what `useEffect` is for. Your component's job is to return what should be on\n" +
    "screen; an effect is for everything else you need to do — starting a timer, listening for\n" +
    "an event, fetching data, changing `document.title`. None of those are React, so none of\n" +
    "them can happen while your component is rendering.\n\n" +
    "An effect also runs *after* the render, never during it. That timing is what makes the\n" +
    "clock work: the timer ticks, calls `setSeconds`, React re-renders, and the new number is\n" +
    "on screen.\n\n" +
    "The second argument decides when your effect runs, and it is the part people get wrong:\n" +
    "- `[]` — once, after the first render.\n" +
    "- `[isRunning]` — after the first render, and again whenever `isRunning` changes.\n" +
    "- no array at all — after every single render.\n\n" +
    "When your effect reads something from the component, name it in that array. ESLint's\n" +
    "`react-hooks/exhaustive-deps` rule tells you what you missed. If naming it makes the\n" +
    "effect run too often, reach for the updater form instead — `setSeconds((s) => s + 1)`\n" +
    "needs no dependency on `seconds`.\n\n" +
    "Now the part that bites, and it is the half people skip: cleaning up. An effect can\n" +
    "return a function, and React runs it before the next run of that effect:\n\n" +
    "```\nuseEffect(() => {\n  const id = setInterval(() => setSeconds((s) => s + 1), 1000);\n  return () => clearInterval(id);\n}, [isRunning]);\n```\n\n" +
    "Delete that `return` line and nothing breaks straight away. But each time `isRunning`\n" +
    "changes, the old interval is still running and a new one starts too. Now the clock counts\n" +
    "two seconds per second. Toggle it again and it counts three.\n\n" +
    "That is why this mistake survives so long in real code: nothing looks wrong at first, and\n" +
    "the damage builds up. Whatever your effect starts, return the thing that stops it —\n" +
    "`clearInterval` for a timer, `removeEventListener` for a listener.\n\n" +
    "One last thing, and React's own docs start with it: you often do not need an effect at\n" +
    "all. If you are using one to calculate a value from state or props, do that calculation\n" +
    "while rendering instead. An effect for it costs an extra render and briefly shows a stale\n" +
    "number.",
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
