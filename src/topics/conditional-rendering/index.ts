import type { Topic } from "../types";
import { ConditionalDemo } from "./demo";

/** Registry entry for the `conditional-rendering` React lesson. */
export const conditionalRenderingTopic: Topic = {
  slug: "conditional-rendering",
  title: "Conditional Rendering — &&, Ternary & Early Return",
  belt: "white",
  description:
    "Pick between &&, a ternary and an early return — and avoid the falsy-value trap that prints a stray 0.",
  longDescription:
    "Conditional rendering is not a React feature; it is plain JavaScript deciding what to return. JSX has " +
    "no if statement of its own, so you use an expression. There are three tools, and choosing the right one " +
    "is most of the skill:\n\n" +
    '- `condition && <Thing />` — show Thing, or show nothing. Reach for this when there is no "else".\n' +
    "- `condition ? <A /> : <B />` — show A or B. Reach for this whenever BOTH outcomes are real, because a " +
    "ternary cannot leave a gap.\n" +
    "- `if (!data) return <Empty />` early in the component — when the whole component differs, not just one " +
    "line of it.\n\n" +
    "The trap that catches everyone: `&&` does not coerce to a boolean. It returns the LEFT operand when that " +
    "operand is falsy, and React renders numbers. So `{reps && <p>…</p>}` prints a bare `0` on the page when " +
    "reps is 0. A comparison fixes it — `{reps > 0 && …}` — because `reps > 0` really is `true` or `false`. " +
    "React renders nothing for `false`, `null`, `undefined` and `true`; everything else, `0` and `NaN` " +
    "included, ends up on screen.\n\n" +
    "The second trap is using two separate `&&`s where you meant one either/or. Independent guards can " +
    "overlap (both appear) or leave a gap (neither appears), because nothing ties them together. If there " +
    "are two possible states and one of them must always be visible, that is a ternary.",
  // Flush against the left margin on purpose: a template literal preserves
  // indentation, so indenting this to match the surrounding code would render as
  // ragged leading whitespace in the "Sample Code" panel.
  //
  // This is a live mirror of `./demo.tsx` (comments and blank-line-for-blank-line
  // aside). The demo contains its own template literal, so its backticks and its
  // `${` are escaped here — a bare backtick would end this string early. Keep the
  // two in step, and re-run the diff in the reviewer notes rather than eyeballing it.
  codeExample: `import { useState } from "react";

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-dojo-muted">{label}</span>
      <span className="font-mono tabular-nums text-dojo-ember">{value}</span>
    </div>
  );
}

export function ConditionalDemo() {
  const [reps, setReps] = useState(0);
  const isTraining = reps > 0;

  return (
    <div className="w-full max-w-md rounded-xl border border-dojo-border bg-dojo-surface/30 p-6">
      <h2 className="text-lg font-semibold text-dojo-ember">Session summary</h2>

      <div className="mt-3 flex h-6 items-center gap-2">
        {isTraining ? (
          <span className="inline-flex items-center rounded-full border border-dojo-ember px-3 py-0.5 text-xs text-dojo-ember">
            Training
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full border border-dojo-border px-3 py-0.5 text-xs text-dojo-muted">
            Rest day
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <SummaryRow label="Reps logged" value={String(reps)} />
        {isTraining && (
          <SummaryRow label="Nice work" value={\`\${reps} reps in the bank\`} />
        )}
      </div>

      {reps >= 10 && reps <= 20 && (
        <p className="mt-4 text-sm text-dojo-ember">
          🥋 Milestone: 10 reps reached.
        </p>
      )}

      {reps > 20 && (
        <p className="mt-4 text-sm text-dojo-ember">
          😵 You may get overfatigued.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => setReps((r) => r + 1)}
          className="rounded-lg bg-dojo-ember px-4 py-2 font-medium text-black transition hover:bg-dojo-ember-bright"
        >
          Log a rep
        </button>
        <button
          onClick={() => setReps(0)}
          className="rounded-lg border border-dojo-border px-4 py-2 transition hover:border-dojo-crimson hover:text-dojo-crimson"
        >
          Reset
        </button>
      </div>
    </div>
  );
}`,
  component: ConditionalDemo,
};
