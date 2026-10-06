import type { Topic } from "../types";
import { CounterDemo } from "./demo";

/** Registry entry for the `useState` React lesson. */
export const useStateTopic: Topic = {
  slug: "use-state",
  title: "useState — Stateful Components & Counters",
  shortTitle: "useState",
  // No `as BeltRank` needed here — the `: Topic` annotation above already
  // constrains this to one of the three belt values.
  belt: "white",
  description:
    "Add state to a function component with the useState Hook and build a live counter.",
  longDescription:
    "`useState` is a React Hook that lets you add state to a function component. " +
    "It returns a stateful value and a function to update it. The state persists " +
    "across renders — when the updater function is called, React re-renders the " +
    "component so the UI stays in sync with the latest state.\n\n" +
    "Key rules:\n" +
    "- Call it at the top level of your component (not inside loops, conditions, or nested functions).\n" +
    "- Updates may be asynchronous — React batches them, so rely on the functional updater form " +
    "`setCount(c => c + 1)` when the new state depends on the previous state.\n" +
    "- You can store any primitive or object shape as state; for objects, replace rather than mutate.",
  // A template literal keeps this snippet readable: what you see here is what
  // renders in the "Sample Code" panel, indentation and line breaks included.
  codeExample: `import { useState } from "react";

function CounterDemo() {
  const [count, setCount] = useState(0);

  return (
    <div className="inline-flex items-center gap-6">
      <button onClick={() => setCount((c) => Math.max(0, c - 1))}>−</button>
      <span className="text-4xl font-mono">{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}`,
  component: CounterDemo,
};
