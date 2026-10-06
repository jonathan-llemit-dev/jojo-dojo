import type { Topic } from "../types";
import { PropsDemo } from "./demo";

/** Registry entry for the `components-props` React lesson. */
export const componentsPropsTopic: Topic = {
  slug: "components-props",
  title: "Components & Props — Data Down, Events Up",
  shortTitle: "Components & Props",
  belt: "white",
  description:
    "Pass data into a component with props, and learn why props are read-only snapshots you must never copy into state.",
  longDescription:
    "Props are the arguments you hand to a component, written in JSX like HTML attributes:\n\n" +
    '```\n<Drill label="Roundhouse kicks" reps={5} />\n```\n\n' +
    "Inside the component they arrive as one object, which you normally destructure right in the " +
    "parameter list:\n\n" +
    "```\nfunction Drill({ label, reps }: DrillProps) { … }\n```\n\n" +
    "Props flow in ONE direction — down, from parent to child. A child cannot change the props it " +
    "receives, because they are a fresh snapshot handed to it on every render; only the parent can " +
    "pass something different. So when a child needs to change a value, the parent owns that value in " +
    "`useState` and passes down BOTH the value and a function to change it. The child calls the " +
    "function, the parent's state updates, and the new value flows back down as props. That is the " +
    "entire loop: data down, events up.\n\n" +
    "Two rules worth burning in:\n" +
    '- Never copy a prop into `useState` to "keep" it. `useState(prop)` reads that prop only on the ' +
    "FIRST render; from then on the copy is frozen while the real value moves on, and the two drift " +
    "apart forever. Use the prop directly.\n" +
    "- An optional prop (`label?: string`) is a promise that the component still works without it. " +
    "If the component renders it blindly, forgetting to pass it produces a silently blank heading " +
    "instead of an error. When a component cannot work without a prop, make it required — as " +
    "`label: string` is in the sample below — so TypeScript catches the omission for you.",
  // The snippet below is deliberately flush against the left margin, which looks
  // wrong in this file but is correct on screen: a template literal preserves
  // whatever indentation you type, so indenting it here would render as ragged
  // leading whitespace in the "Sample Code" panel.
  //
  // This is a live mirror of `./demo.tsx` — keep the two in step.
  codeExample: `import { useState } from "react";

type DrillProps = {
  label: string;
  reps: number;
};

function Drill({ label, reps }: DrillProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-dojo-border bg-dojo-surface/60 px-4 py-3">
      <span className="font-medium">{label}</span>
      <span className="font-mono text-2xl tabular-nums text-dojo-ember">
        {reps}
      </span>
    </div>
  );
}

export function PropsDemo() {
  const [reps, setReps] = useState(0);

  return (
    <div className="w-full max-w-md rounded-xl border border-dojo-border bg-dojo-surface/30 p-6">
      <p className="text-xs uppercase tracking-wider text-dojo-muted">
        Session total
      </p>
      <p className="mt-1 font-mono text-4xl tabular-nums text-dojo-ember">
        {reps}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => setReps((r) => r + 1)}
          className="rounded-lg bg-dojo-ember px-4 py-2 font-medium text-black transition hover:bg-dojo-ember-bright"
        >
          Add a rep
        </button>
        <button
          onClick={() => setReps(0)}
          className="rounded-lg border border-dojo-border px-4 py-2 transition hover:border-dojo-crimson hover:text-dojo-crimson"
        >
          Reset
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Drill label="Roundhouse kicks" reps={reps} />
        <Drill label="Front kicks" reps={reps} />
      </div>
    </div>
  );
}`,
  component: PropsDemo,
};
