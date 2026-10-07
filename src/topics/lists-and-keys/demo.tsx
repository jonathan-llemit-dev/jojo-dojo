// ─────────────────────────────────────────────
// Topic: Lists & Keys — rendering an array with .map() and a stable key
// Added: 2026-10-04 | Status: OK
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)
//
// The list is keyed by `exercise.id`, not by the array index. An index names a slot,
// so React would reuse "the row in slot 1" across a reorder and the row's own state
// would stay in the slot while the exercise moved away from it. An id identifies the
// exercise, so the state follows it — see the comment at the `.map()`.

import { useState } from "react";

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

/** One row of the checklist. It owns the only state in this lesson. */
function ExerciseRow({ exerciseName }: ExerciseRowProps) {
  const [isDone, setIsDone] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-dojo-border bg-dojo-surface/60 px-4 py-3">
      <span className="font-medium">{exerciseName}</span>
      <button
        onClick={() => setIsDone((done) => !done)}
        className={`rounded-md border px-3 py-1 text-sm transition ${
          isDone
            ? "border-dojo-ember text-dojo-ember"
            : "border-dojo-border text-dojo-muted hover:border-dojo-ember"
        }`}
      >
        {isDone ? "Done" : "Mark done"}
      </button>
    </div>
  );
}

/** Live demo: a checklist that can be reordered. */
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
        {/* `exercise.id`, not the array index. Rotate changes which exercise sits at
            index 0, 1 and 2, so an index key would tell React that "the row in slot
            zero" is the same row as before — and the tick, which lives in the row's own
            useState, would stay in the slot while the exercise moved away from it. An
            id identifies the exercise, so the state follows it. Verified by simulation:
            tick Front kicks, rotate three times, the tick is still on Front kicks. */}
        {exercises.map((exercise) => (
          <ExerciseRow key={exercise.id} exerciseName={exercise.name} />
        ))}
      </div>
    </div>
  );
}
