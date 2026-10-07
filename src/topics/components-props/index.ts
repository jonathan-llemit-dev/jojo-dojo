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
    "Props are how you pass data into a component. You write them in JSX like HTML attributes:\n\n" +
    '```\n<Drill label="Roundhouse kicks" reps={5} />\n```\n\n' +
    "Inside the component they arrive together as one object, which you normally unpack right in the " +
    "parameter list:\n\n" +
    "```\nfunction Drill({ label, reps }: DrillProps) { … }\n```\n\n" +
    "The part that catches people out: a child **cannot** change the props it receives. Try to, and " +
    "your edit is silently thrown away on the next render. Props only ever travel one way — from the " +
    "parent down to the child.\n\n" +
    "So what do you do when a child needs to change something? The parent owns the value in " +
    "`useState`, and hands the child two things: the value, and a function that changes it. The child " +
    "calls that function, the parent's state updates, and the new value comes back down as props.\n\n" +
    "That round trip is the whole idea, and it has a name worth remembering: **data down, events " +
    "up**.\n\n" +
    "Two mistakes are worth avoiding here.\n" +
    "- Do not copy a prop into `useState` to keep it. `useState(prop)` reads that prop once, on the " +
    "first render. After that the copy is frozen while the real value moves on, so the two drift " +
    "apart for good. Use the prop itself.\n" +
    "- Do not make a prop optional unless the component really works without it. `label?: string` " +
    "promises that a drill with no name is fine — so forgetting to pass it gives you a blank heading " +
    "instead of an error. If the component needs it, write `label: string` and let TypeScript find " +
    "the call site you missed.",
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
