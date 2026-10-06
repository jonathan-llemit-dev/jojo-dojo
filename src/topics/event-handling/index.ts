import type { Topic } from "../types";
import { EventHandlingDemo } from "./demo";

/** Registry entry for the `event-handling` React lesson. */
export const eventHandlingTopic: Topic = {
  slug: "event-handling",
  title: "Event Handling — Handler References & Arguments",
  shortTitle: "Event Handling",
  belt: "white",
  description:
    "Name your handlers, pass them by reference, and wrap them in an arrow when they need an argument.",
  longDescription:
    "A handler is just a function you give React to call later. There are two ways to write\n" +
    "one, and both are correct:\n\n" +
    "```\n// inline arrow — can read the surrounding values directly\n<button onClick={() => setReps((r) => r + 1)}>Log a rep</button>\n\n" +
    "// named function — passed by reference\nfunction handleReset() {\n  setExercises(EXERCISES);\n}\n<button onClick={handleReset}>Reset</button>\n```\n\n" +
    "The inline arrow is shorter and closes over whatever is in scope. A named function is\n" +
    "reusable, easier to read once the body grows past one line, and the only form you can\n" +
    "hand down as a prop. Choose per case — but the convention in this repo is worth\n" +
    "keeping: a prop that carries a callback is named `onSomething` (`onLogRep`), and the\n" +
    "function it points at is named for what it does (`handleRemoveExercise`).\n\n" +
    "What matters is the difference between the next two lines. One gives React a function;\n" +
    "the other calls a function while the component is still rendering:\n\n" +
    "```\n<button onClick={handleReset}>   {/* a reference — React calls it on click */}\n<button onClick={handleReset()}> {/* CALLED now, during render */}\n```\n\n" +
    "In this project that mistake never reaches the browser. TypeScript refuses it, because\n" +
    "`handleReset` returns `void` and `onClick` wants a function:\n\n" +
    "```\nType 'void' is not assignable to type 'MouseEventHandler<HTMLButtonElement> | undefined'.\n```\n\n" +
    "and ESLint's `react-hooks/set-state-in-render` rule flags the same line, because a\n" +
    "handler that sets state would otherwise run during every render. That is why this topic\n" +
    "has no fix-it exercise: the convention for one requires the planted bug to compile and\n" +
    "lint clean, and this bug cannot. It is caught as you type, which is better.\n\n" +
    "The case that catches people is a handler that needs an argument. The fix is not fewer\n" +
    "parentheses; it is one more layer — an arrow that is itself the handler:\n\n" +
    "```\n<button onClick={() => handleRemoveExercise(exercise.id)}>Remove</button>\n```\n\n" +
    "Now `onClick` receives a function, and the id is supplied when React eventually calls\n" +
    "it. The rule covering both cases: what you put in `onClick` must be a function, not the\n" +
    "result of calling one. The way to check is to ask whether that expression would do\n" +
    "anything if the component never re-rendered.\n\n" +
    "The Live Demo below shows all three wirings in one component: an inline arrow that\n" +
    "closes over a row's id, a named handler passed by reference (`Reset`), and a named\n" +
    "handler taking an argument through an arrow (`Remove` and `Focus`).",
  // Flush against the left margin on purpose: a template literal preserves
  // indentation, so indenting this to match the surrounding code would render as
  // ragged leading whitespace in the "Sample Code" panel.
  //
  // A real mirror of `./demo.tsx`. Event handling is NOT a fix-it exercise — see the
  // reasoning in the module comment of `demo.tsx` — so the two are kept in step.
  codeExample: `import { useState } from "react";

type Exercise = {
  id: string;
  name: string;
  reps: number;
};

const EXERCISES: Exercise[] = [
  { id: "k1", name: "Roundhouse kicks", reps: 0 },
  { id: "k2", name: "Front kicks", reps: 0 },
  { id: "k3", name: "Knee strikes", reps: 0 },
];

type ExerciseRowProps = {
  name: string;
  reps: number;
  onLogRep: () => void;
  onRemove: () => void;
};

function ExerciseRow({ name, reps, onLogRep, onRemove }: ExerciseRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-dojo-border bg-dojo-surface/60 px-4 py-3">
      <span className="font-medium">{name}</span>
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm tabular-nums text-dojo-ember">
          {reps} reps
        </span>
        <button
          onClick={onLogRep}
          className="rounded-md border border-dojo-border px-3 py-1 text-sm text-dojo-muted transition hover:border-dojo-ember hover:text-dojo-ember"
        >
          Log a rep
        </button>
        <button
          onClick={onRemove}
          className="rounded-md border border-dojo-border px-3 py-1 text-sm text-dojo-muted transition hover:border-dojo-crimson hover:text-dojo-crimson"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export function EventHandlingDemo() {
  const [exercises, setExercises] = useState<Exercise[]>(EXERCISES);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  function handleReset() {
    setExercises(EXERCISES);
    setFocusedId(null);
  }

  function handleRemoveExercise(id: string) {
    setExercises((current) => current.filter((row) => row.id !== id));
    setFocusedId((current) => (current === id ? null : current));
  }

  function handleFocus(id: string) {
    setFocusedId((current) => (current === id ? null : id));
  }

  const totalReps = exercises.reduce((sum, exercise) => sum + exercise.reps, 0);
  const focusedName = exercises.find((row) => row.id === focusedId)?.name;

  return (
    <div className="flex w-full max-w-lg flex-col gap-4 rounded-xl border border-dojo-border bg-dojo-surface/30 p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-dojo-ember">
        Training log
      </h3>

      <div className="flex flex-col gap-3">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="flex flex-col gap-2">
            <ExerciseRow
              name={exercise.name}
              reps={exercise.reps}
              onLogRep={() =>
                setExercises((current) =>
                  current.map((row) =>
                    row.id === exercise.id ? { ...row, reps: row.reps + 1 } : row,
                  ),
                )
              }
              onRemove={() => handleRemoveExercise(exercise.id)}
            />
            <button
              onClick={() => handleFocus(exercise.id)}
              className="self-start px-1 text-xs text-dojo-muted transition hover:text-dojo-ember"
            >
              {focusedId === exercise.id ? "Unfocus" : "Focus"} {exercise.name}
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dojo-border pt-4">
        <button
          onClick={handleReset}
          className="rounded-lg border border-dojo-border px-4 py-2 transition hover:border-dojo-crimson hover:text-dojo-crimson"
        >
          Reset
        </button>
        <span className="font-mono text-xs tabular-nums text-dojo-muted">
          session total: {totalReps} reps
        </span>
      </div>

      <p className="text-xs text-dojo-muted">
        {focusedName
          ? \`Focused on \${focusedName} — the argument arrived as a value.\`
          : "Nothing focused."}
      </p>
    </div>
  );
}`,
  component: EventHandlingDemo,
};
