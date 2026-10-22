import type { Topic } from "../types";
import { ConditionalDemo } from "./demo";

/** Registry entry for the `conditional-rendering` React lesson. */
export const conditionalRenderingTopic: Topic = {
  slug: "conditional-rendering",
  title: "Conditional Rendering — &&, Ternary & Early Return",
  shortTitle: "Conditional Rendering",
  belt: "white",
  description:
    "Pick between &&, a ternary and an early return — and avoid the falsy-value trap that prints a stray 0.",
  longDescription:
    "You want a badge that says 'Training' when the rep count is above zero, and 'Rest day' otherwise. " +
    "It looks like the markup is making decisions — but showing something only sometimes is not a React " +
    "feature; it's plain JavaScript deciding what to return. JSX has no `if` of its own, so you use an " +
    "expression. Three to choose from; picking the right one is most of the skill:\n\n" +
    '- `condition && <Thing />` — show Thing, or show nothing. Reach for this when there is no "else".\n' +
    "- `condition ? <A /> : <B />` — show A or B. Reach for this when both outcomes are real, because a " +
    "ternary cannot leave a gap.\n" +
    "- `if (!data) return <Empty />` early in the component — when the whole component differs, not just " +
    "one line of it.\n\n" +
    "The `&&` trap catches everyone. It does not turn the left side into `true` or `false` " +
    "— it returns that value itself when it is falsy, and React happily renders numbers. So this prints " +
    "a stray `0` on the page whenever `reps` is zero:\n\n" +
    "```\n{reps && <p>You have logged {reps} reps.</p>}\n```\n\n" +
    "Compare instead, because `reps > 0` really is a boolean:\n\n" +
    "```\n{reps > 0 && <p>You have logged {reps} reps.</p>}\n```\n\n" +
    "React draws nothing for `false`, `null`, `undefined`, `true`, and `''`. Everything else reaches the " +
    "screen — including `0`, non-empty strings, and `NaN`, which renders as the literal text 'NaN' (and " +
    "warns in development).\n\n" +
    "The second trap is writing two separate `&&`s where you meant one either/or. Nothing ties the two " +
    "conditions together, so they can overlap and show both things, or leave a gap and show neither. If " +
    "one of two states must always be visible, that is a ternary.",
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
  const inRange = reps >= 10 && reps <= 20;
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
      {inRange && (
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
