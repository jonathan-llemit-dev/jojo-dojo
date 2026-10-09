# History

A chronological log of work on this project — what each session changed, and more usefully *why* the
conventions ended up as they did. `CLAUDE.md` holds the current architecture, conventions and next
steps; this file answers "why is it like this?".

Newest first.

---

## Session log

### Every topic was a white belt — belts now mean something, and the reader gets a word (2026-10-08)

**The complaint was the learner's, and it was right on both counts.** Every one of the twelve topics was
`belt: "white"`, so the pill in the corner of every card said "white" and conveyed nothing; and a reader who
had never seen the site had no way to learn what a belt meant, because nothing on any page said. Two further
problems surfaced while fixing it, both invisible until more than one belt was actually in use:

1. **`beltStyles.ts` rendered white and blue identically.** The helpers read
   `belt === "black" ? crimson : ember` — so of the three values in `BeltRank`, two produced the same gold.
   A blue belt would have been indistinguishable from a white one the moment one was assigned. Replaced with a
   single `Record<BeltRank, …>` where each belt owns its level, its name, its badge classes and its dot class,
   because an if/else chain over three values is exactly where the third case gets forgotten.
2. **There was no blue in the palette.** `@theme` has ember, crimson and warm neutrals only, so a blue belt
   had nothing to be. Added `--color-dojo-azure: #60a5fa` — the one cool accent in an otherwise warm palette.

**Black renders as crimson, deliberately.** The page background is `#0f0d0b`; a literally black dot or border
on it cannot be seen. Crimson is the strongest accent the dark palette has, and the belt's *name* still reads
"Black belt" wherever a word is shown. That was the old code's behaviour too — it is now written down instead
of being an accident of a ternary.

**The reader gets a word, and each surface shows the half it needs.** The metaphor is lovely once you know it
and useless before that, so every belt carries a plain-language `level` beside its `name`:

- **topic grid** — the card pill shows the level alone ("Beginner"). "White" told a first-time reader nothing.
- **grid legend** — a key above the cards: `Difficulty: [White belt · Beginner] [Blue belt · Intermediate]
  [Black belt · Advanced]`. Built from `BELT_ORDER`, the same list the cards read, so a belt cannot appear on a
  card without being explained in the key.
- **lesson header** — both: "Black belt · Advanced".
- **sidebar** — only the dot fits, so the dot is now `aria-hidden` and paired with an `sr-only` level. Colour
  on its own says nothing to a screen reader, and the sidebar is where the difficulty curve is most useful.

**The assignments, by real difficulty rather than by age.** White (6): `jsx`, `components-props`, `useState`,
`conditional-rendering`, `lists-and-keys`, `event-handling` — nothing about hook discipline has to hold yet.
Blue (4): `use-effect`, `forms`, `use-state-deep-dive`, `use-ref` — a hook whose *details* bite. Black (2):
`use-context-reducer` and `custom-hooks` — material that combines several ideas or asks the reader to design an
abstraction. Because the registry order is the reading order, the sidebar's dots now rise as you scroll it, so
the curve is visible rather than asserted. The rule for choosing a belt is in `CLAUDE.md`; the per-topic values
are in `NOTES.md`, one `- **Belt:**` line per entry, and deliberately not duplicated anywhere else.

**Verified:** the four gates green; driven in Chrome at 1280 and at 375 — the sidebar rows announce as *"01
Beginner JSX"*, *"07 Intermediate useEffect"*, *"11 Advanced Context & Reducer"*, the legend and the card pills
render, and the lesson header reads *"Black belt · Advanced"*. A class name in the markup proves nothing on its
own, so the compiled stylesheet was fetched and checked for every belt utility: `bg`/`border`/`text` for azure,
muted and crimson all generate real rules.

**No new topic, but a bump anyway: `0.15.0` → `0.16.0`**, on the learner's call. The automatic `+0.01` step is
for topics and this adds none, which makes it a milestone bump like the `0.14.0` UI/UX pass. Every artefact the
"Versioning" section names moved together — `package.json`, **both** `version` fields in `package-lock.json`
(the root one and `packages[""]`, which sit among three *dependency* versions that also read `0.15.x` and must
not move), the `HomePage.tsx` badge, `NOTES.md`, `README.md`, and the `VERSION` / `SHORT` constants in
`scripts/check-repo.mjs` — which is the thing that actually catches a half-finished bump.
**Not committed — the learner makes every commit.**

### Lesson 12 reviewed again — one finding was false, one was right for a reason it missed (2026-10-08)

**A senior-review pass on `custom-hooks` raised seven ranked fixes. Two were rejected with measurement, one
was accepted for a better reason than the review gave, and four were adopted.**

**Rejected: "don't fabricate the ESLint output."** The review claimed the quoted message "concatenates two
separate messages (rules-of-hooks + component-naming)" and that "once for each hook inside" overstates the
rule. Both halves are wrong, and `npx eslint --format json` settles it rather than an argument. A probe file
with a `ticker` function holding `useState` + `useEffect` produced **two** messages — one per call site, line 6
and line 7 — and **both** carry `ruleId: "react-hooks/rules-of-hooks"`. The two "names must start with…"
clauses are part of *that one rule's* single message string, not a second rule reporting alongside it. So the
prose was already accurate. What the fence did lack was the rule id, which is now shown the way the CLI prints
it — that is the only change the finding earned. **The lesson's own numbers were measured, not invented, and
the way to check that is a probe, not a second opinion.**

**Accepted for a different reason: `RenderTally` is gone.** The review called its `textContent` write an
anti-pattern that teaches a bad pattern in a patterns lesson. The technique is *forced* — a ref read during
render is rejected by `react-hooks/refs` and a `setState` in an effect by `react-hooks/set-state-in-effect`, so
displaying a render count has exactly one legal shape — and `use-ref` already demonstrates it deliberately.
The reason that actually decided it is one the review never mentions: **the demo imported `useRef` while the
lesson's prerequisites said "`useState`, and the cleanup half of `useEffect`. Nothing else is assumed."** A
lesson cannot name its prerequisites and then use a hook outside them, and the tally was near-redundant anyway
(six ticks means six renders, and `ticks:` already shows six). Removed, the demonstration still shows the
machinery — `ticks: 6 · every 1000ms` — the sample drops 154 lines to 147, and the contradiction is gone.

**Adopted.** The `rules-of-hooks` section gained the half the name cannot satisfy: *hooks must be called at the
top level of a component or another hook, never inside an `if`, a loop or a callback.* That was a real hole —
the lesson explained the naming rule at length and never said where a hook may be called, which is the other
half of the same rule and the one that bites when a learner writes `if (ready) useTicker(1000)`. Also added: a
sentence that the returned keys stay stable across renders, a forward pointer to `renderHook` from
`@testing-library/react`, and a short "if you have this code in an editor" paragraph naming three edits worth
making (drop `intervalMs` from the deps, swap the updater form and follow the linter, call the hook inside an
`if`). The memoisation aside was split in two and now names the second trigger — a dependency array, not just a
memoised child — and the shared-component aside moved below the interface, where it no longer interrupts
"here is the hook" → "here is what it returns". The speed buttons gained `aria-label`s that begin with their
visible text ("1× speed — one tick per second"), so screen readers get the units without breaking voice
control.

**Two stale claims in `NOTES.md` surfaced while updating the parity number.** The "In progress" section still
said the mirror was **65 of 65** — two revisions out of date, because `check:repo` verifies the parity claim in
`CLAUDE.md` and never looked at this one. And fact 2 of entry 13 still read *"Sharing state between components
is `useContext`'s job"* — **the exact false claim the previous pass removed from the lesson prose and left
behind in the notes.** `useContext` only reads; the state lives above it. Both fixed, along with fact 1 (now
notes that both errors carry the same `ruleId`, and adds the placement half) and fact 3 (the rest row takes
three of five things, not "the three things it needs").

**Verified:** `tsc`, `lint` and `check:prose` green (17 blocks, longest 64 words); `check:repo`
`ALL CHECKS PASSED` with `custom-hooks` at **147 of 147**. Then driven in Chrome, because the gates cannot see
a page: the round clock ticked to `ticks: 4 · every 1000 ms` while the rest row stayed at `0:00`; switching to
10× put `every 100 ms` on both panels; Reset returned the round clock to `0:00` with its button disabled again
while the rest clock carried on to `0:43`; and the speed buttons announced as *"1× speed — one tick per
second"*. The long quoted lint message scrolls inside its `<pre>` (`overflow-x-auto`) rather than stretching the
page. **Not committed — the learner makes every commit.**

### `custom-hooks` revised — accuracy fixes, and a generator that corrupted two lessons (2026-10-08)

**A review of lesson 12 landed a batch of corrections, and one of them was a real bug in my own demo.** Five
things were wrong or weak:

1. **The `useContext` sentence was false.** It said sharing state "is `useContext`'s job". `useContext` only
   *reads* a value; the state still lives in a `useState`/`useReducer` above, or in an external store. The
   paragraph now says all three.
2. **`useStopwatch` was not a stopwatch.** It counted ticks, so pausing halfway through one discarded it —
   toggle every 500ms and the clock never moves. There were two honest ways out: derive elapsed time from
   `Date.now()` timestamps, or stop claiming accuracy. The second was chosen: the hook is renamed
   **`useTicker`**, and the lesson carries a visible **Simplification:** note saying exactly what it does not do
   and how a real stopwatch is built. Timestamp arithmetic plus a resumed-at ref would have doubled the
   concepts in a lesson whose subject is *extraction*.
3. **"Four things" did not match "two `useState` and one `useEffect`."** Now consistently three hooks.
4. **The ESLint message was quoted with its tail cut off**, and the text implied React enforces the prefix. It
   is now quoted in full in a fence, with a line saying React never checks the name at runtime — the prefix is a
   convention enforced by tooling.
5. **The extraction advice was too absolute.** "An indirection you pay for and never collect on" now reads as:
   duplication is the strongest signal, a single-use hook is still fine when it names a concept or hides an
   effect, and the test is whether the callers would change together.

**Then the demo grew a why.** The description now shows the duplicated sequence, then the hook *and* its two
call sites with real code; explains that a shared `<Clock>` component cannot serve two differently-shaped
panels; states the interface as arguments in and return value out; names the stale-closure bug waiting behind
reading `ticks` directly; explains why `if (!isRunning) return;` inside an effect is not a conditional hook
call; and notes that the returned functions are new every render while nothing is memoised. The hook took an
`intervalMs` parameter, wired to a 1×/10× control, so the argument is visible and a reader can test in two
seconds. Accessibility: `useId` + `aria-labelledby` replaced the `aria-label` on each `<section>`, the readouts
are `role="timer"` (a live region that stays silent — a value changing once a tick must never be announced),
buttons got `focus-visible` rings from existing tokens, and Reset is disabled when it would do nothing. The
rest row's status text is deliberately **not** a live region, with a comment saying why: the button beside it
already flips its own label when pressed, and a `role="status"` would say it twice. A small `RenderTally` shows
each clock's render count, written into the DOM from an effect because reading a ref during render is what
`react-hooks/refs` rejects.

**The sample mirror stopped being a hand-rolled ritual.** `scripts/sync:samples` now regenerates any lesson's
`codeExample` from its `demo.tsx`, and leaves an already-matching sample untouched, so running it on a healthy
repo is a no-op. `check:repo` remains the assertion — the generator and the checker are deliberately two
scripts, because a checker that generated its own expectations could not check them.

**And that new generator immediately broke two lessons, which is the part worth remembering.** Its first run
rewrote *every* sample. `check:repo` failed on `conditional-rendering` and `lists-and-keys` — each one line
longer than its demo — and on `custom-hooks` itself. The cause is a rule the checker had been quietly encoding
all along: **a JSX block comment (`{/* … */}`) collapses into a single `{}`-only line**, because a block comment
swallows its own newlines, and the checker strips that line from the *demo* side while expecting the sample not
to contain it. Both older samples had been hand-tuned to omit it; my generator wrote it. Four more lessons
(`components-props`, `event-handling`, `forms`, `use-effect`) had their files rewritten with no visible change —
equivalent after stripping, but pointless churn in a commit. All six were restored with `git checkout`, the
generator learned the residue rule and the "already in sync" skip, and a second full run reported `same` for
every lesson it did not need to touch. **The lesson is the one this repo keeps learning: a generated artefact
needs its generator to encode every rule its checker encodes, or the checker catches the generator rather than
the code.**

**Also fixed while in there:** `check-prose` counted fences as `/^```$/`, so a language tag (` ```tsx `) would
have left three backticks in the text and reported a *false* imbalance. It now accepts ` ```\w* `. `RichText`
already tolerated the tag and ignores it — there is no highlighter and no dependency was added for one.

**Verified:** `tsc`, `lint` and `check:prose` green; `check:repo` `ALL CHECKS PASSED` with `custom-hooks`
measured at **154 of 154** and every other lesson still exact. **Not committed — the learner makes every
commit.**

### Lesson 12 — `custom-hooks`, and a demo flaw caught by re-reading my own reasoning (2026-10-08)

**The next open line was custom hooks**, and it went out as the second **build-on task**: a lecture and a working
demo, with the learner's own hook as the hands-on half. Version `0.14.0` → **`0.15.0`**, twelve lessons.

**The load-bearing fact was probed before the lecture was written.** The claim the lesson needed was that the
`use` prefix is not a style convention, so a throwaway file held a `useState` + `useEffect` sequence inside a
function named `countdown`, and `react-hooks/rules-of-hooks` rejected it twice:

> `React Hook "useState" is called in function "countdown" that is neither a React function component nor a
> custom React Hook function. React component names must start with an uppercase letter. React Hook names must
> start with the word "use".`

That is the spine of the lesson, and it is quoted verbatim in the prose. Worth noting what it is *not*: `tsc` has
no opinion about hook names at all — this is a lint rule, so the linter is the only thing that tells you. Saying
"the compiler enforces it" would have been wrong.

**A flaw in my own first draft, found by re-reading the rule the lesson teaches.** The demo opened as one
`TimerCard` rendered twice, each instance calling `useStopwatch()`. It looked fine and it demonstrated per-call
state — but it did not demonstrate the thing the lesson is *about*. Two instances of one component already share
the code; nothing is duplicated, so the extraction is not earned and the lesson's closing rule ("extract when a
sequence actually repeats") would be illustrated by a demo that contradicts it. **The demo had to be two
different components**: a `RoundClock` built around a big readout and two buttons, and a compact `RestRow` with a
single button. Different markup, different subsets of the returned API, same sequence underneath. The paragraph
that caught it was the one claiming the rest row "takes the three things it needs and ignores the reset" — which
is only true if the two call sites are genuinely different.

**The lesson's three claims, each visible on the page.** One: the sequence lives in one function. Two: a hook is
not a store — every call gets its own state, so starting the round clock leaves the rest row at zero, which the
reader can check in about two seconds. Three: callers see only the return value, so the hook can be rewritten
without touching a call site.

**Shipped and measured.** `demo.tsx` (a `useStopwatch` hook, two consumer components), `index.ts` with a
six-paragraph `longDescription` and a real 87-line mirror regenerated mechanically, the registry entry, and the
seven-place checklist: `CLAUDE.md` tree + counts + parity, `package.json`/lock/badge version, `NOTES.md` entry 13
with the task and its **seven acceptance criteria fixed before the learner starts**, `ROADMAP.md` line marked
`BUILD`, `README.md` structure and roadmap, and `check:repo` moved from 11 to 12 entries with the new parity
claim. `tsc`, `lint` and `check:prose` green; `check:repo` `ALL CHECKS PASSED` with `custom-hooks` measured at
**87 of 87**.

**The build-on task asks for something the demo does not do.** The demo has one hook and two components; the
learner has to write their *own* hook — naming, composition, cleanup and all — and call it from two different
components, with the criteria written down first. Criterion 3 is the one that needs a browser to settle: each
call keeps its own state, shown rather than asserted. **Not committed — the learner makes every commit.**

### UI/UX — the shell gets two scroll panes, and a back-to-top button (2026-10-08)

**The complaint was concrete.** On a long lesson you had to scroll all the way back up by hand, and scrolling
the lesson dragged the topic list off the screen with it. Both are the same root cause: the whole page was one
scroller.

**The shell is now one viewport tall from `md` up.** The `TutorialLayout` root is `md:h-dvh md:overflow-hidden`,
the row under the nav is `md:min-h-0`, and both panes own their scroll — `main` is `md:overflow-y-auto`, and the
sidebar is a fixed-height flex column whose **list** is what scrolls, so the "Lessons" heading stays put while
the topics move under it. Below `md` nothing changed: the page scrolls normally, because a phone wants one
scroller, not two.

`dvh` rather than `vh` on purpose. `100vh` on a phone is the *largest* viewport height — the value with the
toolbars hidden — so a `100vh` shell runs underneath the browser chrome. `dvh` tracks the height as the
toolbars come and go.

**The back-to-top button** fades in past 400px. It listens to `window` and to `main` and takes the larger
offset, so one code path covers both scroll models instead of a breakpoint check; scrolling the scroller that is
not in use is a no-op. While invisible it is genuinely inert — `pointer-events-none`, `tabIndex={-1}`,
`aria-hidden` — because a faded-out button that still takes focus is a trap, and the click honours
`prefers-reduced-motion`.

**One thing was added that was not asked for, and it needed to be.** With the pane as its own scroller, a new
lesson inherits the previous lesson's `scrollTop`, so a long topic opens halfway down — the same annoyance
arriving from the other direction. An effect keyed on `pathname` scrolls the pane back to the top. It rides in
the same commit because the new scroll model made the old behaviour worse, not as scope creep.

**Verified in the browser, and it could not have been verified any other way.** `tsc` and ESLint have nothing to
say about which element scrolls. Read from the DOM rather than inferred: at the top the button is
`aria-hidden="true" tabindex="-1" … opacity-0`; scrolled 1800px it is `aria-hidden="false" tabindex="0" …
opacity-100`; clicking it at 480x760 returned it to the hidden state. Then the two things the CSS claims:

- **the window genuinely cannot scroll at `md`+** — wheeling 800px over the sidebar, whose list fits at that
  height and so has nothing of its own to scroll, moved nothing at all;
- **the panes are independent** — wheeling over the sidebar at a 237px-tall viewport did not move the content
  pane (the button stayed hidden), and wheeling the content pane did not move the list.

Also re-confirmed on the way past: `use-context-reducer`'s sections now expose as
`region "TOTAL MEALS TOTAL CALORIES TOTAL PROTEIN"`, `region "MEAL"` and `region "FOOD LIST"`, so the
duplicate-id repair from the previous session holds in the rendered tree.

**A tooling note worth keeping.** The accessibility tree **prunes `aria-hidden` nodes**, so a hidden button is
simply absent from an `observe` dump and a visible one is present. That makes "is it in the tree?" a reliable
visibility probe — but only once you know it. The first two times this session I read the button's *presence*
as evidence it was still shown, when the truth was a smooth scroll still in flight; reading the element's own
HTML (`html` scoped to its ref) settled it in one call.

**And a host quirk that ate the dev server.** Writing this very entry killed it: the repo sits in a OneDrive
folder, Vite watches the whole project, and OneDrive's save produced a `.HISTORY.md.26944.….tmpdir/HISTORY.md.tmp`
that Vite's watcher hit while it was locked — `EBUSY: resource busy or locked, watch`. Nothing was wrong with the
app; the verification above had already finished. Recorded in `CLAUDE.md` under build tooling so the next
session recognises it instead of debugging the code.

**Version bumped `0.13.0` → `0.14.0`.** `package.json`, both `package-lock.json` entries, the `HomePage` badge
(`v0.14`), the version sentence in `CLAUDE.md`, and the `VERSION`/`SHORT` constants in `check:repo.mjs` moved
together. It is a step **without** a new topic — a deliberate milestone for the shell work, which the versioning
rule explicitly allows ("the learner may also adjust it deliberately") but which nothing in the repo could infer,
so `CLAUDE.md`'s current-state line now says so outright rather than leaving a future session to wonder why
eleven topics sit at `0.14`. **Not committed — the learner makes every commit.**

### `useContext` / `useReducer` — the first build-on task, verified (2026-10-08)

**The hypothesis being tested: does a build-on task produce evidence?** The learner's hands-on half was to write
their own component applying the topic. They did not extend the session card — they built a **second,
independent shared-state feature** beside it: a meal planner with its own `createContext`/`useReducer` pair, its
own `useDiet()` accessor, a six-member action union (`addFood`, `removeFood` with a payload, three draft
updates, `reset`) and three more panels that receive no props. Two stores on one page, each with its own
dispatch, is a stronger demonstration than adding one action to the existing union, because the whole pattern
had to be re-derived rather than extended.

**All seven acceptance criteria pass**, and both gates are green. Verified by driving it in Chrome rather than
by reading it: "Spaghetti" + 500 calories → **Add Food** moved Total Meals 0 → 1 and Total Calories 0 → 500,
the Food List panel showed the row in the same instant — **one dispatch, three sibling panels, no props** — and
**Remove** returned all three to zero.

**The one defect neither gate can see.** The new sections reused the session panels' heading ids
(`rounds-heading`, `technique-heading`, `log-heading`), and `FoodStatsPanel` put `rounds-heading` on all three
of its headings. Duplicate ids are invalid, and `aria-labelledby` resolves to the *first* match in the
document, so the accessibility tree announced the meal panels as `region "ROUNDS"`, `region "TECHNIQUE"` and
`region "SESSION LOG"` — every label pointing at the wrong panel. `tsc` and ESLint are blind to id collisions;
it took looking at the rendered tree. That is the second session running where the browser found something the
gates could not, which is now the argument for the UI pass rather than a nicety.

It was fixed as **reviewer plumbing** — a pure rename to `diet-meals-heading` / `diet-calories-heading` /
`diet-protein-heading`, `diet-form-heading` and `diet-list-heading`, with the stats section labelled by a
space-separated list of its three headings. The learner's own code was otherwise left exactly as written. The
review named three non-blocking nits — a `number` draft that snaps to `0` when the box is cleared, `removeFood`
also wiping the in-progress form, and a `NaN` hole in the `caloriesDraft <= 0` guard — and deliberately did not
touch them, because none of them is a criterion.

**The explained half, three questions anchored in their code — 3/3.** (1) *What happens if `FoodStatsPanel` is
moved outside its provider?* Answered that `useDiet()` gets `null` and throws — which needs both halves of the
rule: the context default is `null`, **and** the accessor refuses it. (2) *What does
`const _exhaustive: never = action;` buy over a plain `default: return state;`?* Answered that it stops
compiling when a new action type has no case, correctly refusing the confusable answer that a `never` check
catches a *typo* — that is the union's job, not the default branch's. (3) *Why does "Reset Meal Plan" leave the
rounds counter alone?* Answered that `dispatchDiet` only ever reaches `dietReducer`: two stores, two
dispatches.

**The build-on task model holds up.** The open question going in was whether a build task gives weaker evidence
than a repair, since there is no planted bug to find. It gives *different* evidence — design and composition
rather than diagnosis — and the code-anchored questions did the same work the fix-it quiz did. What it did not
do is remove the need to look at the page: the defect that mattered here was invisible to both gates and to a
reading of the code.

**Closed out.** Marker `LD` → `OK`, entry 12 rewritten with the evidence and moved into the "Solid" table, the
`ROADMAP.md` box ticked, the sample mirror regenerated mechanically to **376 of 376** lines, and the parity
claim carried into `CLAUDE.md` and `check:repo`. `check:repo` also had its one-liner and README assertions
retargeted to "all eleven verified". **Not committed — the learner makes every commit.**

### `use-context-reducer` — accessibility and correctness pass (2026-10-08)

Five surgical fixes to the lecture, ranked by impact, none of which moved its structure or tone:

1. **Accessibility.** The `TechniquePanel` input gained a real `<label>` ("Technique name" span); the three
   `<h3>` headings are wired to their `<section>` through `aria-labelledby`; and every `<button>` now carries
   `type="button"`.
2. **Description bridged to the code.** The description's snippet now reads
   `const { state, dispatch } = useSession();` instead of a raw `useContext(SessionContext)`, with one
   sentence explaining that `useSession` wraps `useContext` and throws when the provider is missing, so the
   check lives in one place instead of in every panel.
3. **Exhaustiveness made real.** `sessionReducer` gained a `default` branch holding
   `const _exhaustive: never = action; return _exhaustive;` — add an action type and forget its case, and the
   `never` assignment stops compiling. The header comment that claimed "no `default` branch" was updated to
   match.
4. **Split-context rationale reworded** to lead with cause: components that only need `dispatch` do not
   re-render when state changes, because `dispatch` is stable while the state object is not.
5. **A `useMemo` note** records the intermediate fix before splitting contexts.

Two small extras: a sentence explaining why `if (!technique) return state;` is a correct no-op — returning
the same reference is the right signal when an action changes nothing — and `Object.freeze(STARTING_SESSION)`
so the reset target cannot be mutated by accident.

The sample was regenerated mechanically and re-measured at **159 of 159** lines (was 132). `tsc`, `lint` and
`check:prose` green; `check:repo` `ALL CHECKS PASSED`. Still not committed.

### The hands-on exercise becomes a build, not a repair — and lesson 11 ships with it (2026-10-08)

**The learner's call, and it changes the default *kind* of lesson.** Rather than repair a planted bug, the
hands-on half of a topic should be **a component or a feature they write themselves** — after the lecture, on
their own, with the reviewer assessing that code and asking a couple of questions anchored in it. The evidence
standard is unchanged: both halves are still required. Only the shape of the *demonstrated* half changes.

**Why it is the better default from here.** Three reasons, and the first is measurable:

1. **Most of what is left has no plantable bug.** `useRef` needed thirteen probes to establish that, and
   `event-handling` and `use-effect` were converted to explainers after the fact. What remains on the roadmap —
   custom hooks, `memo`/`useMemo`/`useCallback`, portals — is the same shape.
2. **Writing a component is closer to the real work than repairing one.** A fix-it exercise tests diagnosis; a
   build tests whether the concept can be applied somewhere the lecture did not already put it.
3. **It removes a whole class of ceremony** — no planted bug to design, no gate probe to run, no symptoms to
   simulate — from topics that do not benefit from it.

The fix-it exercise is **not retired.** It stays for a topic whose point is diagnosis, and the probe rule still
applies before designing one.

**Where it is written down.** `CLAUDE.md` gains a third lesson kind — *build-on task*, *fix-it exercise*,
*explainer* — with the build-on task as the default, plus a four-rule working agreement: the acceptance
criteria are written down before the learner starts; the task must force the concept to be re-derived rather
than copied; both halves still apply, with the explanation anchored in the code they wrote; and a failed
criterion is named with its line. `ROADMAP.md` gains a `BUILD` status marker for "lecture live, hands-on
outstanding". The evidence standard now says it outright: under a build-on task the lesson's own demo is the
*reference*, and however good it is, it is not the learner's evidence.

**The gates were probed anyway, because the kind had to be chosen between the two.** Thirty-five throwaway
files in `probe-tmp/`, run through the **real root ESLint config** rather than a copy — the mistake that once
silently ignored thirteen probe files — with a clean control plus a tsc-only and a lint-only control to prove
the harness reported anything at all. Folder deleted afterwards; all four gates re-run green.

The finding that settles it for this topic: **`react-hooks/immutability` does not analyse a reducer's own
`state` parameter.** `state.count += 1; return state;` inside a reducer passes both gates, as do
`Object.assign(state, …)`, a nested-field write and `state.items.push(…)`. The same mutation written in a
component — on the state `useReducer()` returned, or on a value `useContext()` returned — is rejected:
*"Modifying a value returned from 'useContext()' is not allowed"*. So a reducer-purity fix-it **was**
available, and this lecture is a deliberate choice rather than a gate failure. That is recorded in the entry so
a future session does not misread it as one.

**Two boundaries were measured, and one of them corrects an overstatement in these docs.**
`react-hooks/set-state-in-render` fires on an **unconditional** `setState` during render (*"Cannot call
setState during render"*) but accepts a **guarded** one — `if (count === 0) setCount(1)` — because that is
React's documented "adjust state during render". It does not fire on `dispatch` at all. `CLAUDE.md` had claimed
the rule kills *every* "called during render" wiring; the wording is now the measured one. The `event-handling`
conclusion is unaffected, because `onClick={handleReset()}` is unconditional and `tsc` rejects it regardless.

Rejected by `tsc`, for the record: an unguarded nullable context value (`TS18047`), a provider value missing a
promised member (`TS2741`), a typo in a `case` label against a union action type (`TS2678`), a reducer
returning a state with a missing field (`TS2741`), and `{ items: state.items.push(x) }` (`TS2322`).

**Lesson 11 — `use-context-reducer`, the first build-on task.** A dojo session card: a `useReducer` owns
`{ rounds, draft, log, nextId }`, a `createContext` publishes `{ state, dispatch }`, and three panels — rounds,
technique, session log — read it with `useContext` while receiving **no props at all**. The action type is a
discriminated union with no `default` branch, so a new action is a compile error until the reducer handles it.
Version `0.13.0`; registered with one registry entry and no new routes.

The hands-on half is deliberately shaped so it cannot be satisfied by copying the demo: add a **fourth panel**,
in a different part of the tree, dispatching **a new action type** the reducer does not yet handle, taking zero
props. Seven acceptance criteria are written into `NOTES.md` entry 12 *before* any of it is built — the
journal's oldest lesson, *name the expected values*, applied to a build task instead of a repair.

**Two things in the tooling had to move with it.** `check:repo` hardcoded `10` entries, `10` folders, the
version in four places and the parity-claims map. The version is now a single `VERSION`/`SHORT` constant, and
the marker check became **status-aware**: it no longer demands that every marker read `OK`, it demands that any
non-`OK` marker is *named in* `NOTES.md` and `ROADMAP.md`. That is the check the old version could not express —
a lesson may legitimately be live and unfinished, so the script now asserts *agreement with the docs* rather
than "everything is finished".

**Verified:** `npx tsc -p tsconfig.app.json --noEmit` and `npm run lint` green; `npm run check:prose` clean on
all eleven, longest block still 67 words in `use-ref`; `npm run check:repo` `ALL CHECKS PASSED`, with
`use-context-reducer` measured at **132 of 132** lines — the longest sample in the repo, regenerated
mechanically from the demo rather than retyped. Not committed: **the learner makes every commit.**

### Roadmap narrowed to React + TypeScript; three project chores removed (2026-10-07)

**The learner's call, and it corrected a long-standing wrong assumption in these docs.** Three roadmap items
had been sitting open for many sessions — **Deploy to Vercel**, **Social links (GitHub, LinkedIn)**, and
**Custom domain** — and the deploy line in particular had been carried as "the top priority" in
`CLAUDE.md`'s objectives for at least three sessions. All three turned out to be settled or unwanted:

- **Vercel** was never pending. The site has been deployed since the first commit and every push to `main`
  publishes automatically at <https://jojo-dojo.vercel.app/>. Nothing was scheduled; the docs had simply
  never recorded that it was already done.
- **Social links** — the GitHub link in `TopNav` is enough, as a pointer for readers. No LinkedIn.
- **Custom domain** — not happening. The Vercel URL is the address.

**The instruction:** the roadmap should cover **pure React and TypeScript topics only**. So the whole
`Project Features` section came out of `ROADMAP.md`, not just those three lines. It had been a chore list
(Vite scaffold, Tailwind theme, landing page, mobile layout, routing, animations, theme toggle) mixed in with
study topics, and it was the wrong thing to keep in a file whose purpose is tracking what has been *learned*.
Checked-off chores are not progress a reader cares about, and leaving them invited more of the same.

**What replaced it:**
- `ROADMAP.md` now opens by stating the scope, and records these three decisions explicitly so a future
  session does not helpfully re-add them.
- The **remaining open React topics are ordered and complete**: `useContext`/`useReducer`, custom hooks,
  `React.memo`/`useMemo`/`useCallback`, portals — plus the lazy-initialiser gap from lesson 10.
- A new **"Later — not now"** section holds **Redux** and **Next.js**, which the learner mentioned as possible
  future interests. They are recorded as deliberately unscheduled rather than forgotten — and the Next.js
  entry notes the concrete reason it does not fit yet: this site has no server, so React Server Components do
  not apply to it.
- `Components to Build` kept only its unchecked items and gained a line saying *why* it is on a React
  roadmap: it is practice in composition, props typing, `children`, and controlled inputs as a reusable API.

**Docs updated to stop claiming deployment is work:** `CLAUDE.md`'s project overview ("Vercel-ready" →
already live), its deploy note, and its objectives list, which no longer has a deploy entry at all. The
README's *Deploying to Vercel* section — a full step-by-step "Option A / Option B" guide for connecting a repo
— was replaced with a short Deployment section stating the site is live, keeping only the one detail worth
preserving for a fork: why `vercel.json` must be a **rewrite** and not a redirect. That reasoning had cost a
previous session real debugging and was worth not throwing away with the instructions around it.

**Also worth recording:** the version-bump convention survives all of this unchanged. The version is a running
`+0.01` per new topic — not tied to deploys, and not reset by this policy change.

### `useRef` cleared on the third pass — a misconception that needed contradicting, not correcting (2026-10-07)

**The box is ticked, and it took three passes.** The *demonstrated* half was never in doubt: the demo (a DOM
ref focused on mount, a `{ renders, lastReps }` tally written by an effect and read by a handler), the
Escape-to-close in `Sidebar.tsx`, `tsc` and `npm run lint` green, and the Sample Code panel a true mirror at
**77 of 77**. What took the work was the *explained* half.

**The misconception, stated exactly, because it is the whole story.** The learner believed a ref is
**uninitialised until an effect runs** — that the argument to `useRef` is a recipe for a value rather than the
value itself. It is not: `useRef(1)` produces `{ current: 1 }` during the very first render. What genuinely
starts `null` is a **DOM** ref's `.current`, because React has not attached the element yet — a different
cause that was being folded into the same belief. (There was a second, unrelated slip along the way: an
*omitted* dependency array mistaken for an empty `[]`, which is the `useEffect` confusion read backwards and
is now a cheat-sheet row.)

**What did not work: repeating the correction.** The learner said "refs aren't initialised until effects run"
on two separate attempts, with a correct answer to a different question in between. Stating the fact again
changed nothing.

**What worked: laying the answer against their own earlier wording.** They had, at one point, accepted the
phrase *"the ref is one render behind"*. So the contradiction was put to them directly — **a box that holds
nothing cannot be one render behind** — and that did more than the correction had in two rounds. The next
question ("what is `useRef(1).current` during the first render, before any effect?") was then answered
correctly, and the one after it gave the *mechanism* rather than the rule: a render can be repeated or
discarded, so a render-time read may come from a pass that never reached the screen.

**The transferable lesson, and the reason this is written down.** When a wrong belief survives a plain
correction, correcting harder is not the move — find the learner's own words that the belief cannot coexist
with, and let the contradiction do the work. The one question that had to be *voided* is part of the same
lesson: the first attempt at the read-side question was tangled enough that the learner asked for it to be
clarified, which is a fair response to a badly-formed question. Rewritten as a walkthrough of real code, it
worked.

**Recorded honestly in `NOTES.md`:** entry 11 carries the full eight-question run, wrong answers included,
and flags the initial-value point as the one to re-test in a future review — it took deliberate effort to
dislodge and is the kind of belief that can quietly return.

### The descriptions had gone "pure AI" — all ten rewritten (2026-10-07)

**The learner's note.** *"I see your long descriptions hard to understand… your explanation sounds like pure
AI, no humanity in it, no compassion, no consideration that there're maybe some other people that will read
it."* They said they understood it personally — the complaint was about everyone else who would land on the
page. It was correct, and it applied to lessons they had already passed, not just the new one.

**The first measurement was a trap, and worth recording on its own.** Flesch reading ease was run across all
ten descriptions, expecting the numbers to confirm the complaint. They did the opposite: `use-ref` scored
**81** — the *easiest* of the ten. Flesch counts word and sentence length, so it is blind to the thing that
was actually wrong, which was **abstraction**. Had the score been believed, the session would have
"verified" that the prose was fine.

**So a second audit measured what matters** — longest paragraph, paragraphs over 60 words, editor-tics
("worth naming", "is not defensive noise", "the rule that keeps X honest"), abstract nouns, and
narrating-the-document. The pattern was clean and it was a trend, not noise:

| Lesson | Longest paragraph | Blocks over 60 words | Editor-tics |
| ------ | ----------------- | -------------------- | ----------- |
| `use-state-deep-dive` | **146 words** | 2 | 1 |
| `use-ref` | **114 words** | 4 | **8** |
| `use-effect` | 97 words | 5 | 5 |
| `use-state`, `jsx`, `forms` | 55–59 words | 0 | 0 |

**The three worst were the three written most recently.** The early short lessons were fine; the prose got
worse as it got more confident. `use-ref` — the lesson the learner had just flagged — had by far the most
tics.

**The four faults, named:**
1. **Announcing instead of explaining.** "Two jobs come out of it, and they are worth naming separately"
   promises insight and delivers none.
2. **Hollow one-liners.** "That optional chaining is not defensive noise." "The rule that keeps refs honest."
   They read as wisdom and contain nothing actionable.
3. **Rules before any reason to care.** The old `use-ref` opened on "returns a single object with one
   property, `current`" — a fact with no problem attached.
4. **Hedges that blame the reader.** "a consequence worth expecting rather than debugging" implies they
   would have got it wrong.

**What replaced them, in one comparison.** Before: *"React does not watch a ref. Writing to `.current`
schedules no re-render, so a number the screen depends on would sit there out of date."* After: *"If you
keep a score in a ref and show it on screen, you can add a point and watch the screen hold the old number.
Anything the user can see belongs in `useState`."* Same fact, one concrete consequence, no announcement.

**Two findings beyond the voice.** The two oldest lessons (`jsx`, `use-state`) were in an entirely different
register — encyclopedic rather than instructional. `jsx` opened with *"a syntax extension for JavaScript that
allows you to write HTML-like code"*, which is a dictionary definition, and it listed "components can be
defined as functions or classes", which is not true of this project and not useful to a beginner. Both were
rewritten to start from what the reader will actually meet. And `event-handling` said the same sentence
twice — "never reaches the browser", once before the TypeScript block and once after it — with a stale
duplicated comment in its `index.ts` as well. Both removed.

**Verification, not vibes.** A `prose-check` script enforces the RichText safety rules (balanced backticks,
even code fences, no risky asterisks) *and* the hard voice limits (70 words per block, max 2 tics, 0 hollow
phrases), measuring each bullet separately since a reader meets bullets one at a time. All ten now pass with
zero safety and zero voice failures, and the longest block anywhere is **67 words** — down from 146. The
lesson `codeExample` mirrors were re-verified afterwards and every one is unchanged
(`use-ref` still 77 of 77, `use-state-deep-dive` still 114 of 114), so no sample moved while the prose did.
`tsc` and `npm run lint` green throughout.

**Three errors in the tooling itself, all caught by output rather than by review.** The first checker
collapsed the source's line wrapping and then reported phantom double-spaces; the `longDescription`
extractor searched for a `//` comment to find the end of the string, which truncated any lesson whose prose
contains a fenced code block; and the same extractor only matched double-quoted strings, so `components-props`
— which uses single quotes for its fence — silently lost a chunk of text. Each wrong version produced
confident, plausible numbers. The fourth pass was right, and the fix was to bound the value at the
`codeExample:` key and match both quote styles.

**A new convention, written into `CLAUDE.md`:** *write to a person, not to a compiler.* Open with a
situation rather than a definition, use "you", never announce the explanation, keep every block under 70
words, and prefer a concrete consequence to an abstract claim. The Flesch trap is recorded there too, so a
future session does not repeat the mistake of measuring the wrong thing and concluding the prose is fine.

### `useRef` — probed first, and the probe is why it is an explainer (2026-10-07)

**The instruction was to clear the gates before promising a fix-it exercise**, because `use-effect` had
already been forced into a lecture by exactly this problem. That was the right call, and it paid off harder
than expected: thirteen candidates were probed in an isolated harness, and **seven were rejected**.

| # | Candidate bug | Killed by |
| - | ------------- | --------- |
| 01 | ref written during render to memoise a derived value | `react-hooks/refs` |
| 02 | ref used where state belongs, read in JSX | `react-hooks/refs` |
| 03 | DOM ref passed to a function component | `tsc` **TS2322** |
| 04 | DOM ref read in a handler with no null guard | `tsc` **TS18047** |
| 05 | the "latest value" ref trick, written during render | `react-hooks/refs` |
| 06 | timer handle kept in `useState` | `react-hooks/set-state-in-effect` |
| 07 | ref callback returning a value | `tsc` **TS2322** |

**The rule's boundary was measured, not assumed.** One control file read `ref.current` in the component
body and was rejected; an otherwise identical file reading the same ref only in an effect and a handler
passed. **Body or JSX → rejected, effect or handler → allowed.**

**Why that makes the exercise impossible rather than merely awkward.** Every `useRef` mistake with an
*observable symptom* has one shape — a ref value reached the render — which is precisely what
`react-hooks/refs` rejects. So a bug that passes both gates has **no symptom**, and an exercise with no
observable symptom fails this project's own rule that a planted bug must name its expected values and show
simulated symptoms. What passed both gates was either correct code or a mistake that is not about `useRef`:
a keydown listener with no cleanup (the same one-in-two-shapes bug that already made `use-effect` a lecture)
and a ref incremented in a handler but never displayed, invisible by construction. **This is a stronger case
than `use-effect`, which at least had one shippable mistake.**

**The probe harness had two bugs of its own, both worth remembering.** ESLint ignores dotfolders, so
`probe-tmp/` had to lose its leading dot — and **`globalIgnores` in the probe config listed the probe folder
itself**, which silently made every probe file "ignored" and would have reported a clean bill of health for
thirteen files nothing had read. Copying the real config's ignore list is what did it.

**The lesson shipped as an explainer with a build task, per the learner's choice.** The *demonstrated* half
is the Escape-to-close that `Sidebar.tsx` had been deferring in its own header comment since the `useEffect`
session: a DOM ref focused on open, a keydown listener, and a real unsubscribe — plus `currentLabel` in the
dependency array because the effect body reads it.

**It is *not* ticked yet, and that is the standard working.** The first draft of these records said `useRef`
was verified, which was wrong: the *explained* half is the learner saying the rule in their own words, and
that had not happened. The records were corrected before anything was announced — marker set to
`RV (Reviewing)`, roadmap box left unticked with `IN PROGRESS`, the entry moved off the "Solid" table into
"In progress", and the one-line state changed to *nine verified, one pending*. Writing "verified" into the
notes because the code is finished is exactly the failure `CLAUDE.md` names first: **do not tick a box
because a lesson file exists.**

**The questions were then asked, and the topic stayed open — correctly.** Four questions, two right:

| # | Question | Result |
| - | -------- | ------ |
| 1 | A handler sets `tally.current = 5` and nothing else — what does the screen show? | **Correct** — "keeps showing the old value, because a ref change never causes a re-render". The render-side rule is in place. |
| 2 | Why is *reading* `ref.current` during render wrong, even if never displayed? | **Wrong** — "refs are not initialised until effects run, so the read is always undefined or null". The ref object exists from the first render; what starts `null` is a DOM ref's `.current`. The real reason is timing, not initialisation. |
| 3 | `useEffect` with **no** dependency array — how many runs? | **Wrong** — "0, because an empty dependency array means the effect only ever runs once", conflating an *omitted* array with an *empty* one. |
| 4 | `useEffect(fn, [])` versus `useEffect(fn)` — how often does each run? | **Correct** after feedback — "once, and after every render". |

**Q3 is the same rule as the `useEffect` session's wrong answer, read backwards.** There, an empty `[]` was
believed to re-run when a value changed; here, an omitted array was believed to run once. Both invert the
truth that **`[]` restricts and omitting the array does not**. A new cheat-sheet row records it, since this
is now the second time the dependency array has produced a wrong direction rather than a wrong detail.

**What remains owed is one question**, not a lesson: the read-side reason — timing and shared mutable state,
React rendering twice or discarding a render, and a DOM ref being written after the render returns. The box
stays unticked until that answer lands.

**Two of my own errors were caught by the checks rather than by review.** The probe harness listed the probe
folder in `globalIgnores`, which silently ignored all thirteen files; and the same class of mistake that
`CLAUDE.md` documents — a regex that lies — reported the new lesson's parity as 62 and then 75 before a
character-walking stripper found the real figure, **77**, after a later edit split the demo's effect in two.
Every number in the docs is now the measured one.

**The teaching point the gates leave behind:** the "latest value ref" escape hatch for dodging a stale
closure, still recommended by plenty of tutorials, is unavailable in this project — and not arbitrarily. A
ref the render depends on is a ref the render will show stale.

**Repo verification first, and it found no drift.** Both gates were green at the start; a script confirmed
nine lessons, nine folders, nine unique slugs, `0.11.0` in all three version fields, `v0.11` once in
`HomePage.tsx`, every file named in the `CLAUDE.md` tree on disk, and **every parity number in `CLAUDE.md`
exactly** — including `use-state-deep-dive` at 114 of 114.

**And the parity checker nearly repeated a documented mistake.** My first attempt used a regex for the
`codeExample` template literal, which truncated at the first escaped `` \` `` and reported four lessons as
"sample 0 lines" and the deep dive at **110**. CLAUDE.md warns about exactly this. The fix was a
character-walking extractor plus a character-walking stripper, and the docs turned out to be right all
along. Then the same discipline caught my *own* error: I wrote **62** for the new `use-ref` count in
`CLAUDE.md` without measuring it, and the check printed **75 of 75**. A later edit split the demo's single
effect in two, which moved the real figure to **77**, and the docs were corrected again from the measured
output rather than from memory. The number in the doc is now the measured one.

### The browser gap closed, and a lesson page caught printing its own asterisks (2026-10-07)

**For the first time, a lesson demo was driven in a real browser.** Every prior session had type-checked its
work and reasoned about the runtime; none had *seen* it. Installing the browser-automation stack closed that:
`bsk` 0.3.2 is at `~/.local/bin/bsk.exe`, **SHA-256 verified against the vendor's published manifest**
(`b773c443…7eab`), `bskPath` pinned in the DSH profile's `cordis.patch.yml`, and the BrowserSkill extension in
Chrome.

**Four host obstacles, all worth recording:**

1. **No Rust toolchain and no bundled `bsk`** — the CLI had to be installed, not built. `irm | iex` was not
   run blind: the installer was fetched and read first, and then the release zip was downloaded directly so
   the checksum could be verified independently.
2. **This machine's schannel is broken.** `curl` and PowerShell both fail against *any* HTTPS host with
   `schannel: AcquireCredentialsHandle failed: SEC_E_NO_CREDENTIALS`. **Node's `fetch` works**, so every
   download went through `node -e "fetch(...)"`. A future session that reaches for `Invoke-WebRequest` will
   conclude the network is down when it is not.
3. **`--foreground` was the wrong flag.** The daemon reported `daemon ready` and then died every time. Its own
   help text explains why: foreground mode is *"owned by the current terminal or supervisor"*, and every
   process the agent spawns belongs to a job object the host reaps. **Plain `bsk daemon start` works.**
4. **A sandboxed shell cannot reach the daemon's named pipe** (`Access is denied`, os error 5) — documented
   confinement, not a fault. `bsk doctor` from the agent therefore reports FAIL rows that are lies; the
   plugin's own calls are unaffected. Diagnosing this needed the daemon's log at `~/.bsk/daemon.log.<date>`,
   which is the only place the real story appears.

**What the browser verified — clicking, not reasoning.** On `/dojo/topic/use-state-deep-dive`: "Log two reps"
moved the counter **0 → 2 → 4**; "Add technique" grew the list **2 → 3**, added the typed row, and cleared the
box; a row toggle flipped to "Drilled"; "Reset" returned the list to its original two. Console clean apart
from Vite's HMR and a `chrome-extension://invalid` line belonging to the extension itself. **The Reset bug the
learner reported is confirmed fixed on screen** — the same bug that had cost a round of diagnosis, now
verified at the pixel level.

**One real defect, and it was mine.** The rendered page showed literal asterisks:
`**replace, do not mutate**` and `*different*`. `RichText` supports exactly five things now, but it supported
four — inline backticks, fenced code blocks, `- ` bullets, and paragraph breaks — and **never** emphasis. The
`**` markers came from my own prose in the previous session.

**The worst part is that the docs had already warned me.** A previous session hit the identical problem on
`use-effect`, wrote it up in this file, and — because `RichText` had no emphasis rule — **banned emphasis in
descriptions** and added a sweep to police it. I wrote `**bold**` into a new lesson anyway. That is the
argument for fixing causes rather than enforcing workarounds: a rule that says "never do X because the tool
can't" is a trap with a delay on it, and the delay expired.

**Fixed properly, at the cause:**

1. **Emphasis added to `RichText`** as rules 4 and 5 (`**bold**`, `*italic*`), so the markup is expressible
   instead of forbidden. Inline code is split out **first**, so an asterisk inside backticks stays literal —
   `setReps(reps * 2)` keeps its `*`. Bold is attempted before italic, because `**` also opens a `*` run, and
   an unmatched single `*` is left exactly as written rather than half-consumed.
2. **Verified in the browser, not just in the type-checker:** the accessibility tree now reports real
   `<strong>` and `<em>` nodes — `replace, do not mutate`, `the updater form`, `Two setters in one handler.`,
   `the same array`, `passed as`, and the numeral `1` — and the screenshot shows the asterisks gone.
   `tsc` and `npm run lint` both green.
3. **The ban is replaced by the capability**, and `CLAUDE.md` records *why* — including that the previous
   workaround was the wrong call.

**Method note worth keeping:** the session's first instinct was to verify by reasoning, and reasoning is what
missed this. The asterisks had survived a type-check, a lint pass, a parity diff and a self-review. They took
about four seconds to spot in a screenshot. **Look at the thing.**

### The lesson pages were narrating their own authoring — reader-facing cleanup (2026-10-07)

**The learner's call, and it was right.** "When a topic is totally completed by me we should remove statements
like *This lesson shipped as a fix-it exercise and is now fixed* … on other readers' POV it's just a simple web
page with lectures and sample code. They don't have to know that I made it as a fix-it exercise for myself."

**What was leaking.** Five reader-facing passages — not the one that was noticed:

- `use-state-deep-dive` — "This lesson shipped as a fix-it exercise and is now fixed. The demo and the sample below are the same component."
- `lists-and-keys` — "This lesson shipped as a fix-it exercise and has now been fixed…"
- `event-handling` — "That is why this topic **has no fix-it exercise**: the convention for one requires the planted bug to compile and lint clean."
- `forms` — "This lesson shipped as a fix-it exercise and is now fixed…"
- `use-effect` — "This lesson ships as a working reference rather than a fix-it exercise, because the two biggest `useEffect` mistakes here are rejected by the gates…"

The `event-handling` and `use-effect` ones were the worst of the set: they justified a lesson's *existence* by
an internal rule, which reads as a note-to-self rather than a tutorial.

**Rewritten, not deleted.** Each carried a real teaching point, so the point stayed and the process went:

| Lesson | Kept |
| --- | --- |
| `lists-and-keys` | that the list is keyed by id, so state follows the item — plus the observation that made it click (press Done, then Rotate) |
| `event-handling` | that the mistake never reaches the runtime because `tsc` and ESLint catch it as you type |
| `use-effect` | the two named traps themselves — derived state through an effect, and a dependency array that lies — spelled out instead of pointing at a module comment |

Nothing was lost from the record: all of it already lives in `NOTES.md`, `ROADMAP.md` and this file, which is
where it belongs.

**Also trimmed: every `demo.tsx` header.** Eight files still opened with `FIX-IT EXERCISE`, an `OBJECTIVE`, the
symptoms that used to exist, or an argument about why the lesson could not be an exercise. None of that is
*shown* to a reader — the Sample Code panel strips comments — but it was stale internal commentary, and
`forms` still listed "the two planted bugs" months after they were fixed. Each header is now a topic marker
plus a short paragraph on the rule the demo illustrates. `use-state-deep-dive`'s `Status` line was also wrong:
it still read "verified by quiz, free-text explanation still owed", written before that explanation arrived.

**A new convention, written into `CLAUDE.md`:** *the reader is a stranger, not the learner.* Anything a visitor
can see must read as an ordinary tutorial page — no authoring history, no convention names, no reasoning about
`NOTES.md` or `CLAUDE.md`. Those belong in the maintenance documents. A description that justifies a lesson's
existence by an internal rule is now a defect, not documentation.

**Two parity counts in `CLAUDE.md` were wrong, and finding out why took three attempts.** Verifying the trim
meant re-running the snapshot/demo diff, and my first two checkers both lied:

1. **v1 started the strip at "the first `import`"** → `jsx/demo.tsx` has no import, so it stripped to **zero
   lines** and reported a false `EXACT MIRROR` for a file it had not read at all.
2. **v2 removed only `//` lines** → every JSDoc block counted as code, inflating each demo by 8–10 lines, so
   almost every lesson looked broken.
3. **v3 walks characters and tracks block-comment state explicitly** → the numbers reconciled.

With a correct checker the real counts are `conditional-rendering` **64** (not 65) and `lists-and-keys` **63**
(not 64) — both sample counts were right, and both still match once the documented one-line `{}` residue from
a stripped multi-line JSX comment is set aside. Every other figure held exactly. `CLAUDE.md` now carries the
corrected numbers and a warning about how easy it is to write a checker that lies.

**Verified:** `tsc` and `npm run lint` green throughout, and a sweep of `src/` for `fix-it`, `shipped as` and
`planted bug` now returns nothing.

### `useState` deep dive — verified, after one word was pinned down (2026-10-07)

**The box is ticked.** The exercise was fixed earlier in this session; the last thing owed was the
*explained* half. Asked in their own words why `setReps(reps + 1)` written twice stores 1, the learner said it
reads "the current value of state when it was last rendered, [so] every entry of `setReps(reps + 1)` is just
the same reference of the previous value + 1, not the updated value + 1" — the snapshot mechanism, correctly.

**Why that answer was probed instead of accepted.** It used the word "**reference**", and in this journal
that word is already taken: it means object *identity*, the thing React compares to decide whether to
re-render. A stale number has no reference to be stale. If those two ideas blur, the double-setter bug and
the `[...current]` immutability bug start to look like the same bug, and they are not — one is about a
captured value, the other about a value's identity. Rather than let an ambiguous word sit in the record, the
distinction was put to them directly and then tested on a fresh case: `setReps(reps + 2)` twice from `0`
gives **2**, not 4, because both lines read the same render's value. A shared-reference reading predicts 4.
They answered 2, from the snapshot rule, so what they meant is now settled and the explanation stands.

**Recorded as verified, with the ambiguity written down rather than smoothed over.** The alternative — tick
it quietly and move on — would have put a correct box on top of a fuzzy idea, which is the failure mode the
evidence standard exists to prevent. The probing cost one question and removed the doubt.

### `useState` deep dive — fixed, quiz-confirmed, and left deliberately un-ticked

1. **The three bugs were fixed by the learner, and verified as fixed.** `setReps((reps) => reps + 1)` twice
   for the double setter; a new object built outside the setter and added with
   `setTechniques((techniques) => [...techniques, newTechnique])`; `techniques.slice().sort(...)` for the
   sort; and `[...STARTING_TECHNIQUES]` for Reset. `npx tsc -p tsconfig.app.json --noEmit` and
   `npm run lint` both pass, and no in-place mutation shape remains in the file.

2. **A misconception caught mid-exercise, and the reason it matters.** After fixing the sort, the learner's
   note on the add handler read "nothing to fix here" — they had stopped treating the add as a bug once its
   sibling was repaired. The add was still mutating in place. **Fixing one member of a bug family does not
   fix the family**: the three handlers shared one root cause and each needed its own fix. Corrected on the
   next pass with no location hint, so the diagnosis was still theirs.

3. **"Reset still isn't working" was reported, and Reset was never a separate bug.** It had always been one
   more *symptom* of the same mutation family — `splice` in place, then hand the setter the same array — and
   it was fixed by the same move as the others. It *looked* broken because the add handler was still broken,
   so nothing on the list ever re-rendered. Worth recording because it is the same shape as bug C hiding
   behind bug B: **when several bugs share a root cause, the survivors produce symptoms that look like new
   bugs**, and the fix is to finish the family rather than chase the latest symptom.

4. **The Sample Code panel was swapped from the fix-it exception to a true mirror.** Regenerated
   mechanically from the fixed demo rather than retyped, with backticks and `${` escaped, and the parity
   check re-run rather than eyeballed: **114 of 114** lines exact. All eight other topics re-measured exactly
   as documented in the same run. `CLAUDE.md`'s exception note was updated, since no lesson is in the
   fix-it state any more.

5. **Every marker written for the broken state was rewritten.** The topic marker went `LD` → `OK`, the file
   header went from "three planted bugs" to the rule that explains them, and the three `BUG A/B/C` handler
   comments became explanations of the correct pattern. A lesson that still *describes itself* as broken is
   the same class of drift as a stale count — the code was right and the commentary was not.

6. **The box was deliberately NOT ticked — this is the entry's real content.** The repair satisfies the
   *demonstrated* half, and the mechanism was then confirmed by a 2/2 quiz: that both `setReps(reps + 1)`
   lines read the render's own snapshot and compute the same number, and that the updater form works because
   a *function* is queued and handed the previous result (explicitly rejecting the near-miss that says a
   function "skips batching"). The learner chose the multiple-choice route over free text, so by the
   journal's own standard this is **`quiz-passed`, not verified** — the roadmap line carries that status, the
   snapshot records it, and one own-words answer upgrades it. Recording a near-miss as a pass would be the
   exact softening the standard exists to prevent.

### `useState` deep dive — audit, three-bug exercise, and a gate that closed a whole family of bugs

1. **Docs audit before building.** `npx tsc -p tsconfig.app.json --noEmit` and `npm run lint` both pass on
   arrival. The version chain was consistent (`0.10.0` in `package.json`, both `package-lock.json` entries,
   and the `v0.10` badge). All eight lesson folders were wired into the registry and named in all four docs.
   The recorded parity claims were re-run through a script rather than eyeballed and **all eight held**:
   `components-props` 46/46, `event-handling` 105/105, `forms` 53/53, `use-effect` 64/64 exact;
   `conditional-rendering` 63/63 and `lists-and-keys` 62/62 with the one-line `{}` residue each; `jsx` 9 with
   the leading `export` omitted; `use-state` 38 → 11 trimmed by design.

2. **One real drift found — and it made the gap look bigger than it is.** `CLAUDE.md`, `NOTES.md` and
   `ROADMAP.md` all claimed *every* `useState` in the repo holds a primitive. It does not: `lists-and-keys`
   holds an **array of objects** (`useState<Exercise[]>(EXERCISES)`), `event-handling` holds an array of
   objects plus a `string | null`, and `event-handling` and `use-effect` **already** call two setters in one
   handler. The claim was corrected in all three files rather than being worked around, and the real gap is
   now stated precisely: **object-field replacement**, **lazy initialisers**, and **calling the same setter
   twice**. A pre-existing count error was corrected at the same time — `CLAUDE.md` still read "eight lessons
   registered and all eight verified" while the same file also said the completed `forms` was the most recent
   fix-it.

3. **Probed the candidate bugs against both gates *before* designing the exercise — and it changed the
   design.** Two throwaway probes, deleted afterwards:
   - **Rejected:** the obvious object bug. ESLint's **`react-hooks/immutability`** rule refuses *every* shape
     of writing a field on object state — direct (`student.name = …`), through an alias
     (`const next = student; next.name = …`), through a nested field, inside a component-local function, and
     `Object.assign(student, …)`. Five shapes, five rejections. An earlier assumption that the rule only
     caught the direct form was **wrong**, and the probe is what caught it.
   - **Survives:** array *methods*. `list.push(…)` and `list.sort(…)` are silent to that rule — it looks for
     property writes, not method calls. `setReps(reps + 1)` twice in one handler also passes both gates, and
     so does an eager `useState(buildPlan())`.
   - Also confirmed by tsc: mutating an array *without* calling its setter fails `noUnusedLocals`
     (TS6133 *'setTechniques' is never read*), so the planted array bug has to hand the setter back the same
     array rather than omit the call. Both bugs were reshaped to satisfy that before shipping.

4. **Shipped `use-state-deep-dive` at `/dojo/topic/use-state-deep-dive`** — a training card with three
   planted bugs: `push` then `setTechniques(list)` (same array, no re-render), `sort` then
   `setTechniques(list)` (same), and `setReps(reps + 1)` twice (collapses to +1). The marker is `Status: LD`,
   the header lists **symptoms and expected values only**, and `tsc` + `npm run lint` are both green with all
   three bugs in place. Version bumped `0.10.0` → **`0.11.0`** across `package.json`, both lock entries and
   the badge (`v0.11`); `README.md` structure and Roadmap, `ROADMAP.md`, `NOTES.md` entry 10 and the traps
   table, and `CLAUDE.md` all updated.

5. **The symptoms were simulated, not described — and the first draft was wrong.** A throwaway Node script
   modelled the component (state persisting across renders, a setter given the same reference bailing out, a
   handler reading the state from its own render) and ran both the buggy and the fixed version. It caught
   two errors in the drafted header:
   - The draft claimed "Add technique" *works once, then stops*. It never works at all: the rows stay at 2
     however many times it is pressed.
   - The draft did not know that **bug C is hidden behind bug B**. Sorting an array that never grows looks
     like nothing happening; the real symptom only becomes visible after B is fixed. The header now says so,
     and the simulation output is what the expected values were read from.
   Against the real seed order, the fixed version gives reps `2 → 4 → 6`, list `2 → 3 → 4`, sort
   `Elbow, Front, Knee, Roundhouse`, and Reset back to the original two — all reproduced.

6. **Sample Code is the fix-it exception, and its size is now measured.** The panel teaches the four correct
   handler patterns (the three the demo needs, plus the object-spread replacement the lesson could not ship
   as a bug). Per the convention it does **not** mirror the buggy demo: 21 stripped sample lines against 118
   stripped demo lines, recorded here so the mismatch is not mistaken for drift later. All other eight
   topics still measure as they claim.

7. **Noted for the fix-it convention:** `react-hooks/immutability` is now the fourth rule on the list of
   gates that decide whether a topic can be an exercise at all, and it is the one that splits mutation bugs
   in two — objects rejected, array methods allowed.

### Version rule corrected — a running `+0.01`, not a formula

The learner asked for `0.10` before committing, and the reviewer pushed back: the Versioning section said the
version was "derived from the topic count, so it is never invented", which made `0.09` the only legal value for
eight topics. The learner's actual rule turned out to be different, and simpler:

> the version is not based on the number of topics — every time there's a new topic, add `0.01` to whatever the
> version is. I can also deliberately adjust the version to any number I want. The only constant is `+0.01` on
> every new topic.

So the version is a **running number, not a formula**. `0.10.0` is legal with eight topics because the learner
advanced it deliberately; the ninth topic will make `0.11.0`.

1. **Bumped `0.09.0` → `0.10.0`** across `package.json`, both `package-lock.json` entries, and the `HomePage`
   badge (`v0.10`).
2. **Rewrote the "Versioning" section of `CLAUDE.md`** around the real rule, with a history note naming the
   reviewer's misreading as the source of the old wording. The three artefacts that must move together are
   unchanged, and the older `v0.1.0`-that-never-shipped story still stands as the reason.
3. **Swept the claim out of the other docs.** `README.md`, `ROADMAP.md` and `NOTES.md` all asserted the version
   was derived from the topic count and told the reader to "re-check it against the count" — now "add `0.01`
   per new topic". The lesson-adding checklist's step 5 was already correct and needed no change.
4. **Verified**: `tsc` and `npm run lint` green.

### Landing page — shorter copy, and why the dojo exists

The landing page described the *stack* ("forged with Vite, styled with Tailwind, ready for Vercel") but never
said who the site was for or why it exists. Rewritten around the mission, and kept short:

1. **The hero is one line now**: "Short lessons on React fundamentals, each ending in a live example." The
   Vite/Tailwind/Vercel line is gone from the hero — that is build trivia, and the README still carries it.
2. **About carries the origin story in the author's words**: started as a personal training ground to keep the
   fundamentals sharp, then opened up for anyone learning React or revisiting the topics that matter — because
   strong fundamentals are a must. Two short paragraphs, followed by a three-item strip (Short lessons · Live
   examples · Fundamentals first) for a reader who only skims.
3. **The count and the range come from `topicRegistry`** — "8 lessons · JSX to Forms & Inputs", with the number
   and both endpoints read from the array, so adding a lesson updates the landing page with nothing to
   remember. The same single-source-of-truth rule as the sidebar numbering. *(Removed again — see item 5.)*
4. **Two corrections after the first pass.** The tagline had claimed "a live example you can click", which is
   not true of every lesson: `jsx` renders expressions and carries no controls, so the clickability claim was
   dropped rather than the demo being bent to fit it. The tagline also wrapped with "click." orphaned on its
   own line — the hero line now uses `text-balance`, and the About paragraphs use `text-pretty`.
5. **Then the hero was cut back to the name.** The explanatory tagline went first: "React Training Ground" over
   "The Jojo Dojo" already says what this is, and the About section says the rest. The lesson-count line went
   the same way — the dojo index already lists the lessons, numbered, so the landing page had no reason to
   advertise the total, and the `topicRegistry` import it needed went with it. What is left is the eyebrow, the
   name, the byline and the two buttons. (The About strip's third point changed from "Fundamentals first" to
   "Sample Code", which names something the lessons actually contain.)
6. **Verified**: `tsc` and `npm run lint` green. The look is the learner's to confirm.

### UI readability pass — numbered path, scannable sidebar, readable prose

Requested before starting the next topic: make the sidebar and the main panel easier to read, and give the
topic cards a clear order.

1. **The sidebar was showing truncated titles.** Rows rendered `topic.title`, and every title is a
   "Concept — subtitle" string, so a 16rem column clipped them to "Components & Props — Dat…" and
   "Conditional Rendering — &…". Added **`shortTitle`** to the `Topic` type — required, so the compiler
   forces every lesson to supply one — and the sidebar shows that instead: "Components & Props",
   "Conditional Rendering", and so on. The full `title` is untouched on the page `<h1>` and the cards.
2. **The order is now visible everywhere.** A two-digit lesson number leads each sidebar row and each
   index card, and the topic page carries a breadcrumb reading "All Topics / Lesson 08 of 08". All three
   derive the number from the item's position in `topicRegistry`, so the reading order lives in exactly
   one place — reordering that array reorders the sidebar, the cards and the breadcrumb together. The
   index grid also became a real `<ol>`, which is what it had always been semantically.
3. **The detail prose was 896px wide** — roughly 120 characters a line, well past the 60–75 that reads
   comfortably. `RichText` now caps paragraphs and bullets at `max-w-prose` (65ch) with `leading-7`,
   while fenced code blocks keep the full width, since code wants the room. Section spacing went from
   `mb-8` to `mb-10`, and the header gained a rule separating it from the body.
4. **Wide screens were leaving a hole.** The content was capped at `max-w-4xl` (896px) and left-aligned, so on
   a ~1900px window it hugged the sidebar and left roughly 700px of empty space beside it.
   - **First attempt — a `2xl` two-column split.** The page centred itself under a `max-w-7xl` cap, and from
     `2xl` up the Live Demo moved into a `28rem` right column beside the lecture. It was **reverted**: the
     demo components are built at `max-w-md` / `max-w-lg`, and the narrower side column made their own
     controls wrap — "Log a rep" broke across two lines in the event-handling demo. A demo needs the width it
     was designed at, so it does not belong in a side column.
   - **What shipped instead.** One full-width column, uncapped: the lecture text lost its `max-w-prose`
     measure and the sample code (which wants the width anyway — it was already scrolling horizontally at
     920px) both take the whole panel. The Live Demo panel is `w-fit`, so it wraps the demo rather than
     stretching a mostly-empty bordered box across the page. The index grid stays two columns and goes to
     three at `2xl`.
5. **Verified**: `tsc` and `npm run lint` green. The visual result is the learner's to confirm — the
   reviewer still cannot run `npm run dev`.

### Forms — fixed, explained, and verified

1. **Both bugs fixed.** The learner's `forms` demo now reads the typed value
   (`onChange={(event) => setName(event.target.value)}`) and its submit handler calls
   `event.preventDefault()` first. `tsc` and `npm run lint` green; the sample was swapped from the fix-it
   exception to a real mirror, verified at **53 of 53** lines.
2. **A detour worth recording.** Beyond the two fixes, the learner added `new FormData(event.currentTarget)`
   plus a `console.log` to read the values back out of the form, reasoning that "FormData is the new way for
   form submission since React 19." Two corrections: `FormData` is the browser's API, not new to React — React
   19 added *form actions* (`<form action={fn}>`), a different pattern — and in a controlled form the values
   already live in state, so re-reading them from the DOM is redundant. Asked to explain, the learner corrected
   it in their own words: `FormData` reads at submit time (uncontrolled), while `useState` keeps the values
   live (controlled). The block was removed.
3. **Also caught this session:** `@types/react` deprecates `FormEvent`/`FormEventHandler`; the lesson teaches
   `SubmitEvent<HTMLFormElement>` instead (see the previous entry).
4. **Box ticked.** `ROADMAP.md` marked verified, `NOTES.md` entry 09 rewritten as `OK (Mastered)` with the
   FormData correction spelled out, the marker flipped to `Status: OK`, and Forms moved into the snapshot's
   "Solid" table. All eight lessons are now verified.

### Forms & controlled inputs — the eighth lesson, a fix-it exercise

1. **Docs audit before building.** `npx tsc -p tsconfig.app.json --noEmit` and `npm run lint` both pass. The
   version chain was consistent (7 topics → `0.08.0` across `package.json`, both `package-lock.json` entries,
   and the `v0.08` badge). All 7 lesson folders wired into the registry and named in all four docs; assets and
   `vercel.json` match their descriptions; every `description` is markup-free and every `longDescription` has
   balanced backticks.
2. **One real drift found and fixed: `use-effect` sample no longer mirrored its demo.** Four lines differed —
   the demo said "Timer running — keep going!" / "Paused - Taking a break is fine, but never give up!" /
   "Timer not started." / "characters logged.", while the Sample Code panel said "Interval running — one
   cleanup away from becoming two." / "Paused. The interval was cleared when you paused." / "Not started." /
   "characters logged". `CLAUDE.md` claimed "64 of 64" parity, which was false (60 of 64). The demo is
   canonical, so the sample was corrected to match and the claim is true again. `NOTES.md` entry 08 was not
   affected (it does not quote those strings).
3. **Probed before designing, per the fix-it rule.** Two candidate bugs survive both gates; two shapes do not:
   - Survives: a no-op `onChange` that writes state back to itself (silent read-only), and a submit handler
     with no `event` parameter (no `preventDefault`, page reloads).
   - Rejected: `value` on a field whose setter is otherwise dead (`noUnusedLocals` → TS6133 'setName' is
     never read), and a submit handler that types the `event` parameter but never uses it
     (`noUnusedParameters` → TS6133 'event' is never read).

   So a fix-it exercise with exactly two bugs is possible — the learner's stated preference.
4. **Shipped `forms` at `/dojo/topic/forms`** — a dojo sign-up form (Name + Email + Sign up) with both
   plantable bugs. The header names the objective and expected values and lists only the symptoms; the Sample
   Code panel teaches the correct pattern (the fix-it exception). Marker `Status: LD`, ROADMAP `IN PROGRESS`.
5. **Version bumped `0.08.0` → `0.09.0`** (eight topics) across `package.json`, both `package-lock.json`
   entries, and the `HomePage` badge.
6. **Understanding checked before building** — two questions, one at a time. Both solid: the controlled
   round-trip (`value` follows state, `onChange` follows the box, and the two failure modes) and the browser's
   default submit behaviour plus why `preventDefault` stops it. Ready for the exercise.
7. **`FormEvent` → `SubmitEvent` correction.** The learner caught that `@types/react` deprecates
   `FormEvent`/`FormEventHandler` ("FormEvent doesn't actually exist" — the DOM has no form event). The
   lesson now teaches `SubmitEvent<HTMLFormElement>` (a `<form>`'s `onSubmit` is typed `SubmitEventHandler<T>`),
   in the sample, the notes, and the demo. `ChangeEvent<HTMLInputElement>` and `MouseEvent<HTMLButtonElement>`
   are unaffected — only the invented "form event" was removed.

### Versioning — the version is now derived, not invented

1. **The learner set the rule:** `0.01` for the initial page, then **`+0.01` per topic**. Seven topics, so the
   project is **`0.08.0`**. It replaces the old hand-picked `v0.1.0` deploy target that never shipped — the
   exact guesswork that once left the `HomePage` badge advertising a release which did not exist.
2. **Applied in five places, not one.** `package.json`, **both** project `"version"` entries at the top of
   `package-lock.json` (the root one and `packages[""]` — dependency versions untouched), the `HomePage` badge
   (short form `v0.08`), and the four docs that had been pitching `v0.1.0`.
3. **Written into `CLAUDE.md` as a convention** with its own section, so a new session derives the number
   instead of choosing one: the rule, the three artefacts that must move together, and why the old approach
   failed. Step 5 of the lesson-adding checklist now covers the bump, which is what makes the version advance
   automatically as topics are added.
4. **Asked rather than assumed.** The learner's two statements initially disagreed — "+0.1 per topic" against
   "7 topics → 0.08" — and `0.01 + (7 × 0.1)` is `0.71`, not `0.08`. Since the difference was between two
   plausible conventions and this one gets written into five files, the ambiguity was put back to the learner
   instead of being resolved by picking the reading that matched the stated number.
5. **One judgement call recorded:** the roadmap's `useState` deep dive is not a topic folder, so it does not
   advance the version. It is a gap *within* a verified topic. Routing, by contrast, has a notes entry but no
   lesson folder — either way the count that matters is the seven `src/topics/` folders.

*Correction to this entry:* the rule it records is wrong. The learner's rule is a **running `+0.01` per new
topic from whatever the current version is**, with deliberate adjustments allowed — not a value derived from
the topic count. That wording made `0.10` look illegal for eight topics, and it was caught when the learner
asked for `0.10.0` before committing. See the newest entry at the top of this log.

### Sync pass — making the record readable by a cold session

Before starting a new topic, everything was audited for agreement between the docs, the code, and *each other* —
not just for factual accuracy, but for whether a fresh AI session could pick the project up unassisted.

1. **One genuine code/doc contradiction: `RichText.tsx` said "three rules" while `CLAUDE.md` said four.** The
   parser implements four (fenced blocks, bullets, inline code, blank-line paragraphs), so the source comment
   was wrong, and its sibling comment on `parseBlocks` claimed "three" while listing three *structural* rules
   and silently omitting the fourth. Both comments now name all four and say which function owns each. This is
   the second time a stale comment in this file has been caught — worth knowing this file is a repeat offender.
2. **The version story was ambiguous.** `package.json` says `0.0.0` and the `HomePage` badge matches it, but
   every doc pitched "Deploy v0.1.0" without saying the version has to be *bumped* as part of that work — which
   is why the badge had once advertised a release that never happened. The roadmap and notes deploy lines now
   spell out that bumping `package.json` to `0.1.0` is part of the task.
3. **Added an "Orientation — read this first" section to the top of `CLAUDE.md`.** A cold session previously had
   to infer, from scattered sections, which of the five root docs answers what, whose job the written record is,
   and what "verified" means. It now says so up front, including the rule most likely to be misread: *do not
   tick a box because a lesson file exists.*
4. **Added the missing "Adding a lesson — the checklist".** Adding a lesson touches six places across five
   files, and that procedure existed only as scattered remarks — this project's single most-repeated failure is
   docs drifting out of sync, so the procedure is now written down as a table, including the decision that has
   to be made *before* writing the demo: fix-it exercise, or explainer. That decision now carries the gate-probe
   rule with it.
5. **Made the objective ordering explicit.** `Next session objectives` listed Forms before the `useState` deep
   dive, which read as an oversight since the deep dive is older. It is deliberate — Forms is a **`GAP`** (never
   used at all), the deep dive is a *gap within a verified topic* — and now says so.
6. **Verified by script, not by eye:** 18 claimed paths all exist; dependency majors match `package.json`
   (React 19, Vite 8, Tailwind 4, React Router 7); all 8 notes entries agree with their marker file and roadmap
   box (entry 03 Routing being the documented exception); all 7 lessons are wired into the registry and named in
   all four docs; no stale claims anywhere; and all 7 descriptions still render without literal markup.
7. **Two of my own checkers were wrong first**, and both were reported as problems before being disproved:
   a regex that missed "reviewer-written" text that was present, and one that mapped alphabetically-sorted
   folders against entry numbers. Neither was a repo defect — which is exactly why a failing check is worth
   reading before acting on it.

### `useEffect` — the second lesson that could not be a fix-it exercise
1. **Seven candidate bugs were probed against both gates before anything was designed.** The request was a
   fix-it with two or more bugs; the probes said that is not available here, and the split is clean:
   - **Rejected by `react-hooks/set-state-in-effect`:** derived state synced through an effect
     (`useEffect(() => setCount(prop), [prop])`) — the "you might not need an effect" mistake React's own
     docs lead with — and an object or array used as a dependency.
   - **Rejected by `react-hooks/exhaustive-deps`:** any wrong or missing dependency array, including a
     wrapper handler on the dependency line. It is a *warning* rather than an error, so it does not fail the
     build — but the warning text names the fix ("wrap the definition in its own `useCallback()`"), which
     hands over the answer, so shipping it would be worse than useless.
   - **Passes both gates:** a fetch with no `AbortController` (but with no server here, the race is
     unobservable), and a missing cleanup on an interval or listener.

   That leaves **one** mistake in two shapes, which is too thin for an exercise whose point is diagnosis.
   So: lecture plus quiz, per the stated fallback.
2. **The lesson is live at `/dojo/topic/use-effect`** — a training timer whose only effect starts, stops and
   cleans up an interval. The demo deliberately keeps two independent pieces of state (`seconds` driven by
   the interval, `draft` driven by the textarea) so the dependency array can stay honest: the effect depends
   on `isRunning` and nothing else, and typing never restarts the timer.
3. **The cleanup is the teaching device.** The lesson text walks through deleting the `return` line: nothing
   breaks immediately, each change to `isRunning` leaves the previous interval alive and starts another, and
   the clock ends up ticking two and then three times as fast. A leak **compounds**, so the symptom arrives
   several interactions after the mistake.
4. **Two rules from React's own documentation are included**: use the updater form
   (`setSeconds((s) => s + 1)`) so state does not have to enter the dependency array, and compute derived
   values during render rather than in an effect. The demo's formatted clock is the worked example of the
   second.
5. **Verified**: exact mirror at **64 of 64** lines, `tsc` and `npm run lint` both green with no warnings.
6. **A mistake of my own, caught by the checker rather than by eye.** The first draft of the description used
   Markdown emphasis — `**Cleanup is the half people skip**` plus six more instances of `**bold**` and
   `*italic*`. `RichText` has no emphasis rule, so every one of those would have printed literal asterisks on
   the lesson page. The sweep that caught it now checks all seven descriptions for literal backticks, `**`
   and lone `*` outside code spans; all seven are clean.
7. **Deferred, and recorded as deferred:** a real fetch with loading and error states. There is no server in
   this project, so a fetch demo would have to fake its data and could not show the race condition that makes
   `AbortController` worth teaching. It belongs with Forms, alongside the event object.
8. **Verified by quiz — with one answer wrong first time, which is the first in the journal.** Two of three
   were right immediately: what genuinely needs an effect (`document.title`, because nothing outside React
   re-renders itself), and why a missing cleanup compounds (the previous intervals are never stopped, so each
   re-run adds a contributor rather than replacing one). The third was wrong — shown an effect reading `reps`
   with `[]`, the answer was that an empty array still re-runs when a value the effect reads changes. That is
   backwards: the dependency array is the *only* thing that decides re-runs, so `[]` means once after the
   first render and nothing after.

   The correction landed, and the follow-up answer was right and precise — the callback would still see `0`,
   because it closed over the value from the render it ran in. Recorded in entry 08 with the correction
   spelled out rather than smoothed over, because "an empty array still re-runs when a value changes" is the
   belief that makes someone add dependencies pointlessly or wonder why an effect is not firing.
9. **Box ticked; all seven lessons are now verified.** `ROADMAP.md` has no `IN PROGRESS` or `quiz-passed`
   lines left, and both the "In progress" and "Quiz-passed" sections of the snapshot are empty for the first
   time.

### Event handling — verified by quiz

- **Verified and closed out — by quiz, not by repair.** Event handling had no hands-on exercise to fix, so
  clearance for the box came from three questions, asked one at a time with feedback between each. All
  three correct, and none guessable from the wording of the options:
  - **What the gates object to** in `onClick={handleReset()}` — answered that the handler runs while
    rendering and `onClick` receives its return value instead of the function. That is the fact both `tsc`
    and ESLint point at, from different angles.
  - **Reading four differently-wired buttons** — identified the one correct wiring. The question planted two
    *different* mistakes, and the feedback separated them: calling during render is loud (both gates stop
    you), while failing to supply the argument a handler needs is silent (nothing stops you; the click
    passes the event object where an id was expected).
  - **Choosing the form** for a Rename button needing that row's id — picked the arrow wrapper and gave the
    right reason. The "read the id off the event object" option was offered and would have been accepted as
    a real pattern; it is the one answer that requires the event object this lesson deferred.

  `ROADMAP.md` ticked, `NOTES.md` entry 07 rewritten as verified with the quiz recorded, the marker flipped
  to `Status: OK`, and Event handling moved into the snapshot's "Solid" table.

### Event handling — how the lesson was built

1. **The plan was a fix-it exercise, and the plan was wrong.** The mistake this topic exists to teach —
   `onClick={handler()}` instead of `onClick={handler}` — cannot be shipped as a planted bug in this
   project. A throwaway probe (four wirings in one throwaway file, both gates run against it) showed:
   `tsc` rejects it with *Type 'void' is not assignable to type `MouseEventHandler<HTMLButtonElement>`*,
   and ESLint's `react-hooks/set-state-in-render` rule rejects the same line independently. The fix-it
   convention requires every planted bug to compile and lint clean, so there was nothing to plant.
2. **Two failed attempts before the probe, worth recording because they show why the obvious workarounds
   do not work.** The first version used `handleAddRep` with `reps + 1`; a render-phase call re-rendered,
   which called it again — a genuine infinite loop (26 passes and climbing), which would have frozen the
   lesson page. The second made the handler idempotent by *setting* rather than incrementing, which fixed
   the loop, but the mis-wired Remove then emptied the whole panel on mount and left nothing to click.
   Both were caught by simulation before shipping. The lesson: **check that a candidate bug survives
   `tsc` and lint before designing an exercise around it** — now written into the fix-it convention in
   `CLAUDE.md`.
3. **So it shipped as an explainer instead**, at `/dojo/topic/event-handling`. The Live Demo shows all
   three wirings at once: an inline arrow closing over a row's id, a named handler passed by reference
   (`Reset`), and a named handler taking an argument through an arrow (`Remove`, `Focus`). This is the
   first file in the journal with **named handler functions** — every one of the previous 12 handlers was
   an inline arrow.
4. **The description earns its place by showing the compiler's real message.** The lesson text includes
   the actual `tsc` error for the wrong wiring, so the "you get this right while typing" point is
   demonstrated rather than asserted. Four fenced code blocks, verified to render through `RichText`.
5. **The event object was deliberately left out** — `preventDefault`, `target`, and typing an event
   parameter (`React.MouseEvent<HTMLButtonElement>`) belong with Forms, where they have a real job. Noted
   as deferred, not forgotten.
6. **Verified**: exact mirror between `demo.tsx` and `codeExample` at **105 of 105** lines (the first
   lesson to hit exact parity with no residue lines, by keeping JSX comments out of the demo), `tsc` and
   `npm run lint` green, and the description parsed through the `RichText` logic to confirm four code
   blocks and no stray emphasis.
7. **Box left unticked.** The demonstrated half is satisfied by code that already exists; the explanation
   half is outstanding, and `ROADMAP.md` marks the line `IN PROGRESS` with the reason recorded below the
   checklists.

### Lists & keys — fixed, explained, and verified

1. **The learner fixed it in one change**: `key={index}` became `key={exercise.id}` at the `.map()`. Nothing
   else in the component moved — no conditionals, no restructuring, no patching of the symptom — which is
   the point of the exercise.
2. **Verified by simulation, not by assertion.** The harness was re-run against the component's real Rotate
   logic (`[...current.slice(1), current[0]]`): tick Front kicks, rotate three times, and the tick is still
   on Front kicks. Before the fix the same harness put it on Knee strikes after one rotate. `tsc` and
   `npm run lint` green with the fix in place.
3. **The explanation half closed the exercise.** Asked what React does with the row when Rotate is pressed,
   the answer was the mechanism itself: *"React reuses the row component, and the tick lives inside that
   reused component."* That is the whole bug in one sentence — the key decides which instance is reused, so
   a key that names a position glues the row's state to the position while the data moves on. Both halves of
   the evidence standard are therefore on the record, and this is the **second unaided fix** in the journal
   (props bug 2 was the first).
4. **The box is ticked.** `ROADMAP.md` marked verified, `NOTES.md` entry 06 rewritten as `OK (Mastered)` with
   the learner's own wording quoted, the marker in `demo.tsx` flipped to `Status: OK (verified — fixed and
   explained)`, and Lists & keys moved from "Quiz-passed" into the snapshot's "Solid" table.
5. **Recorded in the code**, following the props lesson: the header reads "FIX-IT EXERCISE — fixed" with the
   diagnosis steps kept, and a comment at the `.map()` explains why an index key fails and an id key works.
   Reviewer-added, not learner-added — the learner's own change was the one-line key fix.
6. **The Sample Code became a real mirror.** It had been the fix-it exception (correct pattern, buggy demo);
   now demo and snippet are the same 62-line component, with the same empty-`{}` residue from stripping the
   JSX comment that `conditional-rendering` has. The exception note in `CLAUDE.md` now points at no lesson,
   and the mirror rule is unqualified again.
7. **One exchange beyond the fix, kept because it is instructive.** The learner's rule — index is unsafe "if
   there's any addition, removal, and reordering of data" — is correct to code by but *stricter* than the
   truth: appending at the end preserves every index, so React reuses each instance against the same data and
   nothing moves. Asked that case directly, they correctly called it safe. The reviewer had framed the
   question expecting the conservative answer and would have been wrong to mark "safe" down. The traps-table
   row for `key={index}` now says an index names a slot rather than an item, and that append-at-end is the
   harmless case.
8. **One rule-of-thumb overreach, taught rather than scored.** Asked about `RichText`, which renders its
   paragraphs with `key={index}`, the learner said index is unsafe because the content can change. It is safe
   there: content arriving as props flows through a reused instance perfectly well, which is the normal path
   of every re-render. The deciding factor is whether items can be **reordered** and whether any row carries
   its own state — not whether the content is static. The learner had the deciding factor right when asked
   for it directly (row-level state); this was an over-broad application, so it was corrected in conversation
   and not counted against them.

*Reviewer note on process:* this exercise promoted cleanly because the demo was cut down to 62 lines before
it shipped. The first draft (two lists, two wrong key styles, per-row text inputs) had to be discarded — the
objective was unclear and two mistakes competed for attention. Worth applying to the next fix-it lesson up
front: state the objective explicitly, and keep the surface to one noticeable bug.

### Docs audit, lint repair, and the Lists & keys exercise

**A. The audit found four doc errors — this is the third session in a row where an audit found some.**

1. **`npm run lint` was failing outright** — 44 parse errors, none of them in this code's fault. A Kilo
   Code git worktree at `.kilo/worktrees/wiry-cup` is a complete second checkout with its own
   `tsconfig.json`; because lint is `eslint .`, `typescript-eslint` saw two candidate `tsconfigRootDir`
   values and refused to parse every file in *both* trees. `npx eslint src vite.config.ts` exited 0, which
   is what proved the code was clean. Fixed by adding `.kilo` to `globalIgnores`. Both checks now pass.
2. **The conditional-rendering parity claim was off by one.** `CLAUDE.md` said "63 of 63 lines identical".
   Re-measured: the sample is 63 stripped lines and the demo is 64, the extra line being an empty `{}`
   left behind when the demo's JSX comment is stripped. All 63 sample lines do match. Claim rewritten.
3. **The `useState` entry in `NOTES.md` contradicted both the code and itself.** It showed a 19-line
   `CounterDemo` and described it as "the same logic as the lesson component, with the `className`
   styling trimmed" — but it contained the whole milestone block that the lesson's own snippet omits,
   restructured the markup, and was a *different* 11-line snippet from the one on the lesson page. The
   notes now quote the lesson's real snippet, with the milestone block shown separately and labelled as
   the extra the live component does.
4. **"Type-checking and linting pass" had become false** (current-state section, twice, plus the audit
   entry further down this file, which is now corrected in place).
   Minor, same pass: `HomePage.tsx` advertised `v0.1.0` while `package.json` is `0.0.0` and the deploy is
   unticked, now `v0.0.0`; and `NOTES.md` called `toLocaleDateString()` "today's date" rather than a
   locale-formatted date string.

**B. New lesson — `lists-and-keys`, a fix-it exercise (entry 06).**

1. **The exercise.** One list of three exercises, a single "Rotate" control, and one "Done" toggle per
   row. Rows are keyed by array index, so after a rotate the tick sits on whichever exercise took that
   slot. A row's own `useState` is the only thing that knows which exercise was ticked, which makes the
   identity mistake visible on screen instead of inferred. The header states the **objective** and the
   click-by-click steps, then names what you should see — never where the bug is or how to fix it.
2. **The first version was too big and was cut down.** It had shipped with two lists, two wrong key
   styles, per-row text notes and two controls. That buried the lesson: the objective was never stated,
   and two different key mistakes competed for attention. The rewrite is a third of the size, states the
   objective in the header, and leaves exactly one thing to notice. The whole demo is now 62 code lines
   and the fix is two of them.
3. **The symptoms were simulated before they were written down**, per the rule that cost the
   `conditional-rendering` exercise a rewrite. That caught two things. In the first design, per-row state
   was a numeric "+1", and because every row then showed a *different* number the mismatch was invisible —
   three scenarios all looked healthy. Switching the row's state to something readable (a tick) made the
   symptom visible. The simulation also caught that the first seed data was already in the desired order,
   so the "sort" reordered nothing and proved nothing. The simplified design was simulated the same way
   and pinned to exact values: tick Front kicks, rotate once, and the tick is on Knee strikes.
4. **The sample code teaches the correct pattern, not the bug** — `key={exercise.id}` instead of
   `key={index}`. It is otherwise the *same* component: 62 lines each, differing at exactly those two key
   lines. That is the documented fix-it exception, and it keeps the scope of the fix obvious once the
   learner goes looking. Excluded from the parity counts until then.
5. **Registered with no new routes** — one registry entry and one lesson folder, and the sidebar link,
   `/dojo/topic/lists-and-keys` URL and grid card follow automatically. `tsc` and `lint` verified green
   with the bug in place.
6. **`ROADMAP.md` marked `IN PROGRESS`**, not ticked, and `NOTES.md` moved Lists & keys out of
   "quiz-passed" into a new "In progress" section — the concept was quiz-passed, but a live exercise is
   not evidence of a *fix*, so the box stays open until the demo works and the reasoning is explained.
7. Concept-level traps added to the notes, including the one that matters most here: two siblings sharing
   a key.

*Correction to this entry:* item A1 initially read as though `.kilo` were inside this repo's own source
tree. It is not — it holds **editor-agent worktrees**, a complete copy of the project on a detached HEAD,
which is exactly why it carries a second `tsconfig.json` and confused the parser.

### Review session — code & docs audit

1. **Fixed the invisible belt dots.** All three views called a local `beltColor()` helper that
   returned `text-*` / `border-*` classes, then used it on empty `<span>` dots, which need a
   *background* — so every lesson dot rendered with no color at all. (Only the "All Topics" dot
   was visible, because it had `bg-dojo-ember` hardcoded.) The mapping now lives in
   `src/topics/beltStyles.ts` as `beltBadgeClass()` + `beltDotClass()`, replacing three
   near-identical copies that had already drifted in their typing.
2. **Fixed the dead `#about` links.** The landing page's nav and hero both link to `#about`, but
   no element had `id="about"` once the old About section was dropped — the links scrolled
   nowhere. A short About section is back on `HomePage.tsx`.
3. **Removed a cast that lied to the type system.** `TopicDetail.tsx` had
   `useParams<{ slug: string }>() as { slug: string }`, which asserts the param always exists.
   It is now a plain `useParams()` plus a `slug ?` check, and `topicBySlug` is typed
   `Record<string, Topic | undefined>` so the "topic not found" branch is genuinely reachable
   as far as TypeScript is concerned.
4. **Readability**: the `codeExample` snippet is a template literal instead of `+`-joined
   strings, `use-state/index.ts` dropped a pointless `as BeltRank`, and `use-state/demo.tsx`
   now actually carries the topic-marker header that the convention section above describes.
5. **Deploy config**: `vercel.json` switched from a catch-all `redirects` entry to `rewrites`
   (see the Deploy note above for the reasoning). Worth confirming on the first preview deploy.
6. **Docs re-synced**: the README claimed React 18 (it is React 19), required Node 18 (Vite 8
   needs 20.19+ / 22.12+), and still described the pre-router `App.tsx`. The README's own roadmap
   and `ROADMAP.md` also disagreed with each other. All four docs were re-checked against the code.

   *Correction to this entry:* it originally also claimed the README advertised an `src/assets/`
   folder that does not exist. **That was wrong** — `src/assets/` does exist and holds three
   unreferenced scaffold files (`hero.png`, `react.svg`, `vite.svg`). The reviewer had globbed only
   `*.ts`/`*.tsx` and asserted the absence without verifying. The README structure has since been
   corrected to list the folder. Lesson for the reviewer: an absence claim needs its own check.

7. **Verified**: `npx tsc -p tsconfig.app.json --noEmit` and `npm run lint` both pass. *(True when written. `npm run lint` later began failing when an editor worktree appeared under `.kilo` with a second `tsconfig.json` — see the newest entry above, where it was diagnosed and fixed.)*

### Learner-knowledge review + documentation model

Following the routing exercises and a five-question assessment, the reviewer's role was formalised
(see "Reviewer Responsibilities" above) and `NOTES.md` was restructured around it:

- Added a **Knowledge Snapshot**: what is solid, what is `quiz-passed`, and the honest gap list.
- Marked `ROADMAP.md` from that snapshot — only `JSX` and `useState` newly ticked. Quiz-correct topics
  (lists & keys, event handlers, `useEffect`) deliberately stay unticked, because a correct
  multiple-choice answer is weak evidence.
- **Changed the notes model:** `NOTES.md` is reviewer-written. The learner declined note-writing in
  favour of hands-on practice, so the reviewer now authors the snapshot, the per-topic entries and the
  traps cheat-sheet. Added entries `02 — JSX`, `03 — Routing`, and the traps table.
- Confirmed the `TestGreeting` `:subjects` / `teacher` mismatch is **intentional** — it reproduces the
  common routing bug on purpose and is documented as such in the file, the notes and the tree above.

### Props lesson (fix-it exercise) + mobile responsive pass

1. **New lesson `components-props`** at `/dojo/topic/components-props` — a third registry entry, added with no new routes.
2. **Shipped deliberately broken, as a fix-it exercise.** Two bugs, both compiling: the parent omits an optional `label` prop (blank heading), and the child copies its `reps` prop into `useState`, so its number freezes at `0` while the parent's total climbs. The file header documents the **symptoms only**, never the locations, so the learner has to diagnose them. Confirmed `tsc` and `npm run lint` stay **green** — a fix-it exercise must still build.
3. **Mobile responsive pass.** The tutorial shell was unusable on a phone: the fixed `w-64` sidebar left roughly 120px of content on a 375px screen. It now stacks below `md` — the sidebar became a horizontally scrollable strip (`w-full md:w-64`, since replaced by the burger dropdown logged below) — and returns to side-by-side from `md` up, using the *same* markup with no duplicated nav. Also made the landing and top-nav links visible on small screens instead of `hidden sm:*`, tightened padding (`px-4 sm:px-6`), scaled headings down (`text-2xl md:text-3xl`, hero `text-4xl sm:text-5xl md:text-7xl`), and added `min-w-0` / `shrink-0` to card headers so long titles wrap rather than squashing the belt badge.
4. **Responsive layout verified visually by the learner** at phone width — the one thing the reviewer could not check, since the sandbox blocks `npm run dev`. Individual lesson demos are still only type-checked, never observed by the reviewer.
5. **Verified and closed out (attempt 2).** Bug 2 was solved **unaided** — the prop copied into `useState` was deleted and the prop rendered directly. Bug 1 needed a nudge: attempt 1 printed `N/A` for the missing prop, which hid the defect rather than fixing it, so the reviewer pointed at the *type* instead of the render. Making `label` required turned a silent runtime bug into a compile error and forced the second call site to pass a real label; the fallback was then dead code. Closed out: `ROADMAP.md` box ticked, `NOTES.md` entry 04 rewritten as verified with an explicit note on which bug was unaided vs guided, a traps-table row added for the `|| "N/A"` mask, and the stale "deliberately broken" header plus the now-wrong `?`-comment in `demo.tsx` rewritten so the lesson is recorded in the code itself. **Process lesson:** bug 1 never specified what the second drill should be called, which made a fallback a reasonable inference — an exercise must name its expected values.

### Conditional rendering lesson (second fix-it exercise)

1. **New lesson `conditional-rendering`** at `/dojo/topic/conditional-rendering` — a fourth registry entry, added with no new routes, targeting the one fundamental with a wrong answer on record (the falsy-value trap).
2. **Shipped deliberately broken, both bugs compiling.** A bare `0` printed by `{reps && <SummaryRow …/>}` — the trap itself — and two independent `&&` guards standing in for one ternary, which leave the badge blank at 0 reps and show **both** badges from 6 reps on. The header lists the symptoms *and* the expected behaviour, applying the process lesson from the props exercise: **name the expected values**, so a workaround cannot pass as a fix.
3. **The snippet deliberately did not mirror the demo while it shipped broken.** Because the demo was broken, `codeExample` taught the correct patterns — a ternary for either/or, and a *named* boolean (`const reachedMilestone = reps >= 10;`) so the left side of `&&` can never be a number — instead of displaying the bug. That exception is now written into the mirror rule. (Superseded once fixed — see item 7.)
4. **Reuses props on purpose**: the demo renders a `SummaryRow` child taking `label` and `value`, so the previous lesson's concept is reinforced rather than parked.
5. Verified `tsc` and `npm run lint` stay green with both bugs in place.
6. **Verified and closed out.** Both bugs fixed on the first attempt, after a framing hint, and the fix was better than the minimum: the condition was named once (`const isTraining = reps > 0;`) and then reused, so the badge collapsed to a single ternary and `&&` could never receive a number. Recorded as **guided** — the hint plus the named-boolean pattern being visible in the sample — so props bug 2 remains the only unaided fix on record. The learner also added a fatigue warning above 20 reps, which is beyond the exercise; every conditional it added keeps a real boolean on the left.
7. **Sample code swapped for a real mirror** — 63/63 lines against the repaired demo. It is the first sample needing **escaping**: the demo contains its own template literal, so `\`` and `\${` are escaped in `index.ts` and the parity check unescapes before comparing. That rule is now part of the mirror convention.
8. **Found and fixed a stale status line** in `NOTES.md` entry 04, which still read "exercise in progress, not yet verified" long after props was verified — the close-out had updated the evidence section but not the header. Worth checking the status line of any entry being closed out.
### UI convention — code in descriptions now renders as code

1. **Fixed a real defect, not just polish.** `topic.longDescription` was rendered as a single `<p>` with `whitespace-pre-line`, so every backtick and bullet dash the content already contained was appearing **literally** on the lesson pages: readers saw `` `useState` `` complete with backticks, and `- ` lists as run-on prose.
2. **Added `src/components/topics/RichText.tsx`** — a small renderer that turns the string into paragraphs, bullets, inline `<code>` and fenced `<pre><code>` blocks. It builds ordinary React nodes and never uses `dangerouslySetInnerHTML`, so description text can never inject markup. Hand-rolled instead of adding a Markdown dependency: four documented rules, nothing to install, and short enough to actually read.
3. **Wired into `TopicDetail`**, replacing that `<p>`.
4. **Marked up the existing content.** `components-props` had two snippets sitting in prose (`<Drill … />` and `function Drill({ … })`), now proper code blocks; `use-state` had `(setCount(c => c + 1))` and a bare `useState`; `jsx` had three unmarked brace expressions. `conditional-rendering` was already well marked up.
5. **Verified mechanically**, since the reviewer cannot run the app: the same parse logic was re-run in Node against all four extracted description strings — correct block structure, both `components-props` snippets fenced, and **every backtick pair and fence balanced** (an unpaired backtick would render literally). Worth repeating whenever description content changes.
6. **Documented the convention** under Key Patterns, including that `description` — the one-line summary in the topic grid — is plain text and must stay markup-free.

### Mobile nav — horizontal strip → burger dropdown

The sidebar's phone layout was a horizontally scrolling strip of topic links. With four lessons that was already awkward; with the dozen the roadmap plans it would be unusable, because a horizontal scroller **hides** items rather than showing them.

1. **Replaced with a burger dropdown** in `Sidebar.tsx`: a button reading `☰ Lessons` plus the current topic, expanding the list in place. `aria-expanded` / `aria-controls` are wired up and `aria-current="page"` is kept on the active link.
2. **It expands in place instead of floating.** `TutorialLayout` wraps the shell in `overflow-hidden`, which would clip an absolutely-positioned panel — and pushing the content down is both simpler and perfectly good mobile behaviour.
3. **Capped at `70vh` with its own scroll**, since the topic list will keep growing; the cap is lifted from `md` up so the desktop sidebar is untouched.
4. **One topic list, two presentations** — no duplicated markup, matching the existing responsive rule.
5. **Closes when a link is tapped**, so the panel never sits on top of the lesson you just opened.
6. **Escape-to-close deliberately omitted.** It needs a keydown listener, which in React means `useEffect` — a hook the journal has not taught yet. That is noted in the file as a good first job for the topic, rather than smuggling the hook in early.
7. Verified `tsc` / `npm run lint`. The mobile behaviour itself is the learner's to eyeball at ~375px.

### Earlier session — routing migration

The repo was migrated from a **single-page landing app** (`App.tsx` = hero → techniques → training counter → about → footer, all in one file) into a **multi-page W3Schools-style tutorial site**:

1. **Installed `react-router-dom` v7** (v7.18.4, compatible with React 19.2). Fixed a gotcha: `--omit=optional`/`--no-optional` strips the rolldown WASM native binding (`@rolldown/binding-wasm32-wasi`) — Vite 8 needs it. Always reinstall with a plain `npm install`, never with `--omit=optional`.

   *Correction (found during the docs audit):* **the package named above is wrong.** Rolldown 1.2.12
   ships 15 platform-specific bindings as optional dependencies and **no** `wasm32-wasi` package; the
   one in use here is `@rolldown/binding-win32-x64-msvc`, and `package-lock.json` has no `wasm32-wasi`
   entry at all. The *advice* stands — `--omit=optional` does strip the binding and the build then fails
   with "Cannot find native binding" — so always use a plain `npm install`.
2. **Created the tutorial shell**: `TutorialLayout.tsx` (nested layout route w/ `<Outlet />` so the sidebar persists), `Sidebar.tsx` (topic list, active highlight via `useMatch`), `TopNav.tsx` (logo + Dojo link + GitHub icon).
3. **Split pages off `App.tsx`**: `HomePage.tsx` (landing hero), `TopicIndex.tsx` (overview grid at `/dojo`), `TopicDetail.tsx` (lesson detail at `/dojo/topic/:slug` — description + code block + live `<Demo />`).
4. **Built the topic registry system**: `types.ts` (`BeltRank` + `Topic` interface), `registry.ts` (topic list + `bySlug` lookup), and the first lesson `use-state/` with `demo.tsx` (extracted `CounterDemo`) and `index.ts`.
5. **Updated entry point & routes**: `main.tsx` wraps `<BrowserRouter>`; `App.tsx` is now just `<Routes>`.
6. **Verified**: `tsc -b` passes, `vite build` succeeds, all three routes return 200 in dev with no runtime errors.
7. **Docs**: `CLAUDE.md` (arch guide), `NOTES.md` (study notes — layout fixed, ASCII-safe tables), `ROADMAP.md` (checklist), `vercel.json` (SPA deploy fallback).
