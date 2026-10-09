import type { Topic } from "../types";
import { UseContextReducerDemo } from "./demo";

/** Registry entry for the `use-context-reducer` React lesson. */
export const useContextReducerTopic: Topic = {
  slug: "use-context-reducer",
  title: "useContext & useReducer — Shared State Without Prop Drilling",
  shortTitle: "Context & Reducer",
  belt: "black",
  description:
    "Share one piece of state across a whole tree with a reducer, and read it from anywhere with context — no props passed through the middle.",
  longDescription:
    "Three panels on one card need the same number: how many rounds you have logged. You could keep " +
    "that count in the card and pass it down as props, along with the setter, so a button two levels " +
    "deeper can change it. Every panel in between ends up accepting props it never uses.\n\n" +
    "Context is the way out. One component holds the state and publishes it, and any component below " +
    "can read it directly, however deep it sits. Nothing in between has to know the value exists.\n\n" +
    "```\nconst SessionContext = createContext<SessionApi | null>(null);\n\n<SessionContext.Provider value={{ state, dispatch }}>\n  <RoundPanel />\n</SessionContext.Provider>\n\nconst { state, dispatch } = useSession();\n```\n\n" +
    "The panels never call `useContext` directly — a small `useSession` wrapper does, and it throws " +
    "when there is no provider, so that missing-provider check lives in one place instead of three.\n\n" +
    "The state itself comes from `useReducer`. Instead of one `useState` per value, you keep a single " +
    "object and change it through named actions: `dispatch({ type: 'logRound' })`. A plain function — " +
    "the reducer — decides what each action does to that object.\n\n" +
    "A reducer must not change the state it is handed. It returns a new object built from the old one, " +
    "because React compares the two by reference. Write into the object and hand the same one back, and " +
    "React sees no change at all: no re-render, and the screen keeps the old number.\n\n" +
    "The one time handing back the same state is right is when an action changes nothing: " +
    "`commitTechnique` with an empty box returns the state it was handed, and React skips the render — " +
    "the same reference is the correct no-op.\n\n" +
    "The actions are typed as a union, so `logRounds` will not compile, and adding an action type will " +
    "not either until the reducer handles it. Every way this state can change is one list of cases, and " +
    "the compiler keeps that list complete.\n\n" +
    "The value object is rebuilt on every render, so every consumer re-renders with it. On a card this " +
    "size that costs nothing. In a larger tree you would split state and dispatch into two contexts, so " +
    "that components which only need dispatch do not re-render when state changes — dispatch is stable, " +
    "but the state object is not.\n\n" +
    "Before splitting, the usual first step is to memoize the value with " +
    "`useMemo(() => ({ state, dispatch }), [state])` so consumers only re-render when state actually " +
    "changes.",
  // Flush against the left margin on purpose: a template literal preserves
  // indentation, so indenting this to match the surrounding code would render as
  // ragged leading whitespace in the "Sample Code" panel.
  //
  // A real mirror of `./demo.tsx` — the two are kept in step. Regenerated from the
  // demo mechanically (comments and blank lines stripped) rather than retyped.
  codeExample: `import { createContext, useContext, useReducer } from "react";
import type { Dispatch } from "react";
type LogEntry = { id: number; technique: string };
type SessionState = {
  rounds: number;
  draft: string;
  log: LogEntry[];
  nextId: number;
};
type SessionAction =
  | { type: "logRound" }
  | { type: "draftTechnique"; technique: string }
  | { type: "commitTechnique" }
  | { type: "reset" };
const STARTING_SESSION: SessionState = Object.freeze({
  rounds: 0,
  draft: "",
  log: [],
  nextId: 1,
});
type FoodEntry = { id: number; name: string; calories: number; protein: number };
type DietState = {
  meals: FoodEntry[];
  foodNameDraft: string;
  caloriesDraft: number;
  proteinDraft: number;
  nextId: number;
}
type DietAction =
  | { type: "addFood" }
  | { type: "removeFood"; selectedId: number }
  | { type: "updateFoodNameDraft"; name: string }
  | { type: "updateCaloriesDraft"; calories: number }
  | { type: "updateProteinDraft"; protein: number }
  | { type: "reset" };
const STARTING_DIET: DietState = Object.freeze({
  meals: [],
  foodNameDraft: "",
  caloriesDraft: 0,
  proteinDraft: 0,
  nextId: 1,
});
function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "logRound":
      return { ...state, rounds: state.rounds + 1 };
    case "draftTechnique":
      return { ...state, draft: action.technique };
    case "commitTechnique": {
      const technique = state.draft.trim();
      if (!technique) return state;
      return {
        ...state,
        draft: "",
        nextId: state.nextId + 1,
        log: [...state.log, { id: state.nextId, technique }],
      };
    }
    case "reset":
      return STARTING_SESSION;
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
function dietReducer(state: DietState, action: DietAction): DietState {
  switch (action.type) {
    case "addFood": {
      const name = state.foodNameDraft.trim();
      if (!name || state.caloriesDraft <= 0 || state.proteinDraft < 0) return state;
      return {
        ...state,
        foodNameDraft: "",
        caloriesDraft: 0,
        proteinDraft: 0,
        nextId: state.nextId + 1,
        meals: [
          ...state.meals,
          { id: state.nextId, name, calories: state.caloriesDraft, protein: state.proteinDraft },
        ],
      };
    }
    case "removeFood": {
      const updatedMeals = state.meals.filter((meal) => meal.id !== action.selectedId);
      return {
        ...state,
        foodNameDraft: "",
        caloriesDraft: 0,
        proteinDraft: 0,
        nextId: state.nextId,
        meals: updatedMeals,
      };
    }
    case "updateFoodNameDraft":
      return { ...state, foodNameDraft: action.name };
    case "updateCaloriesDraft":
      return { ...state, caloriesDraft: action.calories };
    case "updateProteinDraft":
      return { ...state, proteinDraft: action.protein };
    case "reset":
      return STARTING_DIET;
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
type SessionApi = { state: SessionState; dispatch: Dispatch<SessionAction> };
const SessionContext = createContext<SessionApi | null>(null);
function useSession(): SessionApi {
  const session = useContext(SessionContext);
  if (!session) {
    throw new Error("useSession() must be called inside <SessionContext.Provider>.");
  }
  return session;
}
function RoundPanel() {
  const { state, dispatch } = useSession();
  return (
    <section
      aria-labelledby="rounds-heading"
      className="flex flex-col gap-2 rounded-lg border border-dojo-border bg-dojo-bg/40 p-4"
    >
      <h3 id="rounds-heading" className="text-xs uppercase tracking-wider text-dojo-muted">
        Rounds
      </h3>
      <p className="font-mono text-3xl tabular-nums text-dojo-ember">{state.rounds}</p>
      <button
        type="button"
        onClick={() => dispatch({ type: "logRound" })}
        className="rounded-lg bg-dojo-ember px-3 py-2 text-sm font-medium text-black transition hover:bg-dojo-ember-bright"
      >
        Log a round
      </button>
    </section>
  );
}
function TechniquePanel() {
  const { state, dispatch } = useSession();
  return (
    <section
      aria-labelledby="technique-heading"
      className="flex flex-col gap-2 rounded-lg border border-dojo-border bg-dojo-bg/40 p-4"
    >
      <h3 id="technique-heading" className="text-xs uppercase tracking-wider text-dojo-muted">
        Technique
      </h3>
      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-dojo-muted">
          Technique name
        </span>
        <input
          value={state.draft}
          onChange={(event) =>
            dispatch({ type: "draftTechnique", technique: event.target.value })
          }
          placeholder="Roundhouse kick"
          className="w-full rounded-md border border-dojo-border bg-dojo-bg/60 px-3 py-2 text-sm text-dojo-text outline-none focus:border-dojo-ember"
        />
      </label>
      <button
        type="button"
        onClick={() => dispatch({ type: "commitTechnique" })}
        className="rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-ember"
      >
        Add to the log
      </button>
    </section>
  );
}
function LogPanel() {
  const { state, dispatch } = useSession();
  return (
    <section
      aria-labelledby="log-heading"
      className="flex flex-col gap-2 rounded-lg border border-dojo-border bg-dojo-bg/40 p-4"
    >
      <h3 id="log-heading" className="text-xs uppercase tracking-wider text-dojo-muted">
        Session log
      </h3>
      {state.log.length === 0 ? (
        <p className="text-sm text-dojo-muted">Nothing logged yet.</p>
      ) : (
        <ul className="flex flex-col gap-1 text-sm">
          {state.log.map((entry) => (
            <li key={entry.id} className="flex justify-between gap-4">
              <span>{entry.technique}</span>
              <span className="font-mono text-xs text-dojo-muted">#{entry.id}</span>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={() => dispatch({ type: "reset" })}
        className="w-fit rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-crimson hover:text-dojo-crimson"
      >
        Reset the session
      </button>
    </section>
  );
}
type DietApi = { stateDiet: DietState; dispatchDiet: Dispatch<DietAction> };
const DietContext = createContext<DietApi | null>(null);
function useDiet(): DietApi {
  const session = useContext(DietContext);
  if (!session) {
    throw new Error("useDiet() must be called inside <DietContext.Provider>.");
  }
  return session;
}
function FoodStatsPanel() {
  const { stateDiet } = useDiet();
  return (
    <section
      aria-labelledby="diet-meals-heading diet-calories-heading diet-protein-heading"
      className="flex flex-col gap-2 rounded-lg border border-dojo-border bg-dojo-bg/40 p-4"
    >
      <h3 id="diet-meals-heading" className="text-xs uppercase tracking-wider text-dojo-muted">
        Total Meals
      </h3>
      <p className="font-mono text-3xl tabular-nums text-dojo-ember">{stateDiet.meals.length}</p>
      <h3 id="diet-calories-heading" className="text-xs uppercase tracking-wider text-dojo-muted">
        Total Calories
      </h3>
      <p className="font-mono text-3xl tabular-nums text-dojo-ember">{stateDiet.meals.reduce((acc, meal) => acc + meal.calories, 0)}</p>
      <h3 id="diet-protein-heading" className="text-xs uppercase tracking-wider text-dojo-muted">
        Total Protein
      </h3>
      <p className="font-mono text-3xl tabular-nums text-dojo-ember">{stateDiet.meals.reduce((acc, meal) => acc + meal.protein, 0)}</p>
    </section>
  );
}
function FoodFormPanel() {
  const { stateDiet, dispatchDiet } = useDiet();
  return (
    <section
      aria-labelledby="diet-form-heading"
      className="flex flex-col gap-2 rounded-lg border border-dojo-border bg-dojo-bg/40 p-4"
    >
      <h3 id="diet-form-heading" className="text-xs uppercase tracking-wider text-dojo-muted">
        Meal
      </h3>
      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-dojo-muted">
          Food name
        </span>
        <input
          value={stateDiet.foodNameDraft}
          onChange={(event) =>
            dispatchDiet({ type: "updateFoodNameDraft", name: event.target.value })
          }
          placeholder="Spaghetti"
          className="w-full rounded-md border border-dojo-border bg-dojo-bg/60 px-3 py-2 text-sm text-dojo-text outline-none focus:border-dojo-ember"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-dojo-muted">
          Calories
        </span>
        <input
          type = "number"
          value={stateDiet.caloriesDraft}
          onChange={(event) =>
            dispatchDiet({ type: "updateCaloriesDraft", calories: +event.target.value })
          }
          placeholder="200"
          className="w-full rounded-md border border-dojo-border bg-dojo-bg/60 px-3 py-2 text-sm text-dojo-text outline-none focus:border-dojo-ember"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-dojo-muted">
          Protein
        </span>
        <input
          type = "number"
          value={stateDiet.proteinDraft}
          onChange={(event) =>
            dispatchDiet({ type: "updateProteinDraft", protein: +event.target.value })
          }
          placeholder="200"
          className="w-full rounded-md border border-dojo-border bg-dojo-bg/60 px-3 py-2 text-sm text-dojo-text outline-none focus:border-dojo-ember"
        />
      </label>
      <button
        type="button"
        onClick={() => dispatchDiet({ type: "addFood" })}
        className="rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-ember"
      >
        Add Food
      </button>
    </section>
  );
}
function FoodListPanel() {
  const { stateDiet, dispatchDiet } = useDiet();
  return (
    <section
      aria-labelledby="diet-list-heading"
      className="flex flex-col gap-2 rounded-lg border border-dojo-border bg-dojo-bg/40 p-4"
    >
      <h3 id="diet-list-heading" className="text-xs uppercase tracking-wider text-dojo-muted">
        Food List
      </h3>
      {stateDiet.meals.length === 0 ? (
        <p className="text-sm text-dojo-muted">No Meal Plan yet.</p>
      ) : (
        <ul className="flex flex-col gap-1 text-sm">
          {stateDiet.meals.map((entry) => (
            <li key={entry.id} className="flex justify-between gap-4">
              <span>{entry.name}</span>
              <span className="font-mono text-xs text-dojo-muted">
                Calories: {entry.calories} | Protein: {entry.protein}
                &nbsp;
                <button
                  type="button"
                  onClick={() => dispatchDiet({ type: "removeFood", selectedId: entry.id })}
                  className="w-fit rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-crimson hover:text-dojo-crimson"
                >
                  Remove
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={() => dispatchDiet({ type: "reset" })}
        className="w-fit rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-crimson hover:text-dojo-crimson"
      >
        Reset Meal Plan
      </button>
    </section>
  );
}
export function UseContextReducerDemo() {
  const [state, dispatch] = useReducer(sessionReducer, STARTING_SESSION);
  const [stateDiet, dispatchDiet] = useReducer(dietReducer, STARTING_DIET);
  return (
    <>
      <SessionContext.Provider value={{ state, dispatch }}>
        <div className="flex w-full max-w-lg flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <RoundPanel />
            <TechniquePanel />
            <div className="sm:col-span-2">
              <LogPanel />
            </div>
          </div>
          <p className="text-xs text-dojo-muted">
            None of these panels receives a prop. Each one reads the same reducer state
            straight out of the context, and changes it by dispatching an action.
          </p>
        </div>
      </SessionContext.Provider>
      <br/><hr/><br/>
      <DietContext.Provider value={{ stateDiet, dispatchDiet }}>
        <div className="flex w-full max-w-lg flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <FoodStatsPanel />
            <FoodFormPanel />
            <div className="sm:col-span-2">
              <FoodListPanel />
            </div>
          </div>
          <p className="text-xs text-dojo-muted">
            None of these panels receives a prop. Each one reads the same reducer state
            straight out of the context, and changes it by dispatching an action.
          </p>
        </div>
      </DietContext.Provider>
    </>
  );
}`,
  component: UseContextReducerDemo,
};
