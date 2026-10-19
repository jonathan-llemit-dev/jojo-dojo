// ─────────────────────────────────────────────
// Topic: React.memo, useMemo & useCallback — memoize only what you have measured
// Added: 2026-10-18 | Status: OK (closed as an explainer, 2026-10-19)
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)
//
// Three tools, one question: **is this work happening more often than the input changes?**
// All three exist to stop repeated work, and all three cost something — a comparison on every
// render, a cached value held in memory, and a dependency array that can go quietly wrong.
// The default is therefore *don't*, until a measurement says otherwise.
//
// What each one actually does, and what the demo proves:
//
//   1. `useMemo` caches a **value** between renders, keyed by its dependencies. The cached
//      answer is not a guarantee — React is allowed to throw it away — so it is a
//      performance hint, never a correctness tool.
//   2. `React.memo` skips re-rendering a **component** when its props are shallowly equal.
//   3. `useCallback` caches a **function's identity** so a memoised child's props stay
//      equal. This is the one people miss: an inline arrow is a new function every render,
//      which silently defeats the `memo()` above it.
//
// The row counters are the evidence. They are written into the DOM from an effect rather
// than rendered, because reading a ref during render is what `react-hooks/refs` rejects —
// the same reason a render tally has to work this way anywhere in this codebase.
//
// **Simplification:** the "expensive" work here is a filter and sort over 2,000 generated
// rows. That is honest — it is genuinely repeated work — but it is synthetic. In a real
// app the number that matters comes from a profiler, not from a demo.
//
// Closed as an explainer on 2026-10-19: the tools and the trade are explained in NOTES.md entry 14.
// No third column was built — the counters below are the demo's evidence, not the learner's build.

import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

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

/** 2,000 rows, built once at module scope — the data is not what re-renders cost. */
const TECHNIQUES: Technique[] = Array.from({ length: 2000 }, (_, i) => ({
  id: i,
  name: `${WORDS[i % WORDS.length]} #${i + 1}`,
  reps: (i * 37) % 100,
}));

/**
 * The "expensive" part: filter 2,000 rows, sort them, keep the top eight.
 *
 * Deliberately not memoised here — where it gets cached is the caller's decision, and that
 * is the whole point of the lesson. Call it every render and you pay every render.
 */
function searchTechniques(query: string): Technique[] {
  const needle = query.trim().toLowerCase();
  const matched = needle
    ? TECHNIQUES.filter((technique) => technique.name.toLowerCase().includes(needle))
    : TECHNIQUES;
  return [...matched].sort((a, b) => b.reps - a.reps).slice(0, 8);
}

type RowProps = { technique: Technique; onPick: (id: number) => void };

/**
 * One result row, carrying its own render count.
 *
 * The counter is the point of the demo: a row that re-renders when nothing about it
 * changed is work you paid for nothing. Note that the row reads its ref **inside the
 * effect**, never during render.
 */
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

/** The memoised version of the same row. Props shallowly equal means no re-render. */
const MemoRow = memo(TechniqueRow);

type ColumnProps = { query: string; onPick: (id: number) => void };

/** No memoisation: the list is rebuilt and every row re-renders, every time. */
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

/** The same list with all three tools applied. */
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

  // Stable identity: the same function on every render, so `memo()` can compare props.
  // Drop the `useCallback` and this becomes a new arrow per render — which breaks every
  // `MemoRow` below it even though their `technique` props never changed.
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
        {picked ? `Picked: ${picked}. ` : ""}Press Nudge — it changes nothing the list uses.
        In the left column every counter climbs; in the right column they hold still.
      </p>
    </div>
  );
}
