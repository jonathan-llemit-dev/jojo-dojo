import type { Topic } from "../types";
import { ListsKeysDemo } from "./demo";

/** Registry entry for the `lists-and-keys` React lesson. */
export const listsKeysTopic: Topic = {
  slug: "lists-and-keys",
  title: "Lists & Keys — Rendering Arrays with map()",
  belt: "white",
  description:
    "Render an array with map() and give every row a key that is stable and unique — never the array index.",
  longDescription:
    "A list in React is an array of elements, and `map()` is what turns your data into them:\n\n" +
    "```\n{exercises.map((exercise) => (\n  <ExerciseRow key={exercise.id} exerciseName={exercise.name} />\n))}\n```\n\n" +
    "That `key` is not a CSS id, a DOM attribute, or anything the user ever sees. It is the answer to " +
    "one question React asks on every re-render: which element in the new list is the same thing as " +
    "which element in the old one?\n\n" +
    "The answer matters because React reuses rows between renders, and a reused row keeps its own " +
    "state — a `useState` inside it, the text in an uncontrolled input. So the key decides which state " +
    "belongs to which row. Get it wrong and the state stays where it was while the data moves past it.\n\n" +
    "A key has to be both of these:\n" +
    "- Stable — the same item keeps the same key across renders. `key={index}` fails this as soon as " +
    "the list is sorted, rotated or filtered: index 1 is a different item afterwards, so React hands " +
    "row 1's state to whichever item is now sitting there.\n" +
    "- Unique among siblings — two rows with the same key are indistinguishable to React. A name looks " +
    "unique, but real data repeats it, and React warns in the console rather than guessing.\n\n" +
    "So the safe default is an id that comes from the data itself, like `exercise.id`. `key={index}` is " +
    "only acceptable for a list that never changes order and never gains or loses a row.\n\n" +
    "This lesson shipped as a fix-it exercise and has now been fixed: the list is keyed by the " +
    "exercise's own id, so each row's state follows the exercise rather than the slot it sits in. " +
    "The Live Demo and the code below are the same component.",
  // Flush against the left margin on purpose: a template literal preserves
  // indentation, so indenting this to match the surrounding code would render as
  // ragged leading whitespace in the "Sample Code" panel.
  //
  // This is a real mirror of `./demo.tsx` (comments and blank-line-for-blank-line
  // aside) — it was written as the fix-it exception and became the mirror once the
  // exercise was fixed. Keep the two in step.
  codeExample: `import { useState } from "react";

type Exercise = {
  id: string;
  name: string;
};

const EXERCISES: Exercise[] = [
  { id: "k1", name: "Roundhouse kicks" },
  { id: "k2", name: "Front kicks" },
  { id: "k3", name: "Knee strikes" },
];

type ExerciseRowProps = {
  exerciseName: string;
};

function ExerciseRow({ exerciseName }: ExerciseRowProps) {
  const [isDone, setIsDone] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-dojo-border bg-dojo-surface/60 px-4 py-3">
      <span className="font-medium">{exerciseName}</span>
      <button
        onClick={() => setIsDone((done) => !done)}
        className={\`rounded-md border px-3 py-1 text-sm transition \${
          isDone
            ? "border-dojo-ember text-dojo-ember"
            : "border-dojo-border text-dojo-muted hover:border-dojo-ember"
        }\`}
      >
        {isDone ? "Done" : "Mark done"}
      </button>
    </div>
  );
}

export function ListsKeysDemo() {
  const [exercises, setExercises] = useState<Exercise[]>(EXERCISES);

  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-dojo-border bg-dojo-surface/30 p-6">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() =>
            setExercises((current) => [...current.slice(1), current[0]])
          }
          className="rounded-lg bg-dojo-ember px-4 py-2 font-medium text-black transition hover:bg-dojo-ember-bright"
        >
          Rotate
        </button>
        <button
          onClick={() => setExercises(EXERCISES)}
          className="rounded-lg border border-dojo-border px-4 py-2 transition hover:border-dojo-crimson hover:text-dojo-crimson"
        >
          Reset
        </button>
      </div>

      <p className="text-xs text-dojo-muted">
        Order: {exercises.map((exercise) => exercise.name).join(" → ")}
      </p>

      <div className="flex flex-col gap-3">
        {exercises.map((exercise) => (
          <ExerciseRow key={exercise.id} exerciseName={exercise.name} />
        ))}
      </div>
    </div>
  );
}`,
  component: ListsKeysDemo,
};
