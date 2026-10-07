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
    "Give a component memory with useState, so a value it shows can actually change when the user clicks.",
  longDescription:
    "Try to keep a score in a plain variable and you will watch it fail:\n\n" +
    "```\nlet count = 0;\n\nfunction logRep() {\n  count = count + 1;\n}\n```\n\n" +
    "That really does update the variable. What it cannot do is update the screen. Changing a " +
    "variable tells React nothing, so the page keeps showing the number it rendered the first time. " +
    "On top of that, the variable is rebuilt at `0` every time your component runs again.\n\n" +
    "`useState` is the fix. It hands you two things: the current value, and a function that changes " +
    "it.\n\n" +
    "```\nconst [count, setCount] = useState(0);\n```\n\n" +
    "Call the setter and React re-renders your component with the new value, so the number on screen " +
    "catches up. That is the whole loop, and it is the idea behind every interactive thing you will " +
    "build.\n\n" +
    "A few rules keep it working:\n" +
    "- Call `useState` at the top level of the component. Not inside a loop, a condition or a nested " +
    "function — React tracks the hooks by the order they run in.\n" +
    "- When the new value depends on the old one, use the updater form: `setCount((c) => c + 1)`. " +
    "Handing it a value like `count + 1` uses the `count` from this render, which is exactly what " +
    "causes off-by-one bugs.\n" +
    "- State can hold anything, but never edit what is already there. To change one field of an object, " +
    "build a new object: `setStudent((s) => ({ ...s, belt: \"blue\" }))`.",
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
