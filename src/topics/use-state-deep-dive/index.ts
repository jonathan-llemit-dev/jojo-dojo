import type { Topic } from "../types";
import { UseStateDeepDiveDemo } from "./demo";

/** Registry entry for the `useState` deep-dive lesson. */
export const useStateDeepDiveTopic: Topic = {
  slug: "use-state-deep-dive",
  title: "useState Deep Dive — Object & Array State",
  shortTitle: "useState Deep Dive",
  belt: "white",
  description:
    "Replace object and array state instead of changing it, initialise state lazily, and know what two setters in one handler do.",

  longDescription:
    "Primitive state — a number, a string, a boolean — is the easy case: hand the setter a new value and React re-renders. The moment state is an object or an array, a second question appears, and it is the one this lesson is about: is the value you handed the setter actually *different* from the one it already had?\n\nReact answers that by reference. Hand it back the very same object or the very same array and it sees no change worth re-rendering for, so it does nothing at all. That is why every fix in this lesson is the same three words: **replace, do not mutate**.\n- Objects: pass a new object built from the old one — `setStudent((current) => ({ ...current, name: next }))`.\n- Arrays: pass a new array built from the old one — `setEntries((current) => [...current, entry])`. `push`, `sort` and `splice` all change the array you already have, so none of them is an update. `sort` is the sharpest case: it returns *the same array*, which is why the demo sorts a `.slice()` copy.\n- The **updater form** — handing the setter a function instead of a value — is what makes this safe, because each call receives the latest state rather than the value captured when the handler was written.\n\n**A lazy initialiser is a function you hand to `useState` instead of a value.** `useState(buildPlan())` calls `buildPlan` on every single render and throws away every result except the first, which is wasted work at best. `useState(() => buildPlan())` calls it once, for the first render only. The tell is the arrow: React cannot guess whether a function is your starting value or the thing that produces it, so a bare function counts as an initialiser only when it is *passed as* the initialiser. It earns its keep when building the value is expensive, and it costs nothing when it is not.\n\n**Two setters in one handler.** React batches the updates a handler makes, so nothing re-renders between them — and every line in the handler still reads the state as it was for the render it came from. That produces two very different outcomes from code that looks equally reasonable:\n\n```\nsetReps(reps + 1);\nsetReps(reps + 1);   // still reads the OLD reps, so it computes the same value again\n```\n\nBoth lines work out the same number, the second replaces the first, and the count rises by **1**. The updater form fixes it, because each call is handed the result of the one before it:\n\n```\nsetReps((current) => current + 1);\nsetReps((current) => current + 1);   // receives 1, returns 2\n```\n\nUse the updater form whenever the next value depends on the current one. It is right whether the handler sets state once or several times, which is why it is the default in this project.",

  // Flush against the left margin on purpose: a template literal preserves indentation,
  // so indenting this to match the surrounding code would render as ragged leading
  // whitespace in the "Sample Code" panel.
  //
  // A real mirror of ./demo.tsx — the two are kept in step.
  // The demo contains its own template literal, so backticks and ${ are escaped here
  // and the parity check unescapes before comparing.
  codeExample: `import { useState } from "react";
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
function TechniqueRow({ name }: { name: string }) {
  const [isDone, setIsDone] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-dojo-border bg-dojo-surface/60 px-3 py-2">
      <span className="text-sm">{name}</span>
      <button
        onClick={() => setIsDone((done) => !done)}
        className={\`rounded-md border px-2 py-1 text-xs transition \${
          isDone
            ? "border-dojo-ember text-dojo-ember"
            : "border-dojo-border text-dojo-muted hover:border-dojo-ember"
        }\`}
      >
        {isDone ? "Drilled" : "Mark drilled"}
      </button>
    </div>
  );
}
export function UseStateDeepDiveDemo() {
  const [student] = useState<Student>({ name: "Jojo", belt: "white" });
  const [techniques, setTechniques] = useState<Technique[]>(STARTING_TECHNIQUES);
  const [draftTechnique, setDraftTechnique] = useState("");
  const [reps, setReps] = useState(0);
  const handleLogTwoReps = () => {
    setReps((reps) => reps + 1);
    setReps((reps) => reps + 1);
  };
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
  const handleSort = () => {
    const list = techniques.slice().sort((first, second) => first.name.localeCompare(second.name));
    setTechniques(list);
  };
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
}`,

  component: UseStateDeepDiveDemo,
};
