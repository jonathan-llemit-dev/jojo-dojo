# React Dojo — Study Notes

**This file is written by the AI reviewer — you never have to write here.** It is the quick-review
document: what has been covered, what is actually known, and the traps worth remembering, written to
be read in a few minutes between sessions. Your hands-on work is the exercise; this is the summary of
it, and the code itself lives under `src/topics/`.

**How to read it:** the Knowledge Snapshot first (what you know right now), then the numbered topic
entries, then the traps cheat-sheet at the bottom.

For each lesson, the status comes from the topic-marker comment at the top of its `demo.tsx` (entry
`03 — Routing` is the exception: it has no lesson component of its own, so its status is the reviewer's
assessment rather than a marker):
`OK` = Mastered, `LD` = Learning, `RV` = Reviewing. The marker format is documented in `CLAUDE.md`.

---

## Current Knowledge Snapshot

*Assessed 2026-10-04 by the AI reviewer. This is the quick answer to "what do I actually know?" — read it before a study session rather than re-reading every entry. It is re-assessed after each new lesson. The evidence rules are in the "Reviewer responsibilities" section of `CLAUDE.md`; the roadmap checkboxes are marked from this list.*

### Solid — confirmed in working code *and* explained correctly

| Area | Evidence |
| --- | --- |
| JSX syntax | Built the `jsx` lesson: a JSX comment, `{2 + 2}`, `{new Date().toLocaleDateString()}`, `className` |
| `useState` | The counter demo, plus explained why a plain variable cannot hold a value that changes |
| Routing basics | Built `/test/:student/:name/:subjects` (three params, one route) and registered a lesson — the sidebar link, the `/dojo/topic/jsx` URL and the grid card all appeared having written **zero** new routes |
| Conditional rendering | Fixed both bugs in the `conditional-rendering` exercise, and went past the minimum: named the condition once instead of patching each guard. Guided — entry 05 |
| Components & props | Fixed both bugs in the `components-props` fix-it lesson — deleted a prop mirrored into `useState` (unaided), and made an optional prop required so the compiler caught the call site that omitted it. Details in entry 04 |
| File & component structure | Followed the registry convention unaided: `demo.tsx` + `index.ts`, marker header, camelCase export for a data object rather than PascalCase |
| TypeScript in this codebase | Typed objects (`Topic`), `import type`, and no unnecessary type assertions |

*Rigor note: every entry in this table now rests on code **and** a correct explanation. JSX was
originally recorded on code evidence alone, which contradicted the reviewer's own standard — a
docs-audit question about why `jsx/demo.tsx` needs no `import React` (answer: JSX compiles to `jsx()`
calls from `react/jsx-runtime`) closed that gap rather than the rule being relaxed.*

*Scope note: deeper `useState` material — object and array state, lazy initialisers, and batching when
one handler sets state twice — is tracked as its own roadmap item rather than kept as a caveat on the
completed lesson. Every `useState` in the repo currently holds a primitive (numbers, plus one boolean
for the mobile menu), which is why that surface has not been exercised yet.*

### Quiz-passed — explained correctly, no dedicated code yet

Understood as *concepts*, not yet *demonstrated as skills*. A single correct multiple-choice answer is weak evidence, so these stay unticked until a lesson exercises them.

- **Lists & keys** — knows `key` is identity across renders (so React reuses the right DOM node and keeps its state), not a CSS id.
- **Event handlers** — knows `onClick={fn}` passes a reference while `onClick={fn()}` calls it immediately during render.
- **`useEffect`** — knows it runs after render and re-runs when a dependency changes. Has never written one.

### Gaps — the honest list

- **Never used at all:** forms / controlled inputs, `useContext` / `useReducer`, custom hooks, `useMemo` / `useCallback`, `useRef`, portals.

### Next, in order

1. **Lists & keys** — a lesson that renders `.map()` with keys, converting a quiz-pass into demonstrated knowledge.
2. **Event handling** — a lesson to convert the other quiz-pass into demonstrated knowledge.
3. **`useEffect`** — real data fetching with a loading state and cleanup.
4. **Forms & controlled inputs** — the natural companion to `useEffect`.
5. **`useContext` / `useReducer`** — worth learning once a lesson genuinely needs shared state.

---

## 01 — `useState` (Stateful Components / Counters)

- **Status:** OK (Mastered) — verified
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

## 02 — JSX (Syntax, Expressions & Rendering)

- **Status:** OK (Mastered) — verified
- **Added:** 2026-10-04
- **Belt:** white
- **Marker file:** `src/topics/jsx/demo.tsx`

### Explanation

JSX is the HTML-like syntax you write inside a React component. It is **not HTML and not a string** —
it is a notation that compiles to ordinary JavaScript function calls. That one fact explains most of
its quirks.

With the automatic runtime this project uses (`"jsx": "react-jsx"` in `tsconfig.app.json`), this:

```tsx
<div className="box">{2 + 2}</div>
```

compiles to roughly this:

```js
jsx("div", { className: "box", children: 2 + 2 });
```

`jsx` is imported for you from `react/jsx-runtime`, which is why **modern component files need no
`import React from "react"`**. (Before React 17 the compiler emitted `React.createElement(...)`
instead, which is where that old habit comes from.)

### Key rules

- **`className`, not `class`.** React maps it to the DOM's real `class` attribute; `class` is a
  reserved word in JavaScript, which is the historical reason for the difference.
- **`{ }` embeds a JavaScript *expression***: `{2 + 2}` renders `4`, `{new Date().toLocaleDateString()}`
  renders today's date, `{user.name}` renders a property. An expression, not a statement — no `if` or
  `for` inside the braces.
- **Comments are `{/* … */}`.** A bare `//` or `/* */` is a JavaScript comment and simply won't appear.
- **One root element.** A component returns a single element; wrap siblings in a `<div>` or a
  fragment `<>…</>`.
- **Capitalization carries meaning.** `<div>` is an HTML tag, `<JsxDemo>` is your component. That is
  why `const Demo = topic.component;` followed by `<Demo />` works in `TopicDetail.tsx` — and why the
  capital letter is mandatory.

### Where Applied

- **File:** `src/topics/jsx/demo.tsx` (the `JsxDemo` component)
- **Route:** `/dojo/topic/jsx` → "Live Demo" panel
- **What it demonstrates:** a JSX comment that does not render, two embedded expressions
  (`{2 + 2}` and `{new Date().toLocaleDateString()}`), and `className` for styling.

---

## 03 — Routing (React Router v7)

- **Status:** OK (Mastered) — verified
- **Added:** 2026-10-04
- **Where:** `src/App.tsx`, `src/main.tsx`, `src/components/layout/TutorialLayout.tsx`,
  `src/components/topics/TopicDetail.tsx`, `src/components/sandbox/TestGreeting.tsx`

### Explanation

Routing is **a switch statement over the URL**. Your `useState` mental model already covers it: a
value changes and React re-renders to match — except the value is the address bar, and it lives in the
browser rather than in state.

`<Routes>` and `<Route>` are **not HTML tags and they render nothing visible**. They are a lookup
table describing "if the URL looks like this, render that component":

```tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/dojo" element={<TutorialLayout />}>
    <Route index element={<TopicIndex />} />
    <Route path="topic/:slug" element={<TopicDetail />} />
  </Route>
</Routes>
```

### Key rules

- **`element={<HomePage />}` takes JSX**, not a component reference. `element={HomePage}` is wrong.
  (Note the opposite convention in `topics/registry.ts`, where `component: CounterDemo` *is* a bare
  reference — different library, different rule.)
- **A colon turns a path segment into a variable.** `path="topic/:slug"` is a *pattern*, not a literal
  string, so it matches `/dojo/topic/anything` — one route definition serves every lesson forever.
- **The name after `:` is yours to choose.** It only has to match what you ask for later with
  `useParams()`. `:slug` and `useParams().slug` are two loose strings in different files, and
  **TypeScript cannot check that they agree.**
- **`index` means "the parent's path exactly"** — `index` inside `/dojo` matches `/dojo` and nothing
  else.
- **Child paths are relative.** `path="topic/:slug"` nested under `/dojo` is really
  `/dojo/topic/:slug`. (`useMatch` in `Sidebar.tsx` uses the full path because it is *asking a
  question*, not declaring a child.)
- **Route order does not matter** in v6+ — routes are ranked by specificity, unlike v5's `<Switch>`.
- **`<Outlet />` is the hole in the layout** where the matched child renders. That is why the sidebar
  persists instead of remounting on every lesson change.
- **`<Link to="…">` for in-app navigation, never `<a href="…">`.** `<a>` asks the *browser* for a new
  document, which throws the whole app away; `<Link>` tells the *router*, so only the changed part
  re-renders.

### The bug this produces — kept deliberately in the sandbox

`src/components/sandbox/TestGreeting.tsx` is **intentionally broken** to reproduce the most common
routing bug:

```tsx
// route declares:  /test/:student/:name/:subjects
const params = useParams();
// but the JSX reads params.teacher — never declared, so always undefined
```

It renders `Good day, !` and nothing warns you. **Debugging trick:** print the whole object —
`<pre>{JSON.stringify(useParams(), null, 2)}</pre>` — and read which keys really exist instead of
guessing which name is wrong.

### Why `vercel.json` exists

`<Link>` only covers clicks *inside* the app. Refresh, bookmark, or paste `/dojo/topic/use-state`
directly and the browser asks the **server** for that path — where no such file exists. The catch-all
`rewrites` entry answers every path with `index.html` and lets the app route itself.

It must be a **rewrite**, not a redirect: rewrites run *after* Vercel checks the filesystem, so real
files such as `/assets/*.js` are still served as themselves. A catch-all `redirects` entry is
evaluated *before* that check and can hand a JavaScript request `index.html` — which the browser
reports as a blank page and `SyntaxError: Unexpected token '<'`.

---

## 04 — Components & Props (Data Down, Events Up)

- **Status:** OK (Mastered) — verified
- **Added:** 2026-10-04
- **Belt:** white
- **Marker file:** `src/topics/components-props/demo.tsx`
- **Route:** `/dojo/topic/components-props`

### Explanation

Props are the arguments you hand to a component, written in JSX like HTML attributes:

```tsx
<Drill label="Roundhouse kicks" reps={5} />
```

Inside the component they arrive as one object, which you normally destructure right in the parameter
list:

```tsx
function Drill({ label, reps }: DrillProps) { … }
```

Props flow in **one direction — down**, from parent to child. A child cannot change what it receives,
because props are a fresh snapshot supplied on every render; only the parent can pass something
different. So when a child needs to change a value, the parent owns that value in `useState` and
passes down **both the value and a function to change it**. The child calls the function, the parent's
state updates, and the new value flows back down as props. That whole loop is the phrase to
remember: **data down, events up.**

### The two rules that matter here

1. **Never copy a prop into `useState` to "keep" it.** `useState(prop)` reads that prop once, on the
   first render. From then on the copy is frozen while the real value moves on, and the two drift
   apart permanently. Use the prop directly.
2. **An optional prop is a promise.** `label?: string` claims the component still works without it.
   If the component then renders it blindly, forgetting to pass it produces a silently blank heading
   instead of an error. When a component cannot work without a prop, make it **required** and let
   TypeScript catch the omission for you.

### The two bugs it shipped with

`src/topics/components-props/demo.tsx` was deliberately broken — two bugs, both compiling, so the page
loaded normally and nothing crashed:

1. The second drill row had a blank heading.
2. Pressing "Add a rep" raised the session total, but the drill rows stayed stuck at `0` forever.

### How it was verified — 2026-10-04

Two rounds: attempt 1 fixed one bug properly and worked around the other; attempt 2 closed it out.

**Bug 2 — solved unaided (attempt 1).** `const [snapshot] = useState(reps)` was replaced by using
`{reps}` directly. That is exactly right, and it is the harder of the two: the copy existed only to be
frozen at the first render, so rendering the prop is the whole fix. The rows now follow the session
total. Only the symptom was ever described to the learner, never the location.

**Bug 1 — worked around, then solved (attempt 2).** Attempt 1 made the *child* print `N/A` when the prop
was missing (`{label || "N/A"}`), which silenced the symptom and kept the defect: the row read "N/A"
forever. The real problem was the **type**, not the render — `label?: string` permits "a drill with no
name", and that is not a state this app should be able to represent. Making it `label: string` forced
TypeScript to reject the call site that omitted it, so the compiler did the searching and the fallback
became dead code. This one needed a nudge (the reviewer pointed at the type), so it counts as guided.

**The lesson worth keeping:** a display fallback and a real fix can look identical in the UI — both make
the symptom vanish. If a value is genuinely required, put the requirement in the type and let the
compiler find the call sites you forgot, instead of catching the problem at render time.

---

## 05 — Conditional Rendering (`&&`, Ternary, Early Return)

- **Status:** OK (Mastered) — verified
- **Added:** 2026-10-04
- **Belt:** white
- **Marker file:** `src/topics/conditional-rendering/demo.tsx`
- **Route:** `/dojo/topic/conditional-rendering`

### Explanation

Conditional rendering is not a React feature — it is plain JavaScript deciding what to return. JSX has no
`if` statement of its own, so you use an expression. There are three tools, and picking the right one is
most of the skill:

| Tool | Reach for it when |
| --- | --- |
| `condition && <Thing />` | Show Thing, or show nothing. There is no "else". |
| `condition ? <A /> : <B />` | Both outcomes are real — a ternary cannot leave a gap. |
| `if (!data) return <Empty />` early | The *whole component* differs, not just one line of it. |

### The two traps this lesson is built on

1. **`&&` does not coerce to a boolean.** It returns the *left operand itself* when that operand is falsy,
   and React renders numbers. So `{reps && <p>…</p>}` prints a bare `0` on the page. A comparison fixes it
   — `{reps > 0 && …}` — because `reps > 0` genuinely is `true` or `false`. React renders nothing for
   `false`, `null`, `undefined` and `true`; everything else, `0` and `NaN` included, reaches the screen.
2. **Two `&&`s are not an either/or.** Independent guards can overlap (both show) or leave a gap (neither
   shows), because nothing ties them together. If two states exist and one must always be visible, that is
   a ternary.

The technique worth stealing from the demo: give the condition a name (`const isTraining = reps > 0;`)
and the boolean stays a boolean, so the `&&` can never print a stray number.

### How it was verified — 2026-10-04

`src/topics/conditional-rendering/demo.tsx` shipped as a fix-it exercise with two bugs that both
compiled — a stray `0` from `{reps && …}`, and two independent `&&` guards where one ternary belonged
(they left the badge blank at 0 reps and showed **both** badges from 6 reps on). Both are now fixed,
and the remedy was better than the minimum: instead of patching each guard, the condition was
**named once** and reused —

```tsx
const isTraining = reps > 0;
```

— so the badge became a single ternary (exactly one branch, always) and `&&` received a real boolean it
can never print. The card also grew a fatigue warning above 20 reps, and every conditional it added
keeps a real boolean on the left.

**Evidence note:** this counts as **guided**, not unaided. The reviewer had offered a framing hint ("an
expression that returns a value is being used where you wanted a condition") and the lesson's own sample
code already showed the named-boolean pattern. Props bug 2 remains the only unaided fix on record.

### Why the snippet escapes its backticks

The demo contains its own template literal (`` value={`${reps} reps in the bank`} ``). A bare backtick
would end the sample's template literal early, and `${` would be interpolated, so both are escaped in
`index.ts` — which means the parity check has to unescape before comparing. Verified that way: **63 of
63 lines identical**.

---

## Traps & mental models

Every correction made during review, in one place. These are the things most likely to bite again.

| Trap | What actually happens |
| --- | --- |
| `{count && <p>…</p>}` when `count` is `0` | Renders a bare **`0`** on the page. `&&` returns the falsy *left operand itself* — it does not coerce to a boolean the way an `if` does. React ignores `false`, `null`, `undefined` and `true`, but happily renders the number `0`. Use `count > 0 && …`. |
| Reassigning a prop inside the component | Does nothing useful. Props are a fresh snapshot each render; only the parent can change them. No re-render is triggered and your edit is overwritten next render. |
| `let count = 0` for a value that changes | Re-created from scratch on every render, so it can never accumulate. A changing value that must update the UI belongs in `useState`. |
| `onClick={handleClick()}` | Calls the function **immediately, during render** — and if it sets state, that is an infinite render loop. `onClick={handleClick}` passes a reference for React to call later. |
| `key={index}` in a list | On any sort or delete, index 2 becomes a different item, so React reuses the wrong DOM node and input values/state attach to the wrong row. Use a stable id from the data. |
| A `:param` renamed on one side only | The value silently arrives as `undefined`. TypeScript cannot help. |
| Assuming `import React from "react"` is required | It is not, with `"jsx": "react-jsx"`. JSX compiles to `jsx()` from `react/jsx-runtime`. |
| `{label || "N/A"}` for a prop that should always exist | Silences the symptom and keeps the defect — the UI now says "N/A" forever. If a value is genuinely required, type it as required and let the compiler find the call sites that forgot it. |
| `{slug}` used as a lookup key when it may be missing | `topicBySlug[undefined]` is `undefined`, so guard with `slug ? topicBySlug[slug] : undefined` before using it. |

**The one mental model that explains most of React:** a re-render means **React calls your component
function again**, with fresh arguments. State persists across those calls, plain variables do not, and
props *are* the arguments. When something "doesn't update", ask which of those three you are actually
relying on.

---

*Last updated: 2026-10-04*
