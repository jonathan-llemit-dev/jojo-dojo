// ─────────────────────────────────────────────
// Topic: useState Deep Dive — object & array state, replace instead of mutate
// Added: 2026-10-07 | Status: OK (verified)
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)
//
// React compares the value you hand a setter with the one it already has — by
// reference. Hand back the same array or the same object and React sees no change,
// skips the re-render, and the screen keeps showing the previous render's data. So
// every update has to *replace* the value with a new one:
//   - arrays:  `[...current, item]` to add, `current.slice().sort(...)` to sort
//   - objects: `{ ...current, field: next }`
// `push`, `sort` and `splice` change the array you already have, so none of them is an
// update. `sort` in particular returns *the same array*, not a new one — which is why
// it needs `.slice()` first.
//
// The other shape this file shows: React batches a handler's updates, so every line
// reads the state from the render it came from. `setReps(reps + 1)` twice therefore
// computes the same number twice and the count rises by one. The updater form hands
// React a function instead of a value, so React queues the functions and feeds each the
// previous result — and two calls really do add two.

import { useState } from "react";

type Technique = {
  id: number;
  name: string;
  done: boolean;
};

type Student = {
  name: string;
  belt: "white" | "blue" | "black";
};

const STARTING_TECHNIQUES: Technique[] = [
  { id: 1, name: "Roundhouse kick", done: false },
  { id: 2, name: "Front kick", done: false },
];

/** One row of the technique list. `done` is the row's own state. */
function TechniqueRow({ name }: { name: string }) {
  const [isDone, setIsDone] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-dojo-border bg-dojo-surface/60 px-3 py-2">
      <span className="text-sm">{name}</span>
      <button
        onClick={() => setIsDone((done) => !done)}
        className={`rounded-md border px-2 py-1 text-xs transition ${
          isDone
            ? "border-dojo-ember text-dojo-ember"
            : "border-dojo-border text-dojo-muted hover:border-dojo-ember"
        }`}
      >
        {isDone ? "Drilled" : "Mark drilled"}
      </button>
    </div>
  );
}

/** Live demo: a training card whose techniques, drafts and rep count are all state. */
export function UseStateDeepDiveDemo() {
  const [student] = useState<Student>({ name: "Jojo", belt: "white" });
  const [techniques, setTechniques] = useState<Technique[]>(STARTING_TECHNIQUES);
  const [draftTechnique, setDraftTechnique] = useState("");
  const [reps, setReps] = useState(0);

  /**
   * The updater form, twice. This is the whole fix: `setReps(reps + 1)` computes its
   * argument during the handler, so both lines read the same `reps` and compute the
   * same number. A function is queued instead, and React feeds each one the previous
   * result — so the second call receives 1 and returns 2.
   */
  const handleLogTwoReps = () => {
    setReps((reps) => reps + 1);
    setReps((reps) => reps + 1);
  };

  /**
   * A NEW array, built from the old one. The shape could not be simpler: `push` changes
   * the array state is already holding and returns its new length, so the setter would
   * be handed an identical reference and React would bail out.
   */
  const handleAddTechnique = () => {
    if (draftTechnique.trim() === "") return;

    const newTechnique = {
      id: techniques.length + 1,
      name: draftTechnique.trim(),
      done: false,
    };
    setTechniques((techniques) => [...techniques, newTechnique]);
    setDraftTechnique("");
  };

  /**
   * `.slice()` first, because `sort` mutates in place AND returns the same array — so
   * sorting state directly would hand the setter back the reference React already has.
   * Slice makes a copy, the copy is sorted, and the setter receives something new.
   */
  const handleSort = () => {
    const list = techniques.slice().sort((first, second) => first.name.localeCompare(second.name));
    setTechniques(list);
  };

  /** A fresh array from the seed, so reset works even when the order differs. */
  const handleReset = () => {
    setTechniques([...STARTING_TECHNIQUES]);
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-dojo-border bg-dojo-surface/30 p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg text-dojo-ember">{student.name}</h3>
        <span className="text-xs uppercase tracking-wider text-dojo-muted">
          {student.belt} belt
        </span>
      </div>

      <p className="text-sm text-dojo-muted">
        Session reps: <span className="font-mono tabular-nums text-dojo-text">{reps}</span>
      </p>

      <button
        onClick={handleLogTwoReps}
        className="w-fit rounded-lg bg-dojo-ember px-4 py-2 text-sm font-medium text-black transition hover:bg-dojo-ember-bright"
      >
        Log two reps
      </button>

      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-dojo-muted">
          Techniques ({techniques.length})
        </span>
        {techniques.map((technique) => (
          <TechniqueRow key={technique.id} name={technique.name} />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          value={draftTechnique}
          onChange={(event) => setDraftTechnique(event.target.value)}
          placeholder="Add a technique…"
          className="min-w-0 flex-1 rounded-md border border-dojo-border bg-dojo-bg/60 px-3 py-2 text-sm text-dojo-text outline-none focus:border-dojo-ember"
        />
        <button
          onClick={handleAddTechnique}
          className="rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-ember"
        >
          Add technique
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSort}
          className="rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-ember"
        >
          Sort A-Z
        </button>
        <button
          onClick={handleReset}
          className="rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-crimson hover:text-dojo-crimson"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
