import type { Topic } from "../types";
import { MemoizationDemo } from "./demo";

/** Registry entry for the `memoization` React lesson. */
export const memoizationTopic: Topic = {
  slug: "memoization",
  title: "React.memo, useMemo & useCallback — Memoizing Only What You Measured",
  shortTitle: "Memo & Callbacks",
  belt: "blue",
  description:
    "Cache a value, a component or a function only when you have measured the work it saves — and know what each of the three costs.",
  longDescription:
    "A filter box over a long list is where this usually starts. Every keystroke rebuilds the list, re-sorts it and re-renders every row. Two separate costs live in that sentence: recomputing a value, and re-rendering a component that did not change.\n\n" +
    "`useMemo` caches a value between renders and recomputes it only when its dependencies change. Treat that cache as a hint rather than a guarantee: React may throw a memoised value away, so nothing may depend on it being there.\n\n" +
    "`React.memo` wraps a component and skips re-rendering it when its props are shallowly equal. It compares every prop on every render, which is why wrapping a component that almost always receives new props costs more than it saves. It takes a custom comparator as a second argument, rarely worth the dependency you then own.\n\n" +
    "`useCallback` caches a function's identity, and it exists mainly so the `memo()` above it can work. An arrow written inline in JSX is a new function on every render, so a memoised child sees changed props and re-renders anyway:\n\n" +
    "```tsx\n// a new arrow every render: memo() can never match\n<MemoRow technique={row} onPick={(id) => pick(id)} />\n\n// one identity for the life of the component\nconst pick = useCallback((id: number) => setPicked(id), []);\n<MemoRow technique={row} onPick={pick} />\n```\n\n" +
    "Nothing about the handler changed except its identity. That is enough to defeat the memo.\n\n" +
    "The default is not to memoise. Each tool buys work with a comparison you now pay on every render, a value held in memory, and a dependency array someone will eventually get wrong. Most components are cheap enough that all three are a net loss.\n\n" +
    "Memoise a value when it is genuinely expensive and recomputed far more often than its inputs change. Memoise a component when it re-renders often with props that usually stay equal. Do not memoise a component that renders three spans, or a sum of three numbers.\n\n" +
    "The demo searches 2,000 techniques. The left column does no memoisation; the right applies all three tools to the same work. Each row counts its own renders, so the difference is visible rather than described.\n\n" +
    "Press Nudge. It changes a counter the list never reads, yet it re-renders the whole panel. On the left every row counter climbs. On the right they hold still, because the memoised list handed back the same array and the memoised rows compared equal.\n\n" +
    "The last two rows are both memoised and both receive the same technique. Only the function differs: one is stable, one is a fresh arrow. Nudge proves which of them survives the comparison.\n\n" +
    "With the code open, four edits teach more than reading: delete the `useCallback` and watch the right column start climbing, wrap the left column's rows in `memo()` and watch them join it, add `query` to the `useMemo` dependencies and confirm filtering still works, then shrink the list to twenty rows and feel the work disappear.\n\n" +
    "The cost in this demo is synthetic, built so you can watch it. Real work is found with a profiler, not by sprinkling memoisation on a hunch — and a memo that saves nothing still makes the code harder to change.",
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
        <label className="flex min-w-0 flex-1 items-center gap-2 text-xs text-dojo-muted">
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
