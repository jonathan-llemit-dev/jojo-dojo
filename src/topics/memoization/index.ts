import type { Topic } from "../types";
import { MemoizationDemo } from "./demo";

/** Registry entry for the `memoization` React lesson. */
export const memoizationTopic: Topic = {
  slug: "memoization",
  title: "React.memo, useMemo & useCallback — Memoizing Only What You Measured",
  shortTitle: "Memo & Callbacks",
  belt: "blue",
  description:
    "Speed up a slow component by caching a search, a component or a function — and learn when caching costs more than it saves.",
  longDescription:
    "A filter box over a long list is where most people meet this topic. You type a letter, the list rebuilds, and the page stutters. Someone says to add `useMemo`, so you do, and nothing changes that you can see.\n\n" +
    "That is the first lesson: memoisation is a fix for a performance problem, and performance problems stay invisible until you look for them. These three tools are not things to sprinkle on while learning. They are what you reach for once a measurement says a render is expensive.\n\n" +
    "Picture the work in two pieces. Typing in the filter means searching two thousand rows, and it also means rendering every row again. `useMemo` attacks the search. `React.memo` and `useCallback` attack the re-render.\n\n" +
    "`useMemo` keeps the result of a calculation between renders. You tell it what to watch, and it runs again only when that changes:\n\n" +
    "```tsx\nconst rows = useMemo(() => searchTechniques(query), [query]);\n```\n\n" +
    "The saved answer is a shortcut, not a promise. React may throw it away, so never let what the page shows depend on it being there.\n\n" +
    "`React.memo` wraps a component. Before rendering it again, React checks whether its props match the last ones with `===`. Two functions that do the same thing are still two different functions, so one new arrow is enough to fail the check. When every prop matches, React skips the render.\n\n" +
    "`useCallback` keeps the same function object between renders, and it exists mostly to keep `memo()` working. An arrow written inline in JSX is a new function every render, so a memoised child sees a changed prop and re-renders anyway:\n\n" +
    "```tsx\n// a new arrow every render: memo() can never match\n<MemoRow technique={row} onPick={(id) => pick(id)} />\n\n// the same function for the life of the component\nconst pick = useCallback((id: number) => setPicked(id), []);\n<MemoRow technique={row} onPick={pick} />\n```\n\n" +
    "Nothing about the handler changed except which function object it is. That is enough to defeat the memo.\n\n" +
    "The demo makes the difference visible. Two identical lists search the same 2,000 techniques and take the same filter. The left one does no memoisation; the right one applies all three tools. Every row counts how many times it has rendered.\n\n" +
    "Press Nudge. It changes a counter the list never reads, yet the whole panel re-renders. In the left column every row counter climbs. In the right column they hold still, because the memoised list handed back the same array and the memoised rows compared equal.\n\n" +
    "The last two rows are both memoised and both get the same technique. Only the function differs: one is stable, one is a fresh arrow. Nudge shows which one survives the comparison. With the code open, delete the `useCallback` and press Nudge again: the right column starts climbing.\n\n" +
    "That saving still comes with a bill. `memo()` compares props on every render, including the renders it skips. `useMemo` keeps a value in memory. `useCallback` adds a dependency list you have to keep right. On a component that renders three spans, the comparison costs more than the render it avoids.\n\n" +
    "So do not memoise by default. Memoise a value when the calculation is expensive and runs far more often than its inputs change. Memoise a component when it re-renders often with props that usually stay equal. Measure first: a profiler tells you where the time goes, a hunch does not. A memo that saves nothing still makes the code harder to change.\n\n" +
    "The cost in this demo is synthetic, built so you can watch it. Real work is found with a profiler.",
  // Flush against the left margin on purpose: a template literal preserves
  // indentation, so indenting this to match the surrounding code would render as
  // ragged leading whitespace in the "Sample Code" panel.
  //
  // A real mirror of `./demo.tsx` — the two are kept in step. Regenerate with
  // `npm run sync:samples` rather than editing by hand; `npm run check:repo`
  // fails if they drift.
  codeExample: `import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
type Technique = { id: number; name: string; reps: number };
const WORDS = [
  "jab",
  "cross",
  "hook",
  "uppercut",
  "overhand",
  "roundhouse",
  "knee",
  "elbow",
  "sweep",
  "takedown",
  "guard pass",
  "clinch",
];
const TECHNIQUES: Technique[] = Array.from({ length: 2000 }, (_, i) => ({
  id: i,
  name: \`\${WORDS[i % WORDS.length]} #\${i + 1}\`,
  reps: (i * 37) % 100,
}));
function searchTechniques(query: string): Technique[] {
  const needle = query.trim().toLowerCase();
  const matched = needle
    ? TECHNIQUES.filter((technique) => technique.name.toLowerCase().includes(needle))
    : TECHNIQUES;
  return [...matched].sort((a, b) => b.reps - a.reps).slice(0, 8);
}
type RowProps = { technique: Technique; onPick: (id: number) => void };
function TechniqueRow({ technique, onPick }: RowProps) {
  const renders = useRef(0);
  const tally = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    renders.current += 1;
    if (tally.current) tally.current.textContent = String(renders.current);
  });
  return (
    <li className="flex items-center justify-between gap-2 rounded-md border border-dojo-border bg-dojo-bg/40 px-2 py-1">
      <button
        type="button"
        onClick={() => onPick(technique.id)}
        className="min-w-0 truncate text-left text-xs text-dojo-text transition hover:text-dojo-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember"
      >
        {technique.name}
      </button>
      <span className="shrink-0 font-mono text-[10px] tabular-nums text-dojo-muted">
        renders <span ref={tally} className="text-dojo-ember" />
      </span>
    </li>
  );
}
const MemoRow = memo(TechniqueRow);
type ColumnProps = { query: string; onPick: (id: number) => void };
function PlainColumn({ query, onPick }: ColumnProps) {
  const headingId = useId();
  const rows = searchTechniques(query);
  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-2 rounded-lg border border-dojo-border bg-dojo-surface/40 p-3"
    >
      <h4 id={headingId} className="text-xs uppercase tracking-wider text-dojo-muted">
        No memoization
      </h4>
      <ul className="flex list-none flex-col gap-1 p-0">
        {rows.map((technique) => (
          <TechniqueRow key={technique.id} technique={technique} onPick={onPick} />
        ))}
      </ul>
    </section>
  );
}
function MemoColumn({ query, onPick }: ColumnProps) {
  const headingId = useId();
  const rows = useMemo(() => searchTechniques(query), [query]);
  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-2 rounded-lg border border-dojo-border bg-dojo-surface/40 p-3"
    >
      <h4 id={headingId} className="text-xs uppercase tracking-wider text-dojo-ember">
        useMemo + React.memo + useCallback
      </h4>
      <ul className="flex list-none flex-col gap-1 p-0">
        {rows.map((technique) => (
          <MemoRow key={technique.id} technique={technique} onPick={onPick} />
        ))}
      </ul>
    </section>
  );
}
export function MemoizationDemo() {
  const [query, setQuery] = useState("");
  const [nudge, setNudge] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const stablePick = useCallback((id: number) => {
    setPicked(TECHNIQUES[id].name);
  }, []);
  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex w-full min-w-0 items-center gap-2 text-xs text-dojo-muted sm:w-auto sm:flex-1">
          <span className="shrink-0">Filter</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="jab, hook, knee…"
            className="min-w-0 flex-1 rounded-md border border-dojo-border bg-dojo-bg/60 px-2 py-1 text-xs text-dojo-text transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember"
          />
        </label>
        <button
          type="button"
          onClick={() => setNudge((n) => n + 1)}
          className="rounded-md border border-dojo-border px-3 py-1 text-xs transition hover:border-dojo-ember hover:text-dojo-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dojo-ember"
        >
          Nudge — re-render, change nothing
        </button>
        <span className="font-mono text-[10px] tabular-nums text-dojo-muted">nudge {nudge}</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <PlainColumn query={query} onPick={stablePick} />
        <MemoColumn query={query} onPick={stablePick} />
      </div>
      <section className="flex flex-col gap-2 rounded-lg border border-dojo-border bg-dojo-surface/40 p-3">
        <h4 className="text-xs uppercase tracking-wider text-dojo-muted">
          Same memoised row, two handler identities
        </h4>
        <p className="text-[11px] text-dojo-muted">
          Both rows below are <code>memo()</code> and both get the same technique. Only the
          function they receive differs. Press Nudge and watch which counter moves.
        </p>
        <ul className="flex list-none flex-col gap-1 p-0">
          <MemoRow technique={TECHNIQUES[0]} onPick={stablePick} />
          <MemoRow technique={TECHNIQUES[0]} onPick={(id) => setPicked(TECHNIQUES[id].name)} />
        </ul>
      </section>
      <p className="text-xs text-dojo-muted">
        {picked ? \`Picked: \${picked}. \` : ""}Press Nudge — it changes nothing the list uses.
        In the left column every counter climbs; in the right column they hold still.
      </p>
    </div>
  );
}`,
  component: MemoizationDemo,
};
