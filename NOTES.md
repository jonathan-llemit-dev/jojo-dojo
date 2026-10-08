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

*Assessed 2026-10-07 by the AI reviewer. This is the quick answer to "what do I actually know?" — read it before a study session rather than re-reading every entry. It is re-assessed after each new lesson. The evidence rules are in the "Reviewer responsibilities" section of `CLAUDE.md`; the roadmap checkboxes are marked from this list.*

### Solid — confirmed in working code *and* explained correctly

| Area | Evidence |
| --- | --- |
| JSX syntax | Built the `jsx` lesson: a JSX comment, `{2 + 2}`, `{new Date().toLocaleDateString()}`, `className` |
| `useState` | The counter demo, plus explained why a plain variable cannot hold a value that changes |
| Routing basics | Built `/test/:student/:name/:subjects` (three params, one route) and registered a lesson — the sidebar link, the `/dojo/topic/jsx` URL and the grid card all appeared having written **zero** new routes |
| Conditional rendering | Fixed both bugs in the `conditional-rendering` exercise, and went past the minimum: named the condition once instead of patching each guard. Guided — entry 05 |
| Components & props | Fixed both bugs in the `components-props` fix-it lesson — deleted a prop mirrored into `useState` (unaided), and made an optional prop required so the compiler caught the call site that omitted it. Details in entry 04 |
| File & component structure | Followed the registry convention unaided: `demo.tsx` + `index.ts`, marker header, camelCase export for a data object rather than PascalCase |
| Lists & keys | Fixed the `lists-and-keys` exercise unaided — changed `key={index}` to `key={exercise.id}` and nothing else — then explained why: React **reuses the row component and the tick lives inside that reused component**, so a key that names a slot glues the state to the slot. Entry 06 |
| Event handling | Built the `event-handling` lesson and scored **3/3** on its quiz, including reading four differently-wired buttons and picking the one arrow form that both defers the call and supplies the argument. Entry 07 |
| `useEffect` | The timer demo (interval effect, real dependency array, real cleanup), plus explained why a missing cleanup **compounds** and why `[]` means once rather than "when anything changes". One quiz answer was wrong and corrected — entry 08 |
| TypeScript in this codebase | Typed objects (`Topic`), `import type`, and no unnecessary type assertions |
| Forms & controlled inputs | Fixed both bugs in the `forms` exercise — the no-op `onChange` and the missing `preventDefault` — and corrected a `FormData` detour by explaining controlled vs read-at-submit. Entry 09 |
| `useState` deep dive | Fixed all three bugs in the `use-state-deep-dive` exercise unaided — updater form for the double setter, `[...techniques, newTechnique]` for the add, `techniques.slice().sort(...)` for the sort — then explained the snapshot mechanism in their own words: both `setReps(reps + 1)` lines read the same render's value, so both compute the same number. Entry 10 |
| `useRef` | Built the Escape-to-close and focus-into-panel behaviour in `Sidebar.tsx`: a DOM ref, a keydown listener, and an effect with real cleanup and an honest dependency array. Explained both directions of the rule — a ref change re-renders nothing, so a ref value must not be rendered; and a render-time read can't be trusted, because a render may be repeated or discarded. Took three passes to get past "refs aren't initialised until effects run" (they are — `useRef(1)` holds 1 during the first render). Entry 11 |
| `useContext` / `useReducer` | Built a second, independent shared-state feature beside the session card — a meal planner with its own `createContext`, its own `useReducer` and a six-member action union, a `useDiet()` accessor, and three more panels that receive **no props**. Verified in the browser: one dispatch moved the totals panel and the list panel together, and Remove cleared both. Explained the provider rule (a consumer outside its provider gets `null` and the accessor throws) and the `never` default (it catches a *forgotten case*, not a typo — that is the union's job) in their own words. Entry 12 |

*Rigor note: every entry in this table now rests on code **and** a correct explanation. JSX was
originally recorded on code evidence alone, which contradicted the reviewer's own standard — a
docs-audit question about why `jsx/demo.tsx` needs no `import React` (answer: JSX compiles to `jsx()`
calls from `react/jsx-runtime`) closed that gap rather than the rule being relaxed.*

*Scope note: deeper `useState` material — object and array state, lazy initialisers, and batching when
one handler sets state twice — is tracked as its own roadmap item (entry 10) rather than kept as a caveat
on the completed lesson. This note used to claim that **every** `useState` in the repo holds a primitive.
That was wrong, and the correction matters because it shrinks the real gap: `lists-and-keys` holds an array
of objects (`useState<Exercise[]>(EXERCISES)`), `event-handling` holds an array of objects plus a
`string | null`, and both `event-handling` and `use-effect` already call two setters in one handler. What is
genuinely unexercised is **replacing a field on an object held in state**, **lazy initialisers**, and
**calling the same setter twice in one handler** — which is what entry 10's exercise targets.*

### Quiz-passed — explained correctly, no dedicated code yet

Understood as *concepts*, not yet *demonstrated as skills*. A single correct multiple-choice answer is weak evidence, so these stay unticked until a lesson exercises them.

*(Empty. `useState` deep dive was the last entry — cleared by an own-words explanation on 2026-10-07, see entry 10.)*

**Process note — the pre-lesson check that started this topic, 2026-10-07 (2 of 4).** Kept because the wrong answers show what the exercise had to fix. Two of the three misconceptions were gone by the end (the array-mutation one, cleared by the repair itself, and the double-setter one, cleared in entry 10); the lazy-initialiser one has **not** been re-tested, which is why that gap is still listed below rather than assumed closed:

| # | Question | Result |
| --- | --- | --- |
| 1 | What does the screen show when a handler does `list.push(x); setTechniques(list);`? | **Wrong.** Answered "grows on the first press, then stops". The truth is it never grows at all — the mutation never produced a render. That answer implies the mutation *works* and only needs forcing, which would send a fix in the wrong direction. |
| 2 | What does `useState(buildPlan())` put in state? | **Correct** — it calls `buildPlan` and stores the return value. (First wording of this question was too dense and was **voided**, then re-asked smaller.) |
| 3 | What does `useState(() => buildPlan())` put in state? | **Wrong.** Answered "the function itself". The arrow makes React call it once and store the array; the composition of the two facts in Q2 is the part not yet in place. |
| 4 | `setReps(reps + 1)` twice in one handler, from 0 — the new count? | **Wrong.** Answered "up by 2, because React batches". Batching is real but is not what saves you: both lines compute `0 + 1` from the same render's `reps` and the second is a no-op. The belief that "batching applies both changes" is exactly what hides the bug. |

**What the repair itself showed.** All three handlers were fixed correctly and unaided: the updater form for the double setter, `[...techniques, newTechnique]` for the add, and `techniques.slice().sort(...)` for the sort — the last being the strongest evidence in the set, because `sort` returning the *same* array is the subtlest of the three and `.slice()` is exactly the right instinct. `tsc` and `npm run lint` stayed green throughout.

**One misconception corrected mid-exercise, worth keeping.** The learner's work-in-progress note on the add handler read "nothing to fix here" — having just fixed the sort, they had stopped treating the add as a bug. It was still mutating in place. The lesson: **fixing one member of a bug family does not fix the family**; three handlers with three identical root causes needed three fixes, and two siblings being repaired does not make the third correct. It was fixed on the next pass, without a hint about the location.

### In progress — lesson live, verification outstanding

*(Empty. Every registered lesson is verified.)*

### Gaps — the honest list

- **Never used at all:** custom hooks, `useMemo` / `useCallback`, portals.
- **Taught in code but not yet exercised by a lesson of its own:** **lazy initialisers** (`useState(() => build())`). The mechanism is written up in entry 10 and appears in that lesson's prose, but no exercise has tested it, so it is not on the "Solid" table. Everything else the `useState` deep dive set out to cover — object/array replacement and the double-setter collapse — is now verified.

### Next, in order

React and TypeScript topics only. Deploy, social links and a custom domain were removed from the roadmap as
settled decisions (2026-10-07) — the site is already live at <https://jojo-dojo.vercel.app/> and every push
deploys automatically, so there is nothing to schedule there. See `ROADMAP.md`.

1. **Custom hooks** — extracting a repeated hook sequence into one place.
2. **`React.memo` / `useMemo` / `useCallback`** — and, more usefully, when *not* to reach for them.
3. **Portals** — rendering outside the parent DOM hierarchy.
4. **Lazy initialisers** (`useState(() => build())`) — written up in entry 10 and mentioned in that lesson's prose, but still never exercised. It needs a lesson of its own or a question in a future review, not a new claim.

The project is at **`0.13.0`** — a running number that gains `0.01` with every new topic (and can be adjusted
deliberately). Keep the `HomePage` badge (`v0.13`) in step; the three version artefacts are listed in
`CLAUDE.md` under "Versioning".

---

## 01 — `useState` (Stateful Components / Counters)

- **Status:** OK (Mastered) — verified 2026-10-01
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

This is the lesson's actual sample snippet — the same logic as the component, with the
`className="..."` styling trimmed so the shape is easier to read. The styled original lives in
the file listed under "Where Applied".

```tsx
import { useState } from "react";

function CounterDemo() {
  const [count, setCount] = useState(0);

  return (
    <div className="inline-flex items-center gap-6">
      <button onClick={() => setCount((c) => Math.max(0, c - 1))}>−</button>
      <span className="text-4xl font-mono">{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}
```

The live component goes one step further and prints a milestone line under the counter, which is
where the conditional rendering shows up in this lesson:

```tsx
{count > 0 && (
  <p>
    {count < 5 && "🌱 Warming up…"}
    {count >= 5 && count < 20 && "🔥 Getting stronger."}
    {count >= 20 && count < 50 && "💪 Serious training."}
    {count >= 50 && "🥋 Master level."}
  </p>
)}
```

Worth noticing: the updater receives the *previous* value as `c`, so `Math.max(0, c - 1)` is a
perfectly normal use of the updater form — you are allowed to compute the next state from the
old one. That guard is what stops the counter from going below zero.

### Where Applied

- **File:** `src/topics/use-state/demo.tsx` (the `CounterDemo` component)
- **Route:** `/dojo/topic/use-state` → "Live Demo" panel
- **What it demonstrates:** A controlled counter using `useState` with functional updates (`setCount(c => c ± 1)`), a `Math.max(0, c - 1)` guard to keep count non-negative, conditional rendering driven by the state value, and event handlers wired to button clicks.
- **Keep in sync:** if you edit `demo.tsx`, update the snippet above too. The two have drifted twice — once the notes showed `c - 1` while the component used `Math.max(0, c - 1)`, and once the notes carried a hand-written 19-line counter while the lesson's own snippet was a different 11-line one. The snippet above is now the lesson's real one.

### Key Takeaways

- `useState(0)` sets the initial state to `0`.
- Functional updates (`c => c + 1`) are safer when the new value depends on the old one.
- React re-renders automatically after state changes — no manual DOM manipulation needed.

---

## 02 — JSX (Syntax, Expressions & Rendering)

- **Status:** OK (Mastered) — verified 2026-10-04
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
- **`{ }` embeds a JavaScript *expression***: `{2 + 2}` renders `4`,
  `{new Date().toLocaleDateString()}` renders today's date **as a locale-formatted string**
  (`10/4/2026` in en-US), `{user.name}` renders a property. An expression, not a statement — no `if`
  or `for` inside the braces.
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

- **Status:** OK (Mastered) — verified 2026-10-04
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

- **Status:** OK (Mastered) — verified 2026-10-04
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

- **Status:** OK (Mastered) — verified 2026-10-04
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
63 lines identical**, once the empty `{}` left behind by the demo's stripped JSX comment is removed
(the demo is 64 stripped lines, the sample 63; the sample's 63 all match).

---

## 06 — Lists & Keys (`map()`, and what a key is for)

- **Status:** OK (Mastered) — verified 2026-10-04
- **Added:** 2026-10-04
- **Belt:** white
- **Marker file:** `src/topics/lists-and-keys/demo.tsx`
- **Route:** `/dojo/topic/lists-and-keys`

### Explanation

A list in React is just an array that you turn into elements with `map()`. The `key` you put on each
element is **not** a CSS id, a DOM attribute, or anything the user ever sees — it is the answer to the
one question React asks on every re-render:

> which element in the new list is the *same thing* as which element in the old one?

That question matters because React reuses rows between renders, and a reused row **keeps its own state** —
a `useState` inside the row, the text in an uncontrolled input. The key is what decides which state goes
with which row.

Two properties make a key usable. It needs **both**:

| Property | Means | What breaks it |
| --- | --- | --- |
| **Stable** | the same data item keeps the same key across renders | `key={index}` — after a sort, rotate, filter or remove, index 1 is a *different* item, so row 1's state is handed to whichever item landed there |
| **Unique** among siblings | no two siblings share a key | `key={entry.name}` — real data repeats names, and React warns in the console rather than guessing which is which |

**The safe default:** a key that comes from the data and identifies the *thing*, not the *position* —
`key={exercise.id}`. Putting ids on your data is normal and worth doing.

**When `key={index}` is acceptable:** only for a list that is genuinely static — never re-ordered, never
added to, never removed from. A list you rotate, sort or delete from is not it.

**The tell that you got it wrong:** the *data* moves but the *state* does not. A tick, a note, an input
value — anything a row owns — stays on the same spot on screen while the rows rearrange around it. If a
row's own state ever disagrees with the row's props, the key is the first thing to check.

### The exercise

`src/topics/lists-and-keys/demo.tsx` is deliberately small: one list of three exercises, one "Rotate"
button, and one "Done" toggle per row. Each row owns that toggle in its own `useState`.

It shipped broken by keying the rows on the array index. Press Done on a row, press Rotate, and the tick
appeared on a different exercise — an index names a **slot**, so React treated "the row in slot 1" as the
same row across renders and kept its state there, while the exercise that used to be in slot 1 moved away.

**Fixed 2026-10-04** by keying on `exercise.id`, so the key identifies the *exercise* and its state follows
it. Verified by re-running the reconciliation simulation against the component's real Rotate logic
(`[...current.slice(1), current[0]]`): tick Front kicks, rotate three times, the tick is still on Front
kicks. The fix is two lines, and the Sample Code panel is now a true mirror of the demo.

### How it was verified — 2026-10-04

**The fix (unaided).** One change: `key={index}` became `key={exercise.id}` at the `.map()`. Nothing else in
the component moved — no restructuring, no conditionals, no patching of the symptom. Verified by re-running
the reconciliation simulation against the component's real Rotate logic
(`[...current.slice(1), current[0]]`): tick Front kicks, rotate three times, the tick is still on Front
kicks. `tsc` and `npm run lint` green.

**The explanation (their own words).** Asked why the index key moved the tick, the answer was that the index
"uses the exact order of each rendered component… the value will remain on that specific location order",
and that to persist a value on the intended component the key must be "the actual unique id of the given
data". Asked what React does with the row when Rotate is pressed, the answer was the mechanism itself:
**React reuses the row component, and the tick lives inside that reused component.** That is the whole bug in
one sentence — the key decides *which instance* is reused, so a key that names a position glues the row's
state to the position while the data moves on.

**Their rule, and where it is conservative.** The rule offered was that `key={index}` is unsafe "if there's
any addition, removal, and reordering of data". That is a good rule to write code by, and it is *stricter*
than the underlying truth: appending at the end preserves every existing index, so React reuses each instance
against the same data and nothing moves or is lost. Put to that case directly, the answer was that it is
safe — which is correct, and the reviewer would have been wrong to mark it down. Also correct, and asked for
separately: what decides whether a changed list actually *breaks* is **row-level state** (`useState` or an
uncontrolled input). Reordering is the worst case because it reuses the wrong instance and the state
misplaces; insertion or removal elsewhere loses or shifts state; a list with no row state and no reordering
is fine on the index.

---

## 07 — Event Handling (Handler References, Named Handlers & Arguments)

- **Status:** OK (Mastered) — verified 2026-10-04
- **Added:** 2026-10-04
- **Belt:** white
- **Marker file:** `src/topics/event-handling/demo.tsx`
- **Route:** `/dojo/topic/event-handling`

### Explanation

A handler is a function you give React to call later. Two forms, both correct:

| Form | Looks like | Reach for it when |
| --- | --- | --- |
| Inline arrow | `onClick={() => setReps((r) => r + 1)}` | the body is one expression and can close over what is in scope |
| Named function | `onClick={handleReset}` | the body is more than a line, it is reused, or it is handed down as a prop |

**Naming convention worth keeping:** a prop carrying a callback is `onSomething` (`onLogRep`,
`onRemove`); the function it points at is named for what it does (`handleRemoveExercise`). The `on`/`handle`
split is what makes a component's API readable at a glance.

**The rule that matters** — what you put in `onClick` must be a **function**, not the result of calling one:

```tsx
<button onClick={handleReset}>    {/* a reference — React calls it on click */}
<button onClick={handleReset()}>  {/* CALLED now, during render */}
```

`handleReset()` runs while the component renders and passes whatever it returns (usually `undefined`) to
`onClick`, so nothing is left for the click to run. The test to apply: **would this expression do anything
if the component never re-rendered?**

**When the handler needs an argument**, the fix is not fewer parentheses, it is one more layer — an arrow
that *is* the handler:

```tsx
<button onClick={() => handleRemoveExercise(exercise.id)}>Remove</button>
```

Now `onClick` receives a function, and the id is supplied when React calls it. This is the third wiring, and
it is the one that catches people.

**Why this topic has no fix-it exercise.** Every other `LD` lesson in the journal ships a planted bug that
compiles. This bug cannot: `tsc` rejects `onClick={handleReset()}` with *Type 'void' is not assignable to
type 'MouseEventHandler<HTMLButtonElement>'*, and ESLint's `react-hooks/set-state-in-render` rule rejects
the same line independently. Verified with a throwaway probe rather than assumed. The lesson is therefore an
explainer, and the Live Demo is a working reference showing all three wirings at once.

**Out of scope here, deliberately:** the event object — `event.target`, `event.preventDefault()` — and
typing an event parameter (`React.MouseEvent<HTMLButtonElement>`). It belongs with Forms, where it has an
actual job to do.

### How it was verified — 2026-10-04

This topic had no hands-on exercise to fix, so the **explained** half was established by a three-question
quiz instead. All three were answered correctly, and none was guessable from the wording of the options.

**Q1 — what the gates object to.** Shown `onClick={handleReset()}`, the answer was that *"handleReset runs
while rendering, and onClick receives its return value instead of the function"*. That is the fact both
`tsc` (void is not assignable to `MouseEventHandler`) and ESLint (`set-state-in-render`) are pointing at.
The follow-up named the danger the linter exists for: a handler that increments would re-render, call
itself again, and loop — which is exactly what happened while this lesson was being built, before the
handler was made idempotent.

**Q2 — reading four wirings.** Given four buttons using one named handler that takes an `id`, the answer
identified the single correct one: the arrow that supplies the argument. Two distinct mistakes were planted
in the list, and the write-up separated them, because they fail very differently:

| Wiring | Caught by | Failure mode |
| --- | --- | --- |
| `onClick={handleRemoveExercise("k1")}` | `tsc` + ESLint | loud — called during render |
| `onClick={() => handleRemoveExercise("k2")}` | nothing | **correct** |
| `onClick={handleRemoveExercise}` | nothing | silent — a click passes the event, so `id` is an event, not an id |
| `onClick={() => handleRemoveExercise}` | nothing | silent — the arrow never supplies an argument |

**Q3 — choosing the form.** For a Rename button needing that row's id, the answer was the arrow wrapper,
with the reason given as the handler needing this row's id. The option of reading the id off the event
object was offered and **would have been accepted** — it is a real pattern — but it is the answer that
requires the event object, which this lesson deliberately deferred to Forms.

**Verdict:** verified. The demonstrated half is covered by the Live Demo exercising all three wirings; the
explained half is above.

---

## 08 — `useEffect` (Dependencies, Cleanup & When Not To)

- **Status:** OK (Mastered) — verified 2026-10-04, after one corrected misconception
- **Added:** 2026-10-04
- **Belt:** white
- **Marker file:** `src/topics/use-effect/demo.tsx`
- **Route:** `/dojo/topic/use-effect`

### Explanation

Everything so far happens **during** render. `useEffect` is for what happens **after** it, and the way to
know you need one is to ask whether you are talking to something outside React: a timer, an event listener,
a network request, `document.title`, a third-party widget. None of those are React, so they cannot happen
during render — and none of them notice when your state changes. An effect is the bridge.

**The dependency array decides when the effect runs**, and it is the whole rest of the hook:

| Second argument | Runs |
| --- | --- |
| `[]` | once, after the first render |
| `[isRunning]` | after the first render, and again whenever `isRunning` changes |
| omitted | after **every** render — almost never what you want |

The array is a **promise**: every value the effect body reads from the component belongs in it.
`react-hooks/exhaustive-deps` checks that promise and names what you left out.

**Cleanup is the half that gets skipped.** An effect may return a function; React runs it before the next
run of that effect and once more on unmount. Whatever the body started, the cleanup stops:

```tsx
useEffect(() => {
  const id = setInterval(() => setSeconds((s) => s + 1), 1000);
  return () => clearInterval(id);
}, [isRunning]);
```

Delete the `return` line and nothing breaks *immediately* — which is the trap. Each change to `isRunning`
leaves the old interval alive and starts another, so the clock ticks twice as fast, then three times as
fast. **A leak compounds rather than appearing**: the symptom shows up several interactions after the
mistake, which is why this survives so long in real code.

**The updater form keeps the dependency array honest.** `setSeconds((s) => s + 1)` needs no dependency on
`seconds`. Reading `seconds` directly inside the effect would force `[isRunning, seconds]`, tearing down and
rebuilding the interval every single second.

**And the rule React's own docs lead with: you might not need an effect at all.** If you are reaching for
`useEffect` to *compute* a value from props or state, compute it during render instead. The demo's formatted
clock (`M:SS`) is calculated in the component body for exactly this reason — deriving it in an effect would
cost a second render and show a stale value for one frame.

### Why there is no fix-it exercise

Probing seven candidate bugs against both gates left only cleanup mistakes shippable:

| Bug | Gates |
| --- | --- |
| Derived state synced through an effect | rejected by `react-hooks/set-state-in-effect` |
| Object/array as a dependency | rejected by the same rule + `exhaustive-deps` |
| Wrong or missing dependency array | rejected by `exhaustive-deps` |
| Wrapper handler on the dependency line | rejected by `exhaustive-deps` |
| Fetch with no `AbortController` | passes, but there is no server here to observe the race |
| Listener / interval with no cleanup | **passes both** |

That last row is one mistake in two shapes, which is too thin for an exercise whose point is diagnosis. So
the lesson is a lecture and a working reference, and clearance comes from the quiz.

### How it was verified — 2026-10-04

This topic had no hands-on exercise, so the **explained** half came from three questions asked one at a
time, with feedback between each. Two were right first time; the third was wrong, and that is the part of
this entry worth reading.

**Q1 — what needs an effect.** Correct. Chose `document.title` and gave the reason that matters: it is not
React, so nothing re-renders it when state changes, and the effect is the bridge. The three options rejected
— `reduce()`, `{count}`, and formatting seconds into `M:SS` — are all values derived from state that already
exists, so they belong in the render. The demo's formatted clock is the worked example.

**Q2 — why a missing cleanup compounds.** Correct. Identified that the previous intervals are never stopped,
so the work multiplies rather than replacing itself, and that it compounds over further toggles.
`setInterval` has no "replace the old one" behaviour — without the returned handle there is nothing to stop
it, so each re-run adds another contributor: 1 → 2 → 3 increments per tick.

**Q3 — the dependency array. Initially wrong, then corrected; this is the entry's real content.**
Given an effect reading `reps` with `[]` as its dependencies, the first answer was that an empty array
still re-runs when a value the effect reads changes. That is backwards, and it matters: **the dependency
array is the only thing that decides re-runs.**
- `[]` — once, after the first render. Never again.
- `[reps]` — after the first render, then whenever `reps` changes.
- omitted — after every render.

So the console shows `0` once and nothing more. The component re-renders as `reps` climbs and the `<p>`
updates, because JSX is evaluated on every render — but the effect does not, because nothing told it to.

The correction was then confirmed with a follow-up, and the answer was right and precise: if that callback
were invoked anyway, it would still see `0`, because **it closed over the value from the render it ran in.**
That is the stale closure, and it is why a missing dependency is a real defect rather than a style nit.

Worth recording as a process note: this is the first quiz answer in the journal that was wrong. It was
corrected in conversation and the mechanism was then explained correctly in the learner's own words, which
is why the box is ticked — but the correction is written down rather than smoothed over, because "an empty
array still re-runs when a value changes" is exactly the belief that makes someone add dependencies
pointlessly or wonder why an effect is not firing.

---

## 09 — Forms & Controlled Inputs (`value` + `onChange`, `preventDefault`)

- **Status:** OK (Mastered) — verified 2026-10-07
- **Added:** 2026-10-07
- **Belt:** white
- **Marker file:** `src/topics/forms/demo.tsx`
- **Route:** `/dojo/topic/forms`

### Explanation

An input is **controlled** when its value comes from state and its changes write back to state. Two halves,
two different jobs:

- `value={name}` makes the input **follow state** — every render shows whatever `name` is.
- `onChange={(event) => setName(event.target.value)}` makes **state follow the input** — every keystroke
  hands the new text back to `name`.

Drop `value` and the box stops reflecting state (it still types, but programmatic values won't show); drop
`onChange` and the box freezes (React keeps re-rendering it back to the state value). A controlled input
needs both halves: state in through `value`, text out through `onChange`. The typed text arrives on the
event object as `event.target.value` — the same event object the event-handling lesson deferred, now with a
job to do.

The other half of a form is the submit. A `<form>` has a default behaviour: on submit the browser builds an
HTTP request from `action`/`method` and navigates, reloading the page and throwing away state. To keep the
submit in React you stop that default with `event.preventDefault()` — "don't do your default thing, let my
React code run instead." The parameter is typed, and the type follows the event: `SubmitEvent<HTMLFormElement>`
for a submit, `ChangeEvent<HTMLInputElement>` for a change, `MouseEvent<HTMLButtonElement>` for a click.

### How it was verified — 2026-10-07

The exercise shipped with two planted bugs: the Name input's `onChange` wrote state back to itself
(`onChange={() => setName(name)}`), so typing never changed state and the field looked frozen; and the
submit handler took no event parameter and never called `preventDefault()`, so the browser reloaded the page
and the confirmation was lost.

Both were fixed correctly — `onChange={(event) => setName(event.target.value)}`, and a
`handleSubmit(event: SubmitEvent<HTMLFormElement>)` that calls `event.preventDefault()` first — and the
objective is met: type in both fields, press Sign up, and the confirmation reads "Welcome, <name> — we'll
email you at <email>." with no reload. `tsc` and `npm run lint` stay green.

The real learning was a detour worth recording. On top of the two fixes the learner added a
`new FormData(event.currentTarget)` block (plus a `console.log`) to read the values back out of the form,
reasoning that "FormData is the new way for form submission since React 19." That was wrong in two ways:
`FormData` is the browser's own API, not new to React — React 19 added *form actions* (`<form action={fn}>`),
a different pattern — and in a controlled form the values already live in state, so reading them back from
the DOM is redundant. Asked to explain, the learner corrected it in their own words: `FormData` reads from
the form at submit time (the uncontrolled path, when nothing needs to react live), while `useState` keeps the
values so they are available in real time. The block was removed, and the submit handler is now the clean two
lines.

Both halves of the standard are met: the working component is the learner's own fix, and the explanation is
correct.

---

## 10 — `useState` Deep Dive (Object & Array State, Lazy Initialisers, Two Setters)

- **Status:** OK (Mastered) — verified 2026-10-07
- **Added:** 2026-10-07
- **Belt:** white
- **Marker file:** `src/topics/use-state-deep-dive/demo.tsx`
- **Route:** `/dojo/topic/use-state-deep-dive`

### What this entry is

This is the **concept-level** write-up. It was written *before* the exercise was fixed, so it states the
rules without handing over the answers — and it has been kept that way, because the rules are the point and
the specifics are now in the code. The three bugs were all in *how state is updated*, never in what is
rendered, and all three compiled, so nothing warned you: the page loaded, the buttons responded, and the
numbers were simply wrong.

**Fixed 2026-10-07.** Status is `OK` in the marker, `tsc` and `npm run lint` are green, and the Sample Code
panel is a true mirror of the demo at **114 of 114** lines. See the "How it was verified" section at the end
of this entry.

### The rule the whole lesson turns on

React decides whether to re-render by comparing the value you handed the setter with the one it already had
— **by reference**. A changed object or array that is still the *same* object or array is not a change React
can see. Everything below is that one fact in different clothes.

**Replace, do not mutate.**

| State shape | Replace it like this | What is *not* an update |
| --- | --- | --- |
| Object | `setStudent((current) => ({ ...current, name: next }))` | `student.name = next` — the same object, so React bails out |
| Array | `setEntries((current) => [...current, entry])` | `entries.push(entry)` — changes the array in place and returns its new *length* |
| Array, reordered | `setEntries((current) => [...current].sort(byName))` | `entries.sort(...)` — sorts in place and returns the same array |
| Array, one item replaced | `setEntries((current) => current.map(...))` or `toSpliced` | `entries[i] = newItem` |

- **`push` returns a number, not an array.** That is why `setEntries(entries.push(x))` is doubly wrong, and
  why the `[...current, x]` spread is the shape to reach for.
- **The updater form** — passing a function instead of a value — is what makes replacement safe, because the
  function is handed the *latest* state rather than the value that was captured when the handler was written.

### Lazy initialisers

A **lazy initialiser** is a function you hand to `useState` instead of a value:

```tsx
const [plan] = useState(buildPlan());        // calls buildPlan on EVERY render, keeps only the first result
const [plan] = useState(() => buildPlan());  // calls it once, for the first render only
```

React cannot tell whether a function is your starting *value* or the thing that *produces* it, so a bare
function counts as an initialiser only when it is passed as the initialiser. The arrow is the whole
difference. It earns its keep when building the value is expensive; it costs nothing when it is not.

### Two setters in one handler

React **batches** the updates a handler makes, so nothing re-renders between them, and **every line in the
handler reads the state from the render it came from** — not from the line above it. Hence the outcome that
surprises people:

```tsx
setReps(reps + 1);   // reps is still the old value here
setReps(reps + 1);   // ...and still the old value here, so this computes the SAME number
```

Both lines produce the same figure, the second replaces the first, and the count rises by **1**. With the
updater form each call is handed the previous call's result, so the same two lines rise by **2**.

Two different setters in one handler (`setSignedUp(true)` next to `setEmail(...)`) have no such problem —
they are different boxes. The trap is specifically the **same** setter twice, or a value computed from state
that another line in the same handler has already changed.

### The exercise

Three planted bugs, in three different shapes, all array-or-counter rather than object-field. Expected
values were written into the demo's own header comment, so the target was never a matter of opinion: "Log
two reps" must add 2, "Add technique" must grow the list and clear the box, and "Sort A-Z" must actually
reorder the rows. One of them was invisible until another was fixed — the sort looked like nothing
happening behind a list that never grew — which is worth remembering about bugs that share a root cause.

**One thing worth knowing about the exercise's shape:** the *object-field* mistake that this lesson is
really about **cannot be shipped as a planted bug in this project.** ESLint's `react-hooks/immutability`
rule rejects every way of writing it — direct, aliased, nested, inside a helper, and `Object.assign` — which
was checked with a throwaway probe before the exercise was designed. Array *methods* (`push`, `sort`) are
not caught by that rule, which is why the plantable bugs are array-shaped. Object replacement is therefore
taught in the lesson prose and the Sample Code panel rather than offered as something to repair. The full
probe result is recorded in `ROADMAP.md` and `HISTORY.md`.

### How it was verified — 2026-10-07

**Demonstrated — all three fixed unaided, both gates green.** `setReps((reps) => reps + 1)` twice for the
double setter; a new object built outside the setter and added with
`setTechniques((techniques) => [...techniques, newTechnique])` for the add; and
`techniques.slice().sort(...)` for the sort. Reset was fixed by the same move (`[...STARTING_TECHNIQUES]`).
Every shape that mutates in place is gone from the file, and `tsc` / `npm run lint` pass. The Sample Code
panel was then swapped from the fix-it exception to a real mirror, measured at **114 of 114** lines.

**The best evidence in the fix is the `.slice()`.** `sort` returning *the same array* is the subtlest of the
three mutations — there is no return value to misread, unlike `push` returning a length — and reaching for a
copy first is precisely the correct instinct. The add was fixed on a second pass after a note that read
"nothing to fix here": having repaired the sort, the learner had stopped treating the add as a bug, and the
lesson is that **fixing one member of a bug family does not fix the family**.

**Explained — in their own words, 2026-10-07.** Asked why `setReps(reps + 1)` written twice stores 1, the
answer was that it reads "the current value of state when it was last rendered, [so] every entry of
`setReps(reps + 1)` is just the same reference of the previous value + 1, not the updated value + 1". That is
the mechanism: one snapshot, both lines compute the same number, the second replaces the first.

**One word was probed rather than waved through.** The answer said "**reference**", and in this journal that
word means object *identity* — the thing React compares to decide whether to re-render — not a captured
value. Those are two different bugs that must not blur together, so the distinction was put directly ("a
stale number has no reference to be stale") and then tested on a fresh case: `setReps(reps + 2)` twice from
`0`. The answer was **2**, not 4 — "both lines read `reps` as 0 separately, so both call `setReps(2)`" —
derived from the snapshot rule. A shared-reference reading predicts 4, so this settles what they meant. With
the wording pinned down, the explanation stands.

**Verdict: verified.** Both halves are on the record — working code the learner wrote (all three handlers
fixed, gates green, sample a true mirror at 114 of 114), and the mechanism explained in their own words.
Recorded in the snapshot's "Solid" table.

**Note on the exercise's shape.** The *object-field* mistake this lesson is really about **cannot be shipped
as a planted bug in this project.** ESLint's `react-hooks/immutability` rule rejects every way of writing it
— direct, aliased, nested, inside a helper, and `Object.assign` — checked with a throwaway probe before the
exercise was designed. Array *methods* (`push`, `sort`) are not caught by that rule, which is why the planted
bugs were array-shaped. Object replacement is therefore taught in the lesson prose and the Sample Code panel
rather than offered as something to repair. The full probe result is in `ROADMAP.md` and `HISTORY.md`.

---

## 11 — `useRef` (DOM Handles & Values That Outlive a Render)

- **Status:** OK (Mastered) — verified 2026-10-07
- **Added:** 2026-10-07
- **Belt:** white
- **Marker file:** `src/topics/use-ref/demo.tsx`
- **Route:** `/dojo/topic/use-ref`

### Explanation

`useRef` returns one object with a single property, `current` — and it is **the same object on
every render**. Two jobs fall out of that one fact:

| Job | How it looks | Why it works |
| --- | --- | --- |
| A handle on a DOM node | `const inputRef = useRef<HTMLInputElement>(null);` then `<input ref={inputRef} />` | React fills in `.current` once the element exists |
| A mutable value that survives a render | `const tally = useRef(0);` then `tally.current += 1` | The component function starts over each render, so a plain `let` would reset |

The DOM half has one consequence worth expecting rather than debugging: **a ref starts as `null`.**
The element does not exist until React has rendered it, so the first render always sees nothing.
Every read admits it — `inputRef.current?.focus()` — and TypeScript enforces that, because
`useRef<HTMLInputElement>(null)` makes `.current` genuinely possibly `null`.

### The rule that keeps refs honest

**A ref holds values that are not needed for rendering.** React does not watch a ref, so writing to
`.current` schedules **no re-render**. A number the screen depends on would sit there out of date
while the rest of the page moved on. That is what `useState` is for, and reaching for a ref when you
meant state is the mistake this hook invites.

The rule has a second half, and it is the one that catches people who already know the first:
**do not read a ref during render either.** Not in the component body, not in JSX, not in a value
derived from one. Effects and event handlers are where reads belong. In this project
`react-hooks/refs` reports a render-time read as an **error**, which is why the demo's reads all sit
in a mount effect and two click handlers.

### Why this lesson has no fix-it exercise — the strongest case in the journal

Thirteen candidate bugs were probed against both gates before the lesson was designed. **Seven were
rejected**, and the rejections are not random:

| Candidate bug | Killed by |
| --- | --- |
| Ref written during render to memoise a derived value | `react-hooks/refs` |
| Ref used where state belongs, read in JSX | `react-hooks/refs` |
| DOM ref passed to a function component | `tsc` **TS2322** |
| DOM ref read in a handler with no null guard | `tsc` **TS18047** |
| The "latest value" ref trick, written during render | `react-hooks/refs` |
| Timer handle kept in `useState` | `react-hooks/set-state-in-effect` |
| Ref callback returning a value | `tsc` **TS2322** |

**The rule's boundary is exact, and it was measured.** A control file reading `ref.current` in the
component body was rejected; an otherwise identical file reading the same ref only inside an effect
and a handler passed. Body or JSX → rejected. Effect or handler → allowed.

**Why that removes the whole exercise.** Every `useRef` mistake with an *observable symptom* has the
same shape — a ref value reached the render — which is exactly what `react-hooks/refs` rejects. So a
bug that passes both gates has **no symptom at all**, and an exercise whose symptoms cannot be
observed fails the project's own rule that a planted bug must name its expected values and show
simulated symptoms.

What did pass both gates was either correct code (nothing to repair) or a mistake that is not about
`useRef` at all: a keydown listener with no cleanup — the same one-in-two-shapes bug that already
forced `use-effect` to a lecture — and a ref incremented in a handler but never displayed, which is
invisible by construction.

**The teaching point this leaves behind:** the "latest value ref" escape hatch for dodging a stale
closure — still recommended by plenty of tutorials — is unavailable in this project, and the reason
is not arbitrary. A ref the render depends on is a ref the render will show stale.

### The hands-on half — `Sidebar.tsx`

The lesson is an explainer, so the *demonstrated* half came from the Escape-to-close that `Sidebar.tsx`
had been deliberately deferring in its own header comment:

```tsx
useEffect(() => {
  if (!isMenuOpen) return;
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") setIsMenuOpen(false);
  };
  document.addEventListener("keydown", handleKeyDown);
  panelRef.current?.focus();
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [isMenuOpen, currentLabel]);
```

Both halves are present at once: a **DOM ref** (`panelRef`, focused so the keyboard is not left
behind on the burger) and an **effect that subscribes**, with the unsubscribe on the way out.
`currentLabel` is in the dependency array because the effect body reads it — tapping a lesson closes
the menu, and the label under the burger changes with it.

### Status — verified 2026-10-07, after the misconception was actually cleared

**Demonstrated — done.** The lesson's `demo.tsx` focuses an input on mount through a DOM ref and keeps a
running `{ renders, lastReps }` tally in a ref that is written by an effect and read by a click handler,
never during render. `tsc` and `npm run lint` are green, and the Sample Code panel is a **true mirror** at
**77 of 77** lines, measured rather than estimated. The Sidebar change adds the Escape key and
focus-into-panel behaviour, also with both gates green.

**Explained — this took three passes, and the wrong answers are the entry's real content.** The first two
attempts rested on the same misconception, and it did not shift under a plain correction: it had to be shown
to be self-contradictory before it moved.

| # | Question | Result |
| --- | --- | --- |
| 1 | A handler does `tally.current = 5` and nothing else — what does the screen show? | **Correct.** "It keeps showing the old value, because a ref change never causes a re-render." The render-side rule, first time. |
| 2 | Why is *reading* `ref.current` during render wrong? | **Wrong.** "Refs are not initialised until effects run, so the read is always undefined or null." |
| 3 | When does an effect run, relative to the render — and could that create a gap? | **Wrong.** Answered "0, because an empty dependency array means the effect only ever runs once", conflating an *omitted* array with an empty one. Corrected: no array means every render. |
| 4 | `useEffect(fn, [])` vs `useEffect(fn)` — how often does each run? | **Correct**, after feedback: "once, and after every render". |
| 5 | A component reads `inputRef.current` in the body only for a `console.log` — what is genuinely wrong? | **Passed on** ("clarify the question"), which was fair — the question was tangled. |
| 6 | Walk through the `useRef(value)` tracker: after `value` goes 1 → 2, what does the paragraph print? | **Wrong, same misconception.** "Now 2, previously undefined — the ref has no value yet because the effect hasn't run." |
| 7 | Forget the effect: during the FIRST render, what is `useRef(1).current`? | **Correct — and this is the correction landing.** "It holds 1 right away — that's what `useRef(value)` set it to, and the effect is only there to keep it updated for later renders." |
| 8 | Setting lag aside, why is a render-time read unsafe in principle? | **Correct.** "A render can be repeated or discarded, so what you read may come from a pass that never became the real one." |

**The misconception, stated exactly, because it lasted two rounds.** The belief was that a ref is
*uninitialised* until an effect runs — that the argument to `useRef` is not a value you get, but a recipe for
one. It is not: `useRef(1)` produces `{ current: 1 }` during the first render. What genuinely starts `null`
is a **DOM** ref's `.current`, and that is because React has not attached the element yet — a different cause
that was being folded into the same belief.

**What finally moved it.** Not repeating the correction. The answer was laid against the learner's *own*
earlier wording — they had chosen "the ref is one render behind" at one point, and a box that holds nothing
cannot be one render behind — and the contradiction did the work. Q7 then answered itself correctly, and Q8
gave the mechanism rather than the rule.

**Verdict: verified.** Both halves are on the record: working code (the demo, the `Sidebar` Escape-to-close,
gates green, sample a true mirror at 77 of 77) and the rule explained in both directions — a ref change
renders nothing, and a render-time read cannot be trusted because a render may be repeated or discarded.

**Worth re-testing in a future review.** The initial-value point (Q7) is the one to revisit, not the
render-discard point — it took deliberate effort to dislodge, and it is the sort of belief that can quietly
return.

**The `useEffect` overlap, kept because it happened twice.** Q3 repeated the confusion from the `useEffect`
session from the opposite direction: there an empty `[]` was believed to re-run when a value changed; here an
omitted array was believed to run once. Same rule read wrongly both ways — **`[]` is a restriction, and
omitting the array applies no restriction.** It is in the cheat-sheet.

---

## 12 — `useContext` & `useReducer` (Shared State, and Actions Instead of Setters)

- **Status:** OK (Mastered) — verified 2026-10-08
- **Added:** 2026-10-08
- **Belt:** white
- **Marker file:** `src/topics/use-context-reducer/demo.tsx`
- **Route:** `/dojo/topic/use-context-reducer`

### What this lesson is

The first topic where the state does not belong to a single component. The demo is a training card with three
panels — rounds, technique, session log — that pass **no props to each other**. One `useReducer` owns the
session, one `createContext` publishes `{ state, dispatch }`, and each panel takes what it needs with
`useContext`.

`useState` holds one value and hands you a setter. `useReducer` holds one object and hands you a `dispatch`,
and a plain function — the reducer — decides what each named action does to it. The two ideas are independent,
and they are used together here because that is how they get used: the reducer is the state machine, the
context is the delivery.

### The two rules the lesson turns on

1. **A reducer returns the next state; it never changes the one it was handed.** React compares the old state
   with the new one by reference. `{ ...state, rounds: state.rounds + 1 }` is a different object, so React
   re-renders; `state.rounds += 1; return state;` is the *same* object, and React's own source bails out before
   scheduling a render at all. The screen keeps the old number from the very first click — it does not "work
   once and then stop".
2. **The provider must be an ancestor of every consumer.** A component cannot read a value it publishes
   itself. A `useContext` call in the same component that renders `<SessionContext.Provider>` sees whatever
   sits above it — or the context's default, which is chosen to look plausible, and that is what makes a
   missing provider silent.

### The hands-on task — build, do not repair

**The task.** Add a **fourth panel** that consumes the same session context from a different part of the tree,
dispatches **a new action type** you add to `SessionAction`, and handles it **purely** in `sessionReducer`. It
must take **zero props** from the provider's parent, and it must show something the three existing panels do
not — total techniques committed, the longest technique name, how many rounds were logged before a reset, your
choice.

**Expected values.** The card must still behave exactly as it does now: "Log a round" adds 1, "Add to the log"
appends the trimmed technique and clears the box, "Reset the session" returns to the starting state — and your
panel must update on every one of those, from its own position in the tree.

**The seven acceptance criteria — this is what gets measured, and they are fixed now, not after the fact:**

| # | Criterion |
| - | --- |
| 1 | The provider is an ancestor of every consumer, checked against the tree rather than inferred |
| 2 | The reducer is pure in **every** shape: no `state.x =`, no alias, no nested field, no `Object.assign`, no in-place array method |
| 3 | Every dispatched action is handled, and `SessionAction` stays a discriminated union so a typo cannot compile |
| 4 | Context state is read with `useContext`; it is never mirrored into a local `useState` |
| 5 | No state derived in an effect, and no `set-state-in-effect` |
| 6 | `npx tsc -p tsconfig.app.json --noEmit` and `npm run lint` stay green |
| 7 | It genuinely needs context — a version that could equally have been written with props does not count |

**How it gets assessed.** The code is the *demonstrated* half. The *explained* half is two or three questions
anchored in that code, or a prose explanation handed over with it. A failed criterion gets named, with the
line it failed on, and the box stays open.

### Why this is a lecture and not a fix-it exercise

It **could** have been a fix-it exercise. Thirty-five probe files against both gates showed that a reducer's
own `state` parameter is invisible to `react-hooks/immutability`: `state.count += 1; return state;` inside a
reducer compiles and lints clean, while the identical mutation written in a component is rejected outright.
The lecture is therefore a deliberate choice of exercise shape rather than a gate failure — the model changed
on 2026-10-08, and a build of your own is now the default hands-on half. The full probe result is recorded in
`ROADMAP.md` and `HISTORY.md`.

### How it was verified — 2026-10-08

**Demonstrated — a second, independent feature, reviewed and then driven in the browser.** Rather than adding a
fourth panel to the session card, the learner built a whole meal planner beside it: its own
`createContext` / `useReducer` pair, its own `useDiet()` accessor, a **six-member action union** (`addFood`,
`removeFood` with a payload, three draft updates, `reset`), and three more panels that receive **no props**.
All seven acceptance criteria pass, and `tsc` / `npm run lint` are green.

Driven live rather than inferred: "Spaghetti" + 500 calories → **Add Food** moved Total Meals 0 → 1 and Total
Calories 0 → 500, and the Food List panel showed the row at the same moment — **one dispatch, three sibling
panels, no props**. **Remove** on that row returned all three figures to zero and the list to its empty state.
The payload action, the guarded `addFood` and the form-clearing all behaved.

**Explained — 3/3, on questions anchored in that code.** Asked what would happen if `FoodStatsPanel` were moved
outside its provider, the answer was that `useDiet()` gets `null` and throws — which needs **both** halves of
the rule (the context default is `null`, *and* the accessor refuses it). Asked what
`const _exhaustive: never = action;` buys over a plain `default: return state;`, the answer was that it stops
compiling when a new action type has no case — correctly rejecting the tempting confusable, that a `never`
check catches a *typo*, which is the union's job and not the default branch's. Asked why "Reset Meal Plan"
leaves the rounds counter alone, the answer was that `dispatchDiet` only ever reaches `dietReducer`: two
stores, two dispatches.

**One real defect, and neither gate could see it.** The three new sections reused the session panels' heading
ids (`rounds-heading`, `technique-heading`, `log-heading`), and `FoodStatsPanel` put `rounds-heading` on all
three of its headings. Duplicate ids are invalid, and `aria-labelledby` resolves to the *first* match — the
accessibility tree announced the meal panels as `region "ROUNDS"`, `region "TECHNIQUE"` and
`region "SESSION LOG"`. `tsc` and ESLint are blind to id collisions, so it took looking at the rendered page.
Reviewer-fixed as plumbing — a pure rename to `diet-meals-heading` / `diet-calories-heading` /
`diet-protein-heading`, `diet-form-heading` and `diet-list-heading` — with the stats section labelled by a
space-separated list of its three headings.

**Verdict: verified.** Both halves are on the record, and the Sample Code panel was regenerated mechanically
to **376 of 376** lines.

**Noted, not blocking.** Three small things the review found in the new code and left alone, because none of
them is a criterion: the number inputs hold a `number` and coerce with `+event.target.value`, so clearing the
box snaps it to `0` instead of going empty; `removeFood` also wipes the in-progress form fields and re-sets
`nextId` to itself; and `state.caloriesDraft <= 0` is `false` for `NaN`, so `Number.isFinite(...)` would close
that hole.

---

## Traps & mental models

Every correction made during review, in one place. These are the things most likely to bite again.

| Trap | What actually happens |
| --- | --- |
| `{count && <p>…</p>}` when `count` is `0` | Renders a bare **`0`** on the page. `&&` returns the falsy *left operand itself* — it does not coerce to a boolean the way an `if` does. React ignores `false`, `null`, `undefined` and `true`, but happily renders the number `0`. Use `count > 0 && …`. |
| Reassigning a prop inside the component | Does nothing useful. Props are a fresh snapshot each render; only the parent can change them. No re-render is triggered and your edit is overwritten next render. |
| `let count = 0` for a value that changes | Re-created from scratch on every render, so it can never accumulate. A changing value that must update the UI belongs in `useState`. |
| `onClick={handleClick()}` | Calls the function **immediately, during render** — and if it sets state, that is an infinite render loop. `onClick={handleClick}` passes a reference for React to call later. In this project the mistake never reaches the browser: `tsc` and ESLint's `set-state-in-render` rule both reject it. |
| `onClick={handleClick(id)}` with an argument | Same mistake, one argument later. Wrap it: `onClick={() => handleClick(id)}`. The rule for both: what goes in `onClick` must be a function, not the result of calling one. |
| `key={index}` in a list | An index names a **slot**, not an item. Reorder the list and React reuses the instance that used to be in that slot, so the row's own state (`useState`, an uncontrolled input) stays with the position while the data moves past it. Appending at the *end* is the harmless case — every existing index is unchanged. Use a stable id from the data. |
| A `:param` renamed on one side only | The value silently arrives as `undefined`. TypeScript cannot help. |
| Assuming `import React from "react"` is required | It is not, with `"jsx": "react-jsx"`. JSX compiles to `jsx()` from `react/jsx-runtime`. |
| `{label || "N/A"}` for a prop that should always exist | Silences the symptom and keeps the defect — the UI now says "N/A" forever. If a value is genuinely required, type it as required and let the compiler find the call sites that forgot it. |
| `{slug}` used as a lookup key when it may be missing | `topicBySlug[undefined]` is `undefined`, so guard with `slug ? topicBySlug[slug] : undefined` before using it. |
| Two siblings sharing a key | React warns in the console and cannot tell them apart, so one row's state is reused for the other and the other's state is discarded. Ids from the data are unique; names are not. |
| `useEffect` with no cleanup | Whatever the effect started keeps running. Change the dependency and React starts **another** one, so the work multiplies — a timer ticks twice as fast, a listener fires twice per event. The symptom appears several interactions after the mistake, which is why it survives review. Return `() => clearInterval(id)` / `removeEventListener` / `controller.abort()`. |
| `useEffect` used to derive a value | Costs a second render and shows a stale value for one frame. If the value is a function of props or state, compute it during render. This is also what `react-hooks/set-state-in-effect` enforces. |
| A dependency array that lies | `[]` or a partial list means the effect reads a value frozen at the render it ran in. `exhaustive-deps` names the value you left out — fix the effect, do not silence the warning. |
| Confusing `[]` with *no array at all* | They are opposites in strength. `useEffect(fn, [])` runs **once**; `useEffect(fn)` with the second argument **omitted** runs after **every** render. An empty array is the strictest case, not the loosest. This has now been got wrong in both directions — believing `[]` re-runs on a change, and believing an omitted array runs only once. |
| Reading state directly inside an interval | Forces that state into the dependency array, so the interval is torn down and rebuilt every tick. Use the updater form: `setSeconds((s) => s + 1)`. |
| Controlled input missing one half | `value` without `onChange` freezes the box (React re-renders it back to the unchanged state); `onChange` without `value` types fine but the box stops reflecting state. A controlled input needs both. |
| Form submit without `preventDefault()` | The browser runs its default submit — an HTTP request to the form's `action`/`method` — which reloads the page and throws state away. Call `event.preventDefault()` first. |
| Reading form values with `FormData` when they're already in state | Redundant in a controlled form — state is the source of truth. `FormData` is for reading at submit time (uncontrolled), or for React 19 form *actions* (`<form action={fn}>`), a different pattern. |
| `entries.push(x)` on array state | Changes the array **in place** and returns its new *length*, not the array. Hand that back with `setEntries(entries)` and React compares by reference, sees the same array, and does not re-render — so nothing appears. Replace instead: `setEntries((current) => [...current, x])`. |
| `entries.sort(…)` on array state | Sorts in place and returns the **same** array, so `setEntries(entries)` again changes nothing on screen. Sort a copy: `setEntries((current) => [...current].sort(byName))`. `splice` and `reverse` are the same trap. |
| `setReps(reps + 1)` written twice in one handler | Both lines read `reps` from the render they ran in, so both compute the **same** number and the second replaces the first — the count rises by 1, not 2. Use the updater form (`setReps((current) => current + 1)`) whenever the next value depends on the current one, once or several times. |
| `useState(expensiveThing())` meaning to initialise lazily | Calls the function on **every** render and discards every result but the first. Pass the function itself: `useState(() => expensiveThing())`. |
| Writing a field on an object held in state | `student.name = next` changes the very object React is holding, so `setStudent(student)` hands back the same reference and React bails out. Replace: `setStudent((current) => ({ ...current, name: next }))`. In this project ESLint's `react-hooks/immutability` rule rejects the mutation at the source — in every shape it was probed. |
| A ref used for a value the screen shows | Nothing re-renders when a ref changes, because React does not watch it. The screen keeps the value from the last render and looks frozen while the ref moves on. If the reader sees it, it belongs in `useState`. |
| Reading `ref.current` during render | Rejected by `react-hooks/refs` as an error in this project — in the component body, in JSX, or in a value derived from it. Read a ref in an effect or an event handler. The trap behind the rule: a render-time read gives you a value React never promised to keep in step. |
| `useRef<HTMLInputElement>(null)` then `inputRef.current.focus()` | The ref is `null` on the first render, because the element does not exist yet. TypeScript refuses the unguarded read (`TS18047`: possibly `null`). Write `inputRef.current?.focus()`. |
| Reaching for a ref to dodge a stale closure | The "latest value" ref trick works in the wild but is unavailable here: writing `.current` during render is exactly what `react-hooks/refs` rejects. Fix the dependency array instead — that is what it is for. |
| Putting `ref` on your own component | A function component does not forward `ref` unless you ask it to; `tsc` refuses (`TS2322`: property `ref` does not exist). Refs attach to DOM elements, or to a component that opts in. |
| A ref callback written as an arrow that returns a value | `<div ref={(node) => (boxRef.current = node)}>` returns the node, and React reads a returned value as a cleanup function. `tsc` rejects it (`TS2322`). Use a block body: `ref={(node) => { boxRef.current = node; }}`. |
| Writing into the state a reducer was handed | `state.count += 1; return state;` gives React back the very object it passed in, so the comparison finds nothing changed and no render is scheduled — the screen never moves, not even on the first click. A reducer returns a **new** object: `{ ...state, count: state.count + 1 }`. |
| A consumer with no provider above it | `useContext` walks **up** the tree. With no provider ancestor you get the value from `createContext(default)`, and that default is usually chosen to look reasonable, so nothing warns you and nothing changes when the state does. A provider rendered in the same component as the `useContext` call does not help — it is not an ancestor of it. |
| An action type that never reaches the reducer | With `type: string`, a typo at the `dispatch` site compiles and the switch quietly falls through. Type the actions as a union and leave out the `default` branch: a typo then fails to compile, and a new action type is a compile error until the reducer handles it. |

**The one mental model that explains most of React:** a re-render means **React calls your component
function again**, with fresh arguments. State persists across those calls, plain variables do not, and
props *are* the arguments. When something "doesn't update", ask which of those three you are actually
relying on.

**And the follow-up question a list adds:** when the arguments change *and the list is re-ordered*, which
of those rows is the same row as before? That is what `key` answers, and it is why a wrong key shows up as
state sitting on the wrong row rather than as data being wrong.

**And what a ref adds to that model:** a ref is the one thing in a component that is *not* recomputed by
the next call and *not* watched when it changes. That is precisely why it is useful for a DOM node or a
tally, and precisely why it must never hold a value the render depends on.

---

*Last updated: 2026-10-08*
