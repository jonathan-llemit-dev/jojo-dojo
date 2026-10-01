# React Dojo — Study Notes

Study notes for each React topic covered in this repo. Each entry has an explanation, the sample code you wrote, and where it is applied in the project.

---

## 01 — `useState` (Stateful Components / Counters)

- **Status:** Learning
- **Added:** 2026-10-01

### Explanation

`useState` is a React Hook that lets you add state to a function component. It returns a stateful value and a function to update it. The state persists across renders — when it changes, React re-renders the component so the UI stays in sync.

Key rules:
- Call it at the **top level** of your component (not inside loops, conditions, or nested functions).
- Updates may be **asynchronous** — React batches them, so don't rely on the variable value immediately after `setState`.
- Use functional updates `setCount(c => c + 1)` when the new state depends on the previous state.

### Sample Code

```tsx
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="inline-flex items-center gap-6 p-6 rounded-xl border border-dojo-border bg-dojo-surface/60">
      <button
        onClick={() => setCount((c) => c - 1)}
        aria-label="Decrease reps"
      >
        -
      </button>
      <div className="min-w-[4rem]">
        <span className="text-4xl font-mono tabular-nums text-dojo-ember">
          {count}
        </span>
        <p className="text-xs text-dojo-muted mt-1">reps</p>
      </div>
      <button
        onClick={() => setCount((c) => c + 1)}
        aria-label="Increase reps"
      >
        +
      </button>
    </div>
  );
}
```

### Where Applied

- **File:** `src/topics/use-state/demo.tsx` (the `CounterDemo` component)
- **Route:** `/dojo/topic/use-state` → "Live Demo" panel
- **What it demonstrates:** A controlled counter using `useState` with functional updates (`setCount(c => c ± 1)`), a `Math.max(0, c - 1)` guard to keep count non-negative, conditional rendering based on state value, and event handlers wired to button clicks.

### Key Takeaways

- `useState(0)` sets the initial state to `0`.
- Functional updates (`c => c + 1`) are safer when the new value depends on the old one.
- React re-renders automatically after state changes — no manual DOM manipulation needed.

---

*Last updated: 2026-10-01*
