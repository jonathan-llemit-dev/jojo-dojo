// ─────────────────────────────────────────────
// Topic: JSX — JSX Syntax & Components
// Added: 2026-10-04 | Status: OK
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)

/**
 * Live working component for the JSX lesson.
 * Demonstrates: a JSX comment, and JavaScript expressions inside braces.
 *
 * Note: there is no React import here on purpose. `tsconfig.app.json` sets
 * `"jsx": "react-jsx"` (the automatic runtime), so JSX compiles to `jsx()` calls
 * imported from `react/jsx-runtime` instead of `React.createElement`.
 */
export function JsxDemo() {
  return (
    <div className="inline-flex flex-col items-center gap-6 p-6 rounded-xl border border-dojo-border bg-dojo-surface/60">
      {/* This is a JSX comment — it does NOT render */}
      <h2 className="text-2xl text-dojo-ember">{2 + 2} is four</h2>
      <p>Today is {new Date().toLocaleDateString()}</p>
    </div>
  );
}
