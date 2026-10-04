# React Dojo — Study Notes

Study notes for each React topic covered in this repo. Each entry has an explanation, the sample code you wrote, and where it is applied in the project.

The status comes from the topic-marker comment at the top of each lesson's `demo.tsx`:
`OK` = Mastered, `LD` = Learning, `RV` = Reviewing. The marker format is documented in `CLAUDE.md`.

---

## 01 — `useState` (Stateful Components / Counters)

- **Status:** LD (Learning)
- **Added:** 2026-10-01
- **Belt:** white
- **Marker file:** `src/topics/use-state/demo.tsx`

### Explanation

`useState` is a React Hook that lets you add state to a function component. It returns a stateful value and a function to update it. The state persists across renders — when it changes, React re-renders the component so the UI stays in sync.

Key rules:
- Call it at the **top level** of your component (not inside loops, conditions, or nested functions).
- Updates may be **asynchronous** — React batches them, so don't rely on the variable value immediately after `setState`.
- Use functional updates `setCount(c => c + 1)` when the new state depends on the previous state.

### Sample Code

This is the same logic as the lesson component, with the `className="..."` styling trimmed so
the shape is easier to read. The styled original lives in the file listed under "Where Applied".

```tsx
import { useState } from "react";

function CounterDemo() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((c) => Math.max(0, c - 1))}>−</button>
      <span>{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>+</button>

      {count > 0 && (
        <p>
          {count < 5 && "🌱 Warming up…"}
          {count >= 5 && count < 20 && "🔥 Getting stronger."}
          {count >= 20 && count < 50 && "💪 Serious training."}
          {count >= 50 && "🥋 Master level."}
        </p>
      )}
    </div>
  );
}
```

Worth noticing: the updater receives the *previous* value as `c`, so `Math.max(0, c - 1)` is a
perfectly normal use of the updater form — you are allowed to compute the next state from the
old one. That guard is what stops the counter from going below zero.

### Where Applied

- **File:** `src/topics/use-state/demo.tsx` (the `CounterDemo` component)
- **Route:** `/dojo/topic/use-state` → "Live Demo" panel
- **What it demonstrates:** A controlled counter using `useState` with functional updates (`setCount(c => c ± 1)`), a `Math.max(0, c - 1)` guard to keep count non-negative, conditional rendering driven by the state value, and event handlers wired to button clicks.
- **Keep in sync:** if you edit `demo.tsx`, update the snippet above too. The two had already drifted once — the notes showed `c - 1` while the component used `Math.max(0, c - 1)`.

### Key Takeaways

- `useState(0)` sets the initial state to `0`.
- Functional updates (`c => c + 1`) are safer when the new value depends on the old one.
- React re-renders automatically after state changes — no manual DOM manipulation needed.

---

*Last updated: 2026-10-04*
