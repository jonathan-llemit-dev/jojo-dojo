# React Dojo — Roadmap

Tick a topic once the reviewer has **verified** it — that means working code here *and* a correct
explanation from you, not just a right answer to a quiz question. The assessment lives in the
Knowledge Snapshot at the top of `NOTES.md`, and marking these boxes is the reviewer's job, not
yours. See "Reviewer responsibilities" in `CLAUDE.md`.

Status markers used on unverified lines: `IN PROGRESS` = exercise live, awaiting the fix ·
`quiz-passed` = concept understood, needs a lesson · `GAP` = answered wrong or never used.

## React Core Topics

- [x] JSX — syntax, expressions, `className` — lesson live at `/dojo/topic/jsx`
- [x] Components & props — passing data down — lesson live at `/dojo/topic/components-props`
- [x] `useState` — stateful components / counters — lesson live at `/dojo/topic/use-state`
- [ ] `useState` deep dive — object/array state (replace, don't mutate), lazy initialisers, and two setters in one handler — separate from the lesson above, which is complete. Nothing has exercised this yet: every `useState` in the repo holds a primitive (numbers, and one boolean for the mobile menu).
- [x] Event handling — handlers, references, passing arguments — lesson live at `/dojo/topic/event-handling`; verified by a 3/3 quiz (the event object is deferred to Forms)
- [x] Conditional rendering — `&&`, ternary, early return — lesson live at `/dojo/topic/conditional-rendering`
- [x] Lists & keys — `map()`, why keys matter — lesson live at `/dojo/topic/lists-and-keys`; fixed and explained (entry 06)
- [x] Forms & controlled components — input state, validation — lesson live at `/dojo/topic/forms`; fixed and explained (entry 09)
- [x] `useEffect` — side effects, dependency array, cleanup — lecture live at `/dojo/topic/use-effect`; verified by quiz (data fetching deferred to Forms)
- [ ] `useContext` / `useReducer` — global state patterns — **GAP**: never used
- [ ] Custom hooks — extracting reusable logic — **GAP**: never used
- [ ] `React.memo` / `useMemo` / `useCallback` — performance optimization — **GAP**: never used
- [ ] `useRef` — DOM access and mutable values — **GAP**: never used
- [ ] Portals — rendering outside the parent DOM hierarchy — **GAP**: never used

## Components to Build (reusable UI kit)

- [ ] Cards, buttons, modals
- [x] Navbar / layout shell — `TopNav` + `Sidebar` + `TutorialLayout`
- [ ] Form components (Input, Select, Textarea)

## Project Features (from the README)

- [x] Vite + React + TypeScript scaffold
- [x] Tailwind CSS v4 with the custom dojo theme
- [x] Landing page (hero + About + footer)
- [x] Mobile-responsive layout — the topic list is a burger dropdown below `md`, and padding/headings scale
- [ ] Deploy to Vercel — the version is a running number (**`0.10.0`** today): add `0.01` for each new topic, and match the `HomePage` badge before deploying
- [ ] Framer Motion animations
- [ ] Light/dark theme toggle
- [x] Multi-page routing (React Router v7) — `/`, `/dojo`, `/dojo/topic/:slug` with nested layout route + sidebar
- [ ] Social links (GitHub, LinkedIn) — GitHub is in `TopNav` / `HomePage`; LinkedIn still to add
- [ ] Custom domain

---

_Last updated: 2026-10-07 (all eight lessons verified — no `quiz-passed` or `IN PROGRESS` lines remain)_

**Why `useEffect` is a lecture, not a fix-it exercise.** Probing seven candidate bugs against both gates
left only one that ships clean, and it is one mistake in two shapes. `react-hooks/set-state-in-effect`
rejects the whole derived-state family (`useEffect(() => setCount(prop), [prop])`), and
`react-hooks/exhaustive-deps` rejects every wrong dependency array — including a wrapper handler on the
dependency line. What survives is **cleanup** mistakes, and too little to build an exercise that needs
diagnosis. The rule now written into `CLAUDE.md`: clear a candidate bug against both gates *before*
designing an exercise around it.

**Why event handling was an explainer, not a fix-it exercise.** Its central mistake —
`onClick={handler()}` instead of `onClick={handler}` — cannot be shipped as a planted bug in
this project. TypeScript rejects it (`Type 'void' is not assignable to type
'MouseEventHandler<HTMLButtonElement>'`) and ESLint's `react-hooks/set-state-in-render` rule
rejects it, so it never reaches runtime. A fix-it exercise must compile and lint clean, which
leaves nothing to plant. Verified with a throwaway probe, not assumed. Clearance for the box
came from a three-question quiz instead of a repair.
