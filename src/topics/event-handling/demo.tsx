// ─────────────────────────────────────────────
// Topic: Event Handling — inline arrows, named handlers, and passing arguments
// Added: 2026-10-04 | Status: OK
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)
//
// Three handler wirings are shown side by side, all correct, so the shapes can be
// compared in one place:
//
//   1. an INLINE ARROW that closes over the value it needs
//        onClick={() => setReps((r) => r + 1)}
//   2. a NAMED handler, passed BY REFERENCE
//        onClick={handleReset}
//   3. a NAMED handler that takes an ARGUMENT, wrapped in an arrow
//        onClick={() => handleRemove(exercise.id)}
//
// The mistake to avoid — `onClick={handler()}` instead of `onClick={handler}` — never
// reaches the browser here: TypeScript rejects it (`void` is not assignable to
// `MouseEventHandler`) and ESLint's `react-hooks/set-state-in-render` rule rejects it
// too. It is caught while you type, which is the better outcome.

import { useState } from "react";

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

/**
 * One exercise row. It renders what it is handed and owns no state of its own — every
 * change goes back up to the parent through a callback prop. That is `data down,
 * events up` from the components & props lesson, and it is why these props are
 * functions rather than values.
 *
 * The naming is the convention: a prop carrying a callback starts with `on`
 * (`onLogRep`, `onRemove`), and the function it points at is named for what it does
 * (`handleLogRep`, `handleRemoveExercise`).
 */
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

/** Live demo: the three handler shapes, all correct. */
export function EventHandlingDemo() {
  const [exercises, setExercises] = useState<Exercise[]>(EXERCISES);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  /** A named handler that needs no argument, passed by reference below. */
  function handleReset() {
    setExercises(EXERCISES);
    setFocusedId(null);
  }

  /** A named handler that takes an argument — the case that needs an arrow wrapper. */
  function handleRemoveExercise(id: string) {
    setExercises((current) => current.filter((row) => row.id !== id));
    setFocusedId((current) => (current === id ? null : current));
  }

  /** A named handler with an argument, used for a row-level action. */
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
          ? `Focused on ${focusedName} — the argument arrived as a value.`
          : "Nothing focused."}
      </p>
    </div>
  );
}
