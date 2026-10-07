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
    "Numbers and strings are the easy case. You hand the setter a new value, React re-renders,\n" +
    "and the screen updates. Objects and arrays have a catch that costs people a lot of time.\n\n" +
    "Try this and watch it do nothing:\n\n" +
    "```\nstudent.name = \"Jojo\";\nsetStudent(student);\n```\n\n" +
    "The name really did change. The problem is that `student` is still the *same object* as\n" +
    "before, and React compares the old value with the new one to decide whether to re-render.\n" +
    "Same object, so it sees no change, and your edit never reaches the screen.\n\n" +
    "The rule is **replace, do not mutate**. Build a new value instead of editing the one you\n" +
    "have:\n" +
    "- Object: `setStudent((current) => ({ ...current, name: next }))`\n" +
    "- Array: `setEntries((current) => [...current, entry])`\n" +
    "- Sorted array: `setEntries((current) => [...current].sort(byName))`\n\n" +
    "`push`, `sort` and `splice` all edit the array you already have, so none of them counts as\n" +
    "an update. `sort` is the sneakiest: it hands back the very same array, which is why the\n" +
    "copy comes first.\n\n" +
    "The updater form is what makes all of this safe. Handing the setter a function instead of\n" +
    "a value means it receives the latest state, not the value that was captured when the\n" +
    "handler was written.\n\n" +
    "That matters most when you set state twice in one handler:\n\n" +
    "```\nsetReps(reps + 1);\nsetReps(reps + 1);   // still the OLD reps, so it computes the same number\n```\n\n" +
    "Both lines work out the same figure, so the second replaces the first and the count rises\n" +
    "by **1**. React does not re-render between them, so `reps` never changes in between. With\n" +
    "the updater form, each call receives the result of the one before it and the count rises\n" +
    "by 2:\n\n" +
    "```\nsetReps((current) => current + 1);\nsetReps((current) => current + 1);   // receives 1, returns 2\n```\n\n" +
    "Two *different* setters in one handler are fine — they are separate values. The trap is\n" +
    "the same setter twice, or anything computed from state another line has already changed.\n\n" +
    "One more shape worth knowing. When building a value is expensive, you can hand `useState`\n" +
    "a function to run once instead of a value to store:\n\n" +
    "```\nuseState(buildPlan());        // runs buildPlan on EVERY render, keeps only the first\nuseState(() => buildPlan());  // runs it once, for the first render\n```\n\n" +
    "The arrow is the whole difference, and it is easy to miss. `useState(buildPlan)` — passing\n" +
    "the function itself, no arrow and no call — is the one that really surprises people:\n" +
    "`buildPlan` becomes the state, and React calls it for you when it needs the first value.",

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
