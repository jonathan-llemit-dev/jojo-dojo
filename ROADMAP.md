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
- [ ] Event handling — handlers, event objects, passing arguments — quiz-passed, needs a lesson
- [ ] Conditional rendering — ternary, `&&`, early return — **GAP**: `{count && …}` renders a bare `0`
- [ ] Lists & keys — `map()`, why keys matter — quiz-passed, needs a lesson
- [ ] Forms & controlled components — input state, validation
- [ ] `useEffect` — side effects (data fetching, subscriptions, cleanup) — quiz-passed on timing, never written
- [ ] `useContext` / `useReducer` — global state patterns
- [ ] Custom hooks — extracting reusable logic
- [ ] `React.memo` / `useMemo` / `useCallback` — performance optimization
- [ ] `useRef` — DOM access and mutable values
- [ ] Portals — rendering outside the parent DOM hierarchy

## Components to Build (reusable UI kit)

- [ ] Cards, buttons, modals
- [x] Navbar / layout shell — `TopNav` + `Sidebar` + `TutorialLayout`
- [ ] Form components (Input, Select, Textarea)

## Project Features (from the README)

- [x] Mobile-responsive layout — the sidebar collapses to a swipeable strip below `md`
- [ ] Deploy v0.1.0 to Vercel
- [ ] Framer Motion animations
- [ ] Light/dark theme toggle
- [x] Multi-page routing (React Router v7) — `/`, `/dojo`, `/dojo/topic/:slug` with nested layout route + sidebar
- [ ] Social links (GitHub, LinkedIn) — GitHub is in `TopNav` / `HomePage`; LinkedIn still to add
- [ ] Custom domain

---

_Last updated: 2026-10-04_
