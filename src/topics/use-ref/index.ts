import type { Topic } from "../types";
import { UseRefDemo } from "./demo";

/** Registry entry for the `use-ref` React lesson. */
export const useRefTopic: Topic = {
  slug: "use-ref",
  title: "useRef — DOM Handles & Values That Outlive a Render",
  shortTitle: "useRef",
  belt: "blue",
  description:
    "Keep a mutable value across renders, or hold on to a DOM node — without triggering a re-render when it changes.",
  longDescription:
    "Imagine a search box that should be focused the moment the page opens, so you can just\n" +
    "start typing. The obvious move is to call `focus()` on it during render. That fails: when\n" +
    "your component runs, the input does not exist yet. React has not put it on the page.\n\n" +
    "`useRef` is how you hold on to that input and reach it once it does exist. You give the ref to " +
    "the element, then read it from an effect or an event handler — by then the element is real, and " +
    "you can call `.focus()` on it, scroll to it, or measure it:\n\n" +
    "```\nconst inputRef = useRef<HTMLInputElement>(null);\n\nuseEffect(() => {\n  inputRef.current?.focus();\n}, []);\n\n<input ref={inputRef} />\n```\n\n" +
    "That `null` is doing real work. The element is not there on the very first render, so the read " +
    "needs a guard — `inputRef.current?.focus()` — and TypeScript will not let you skip it, because it " +
    "knows `.current` might be `null`.\n\n" +
    "The ref itself lives on between renders. That is its other use. A plain variable cannot do it: " +
    "every render calls your component again from the top, so the variable is recreated and forgets. " +
    "Store the value in `ref.current` and it is still there next time.\n\n" +
    "Just remember that changing `ref.current` does **not** re-render anything. If you keep a score in " +
    "a ref and show it on screen, you can add a point and watch the screen hold the old number. " +
    "Anything the user can see belongs in `useState`. A ref is for the things the screen never shows: " +
    "the focused input, a timer handle, a count you only read inside a handler.\n\n" +
    "There is a matching rule for reading. Do not read `ref.current` while rendering — not in the " +
    "component body, not in JSX. Read it in an effect or an event handler, where React has finished " +
    "putting the page together. ESLint enforces this one in the project: a ref read during render is " +
    "reported as an error.",
  // Flush against the left margin on purpose: a template literal preserves
  // indentation, so indenting this to match the surrounding code would render as
  // ragged leading whitespace in the "Sample Code" panel.
  //
  // A real mirror of `./demo.tsx` — the two are kept in step.
  codeExample: `import { useEffect, useRef, useState } from "react";
export function UseRefDemo() {
  const [reps, setReps] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLInputElement>(null);
  const tally = useRef({ renders: 0, lastReps: 0 });
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
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
    if (log) log.value = \`\${renders} render(s) so far · reps stood at \${lastReps}\`;
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
}`,
  component: UseRefDemo,
};
