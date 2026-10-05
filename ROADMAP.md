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
- [ ] Event handling — handlers, event objects, passing arguments — quiz-passed, needs a lesson
- [x] Conditional rendering — `&&`, ternary, early return — lesson live at `/dojo/topic/conditional-rendering`
- [x] Lists & keys — `map()`, why keys matter — lesson live at `/dojo/topic/lists-and-keys`; fixed and explained (entry 06)
- [ ] Forms & controlled components — input state, validation — **GAP**: never used
- [ ] `useEffect` — side effects (data fetching, subscriptions, cleanup) — quiz-passed on timing, never written
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
- [ ] Deploy v0.1.0 to Vercel
- [ ] Framer Motion animations
- [ ] Light/dark theme toggle
- [x] Multi-page routing (React Router v7) — `/`, `/dojo`, `/dojo/topic/:slug` with nested layout route + sidebar
- [ ] Social links (GitHub, LinkedIn) — GitHub is in `TopNav` / `HomePage`; LinkedIn still to add
- [ ] Custom domain

---

_Last updated: 2026-10-04 (Lists & keys verified and ticked)_
