// ─────────────────────────────────────────────
// Topic: useContext & useReducer — one piece of state, read from anywhere below
// Added: 2026-10-08 | Status: OK (verified — built and explained)
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)
//
// Two independent cards, each with its own `useReducer` and its own `createContext`: the
// dojo session, and a meal plan. Six panels in total, and not one of them receives a prop.
//
// Two rules hold the whole thing up:
//
//   1. a reducer **returns a new state object** — `{ ...state, rounds: state.rounds + 1 }`.
//      React compares the old state with the new one by reference, so handing back the very
//      object it passed in is invisible: no re-render, and the screen keeps the old number;
//   2. the provider must be an **ancestor** of every consumer. A component cannot read a
//      value it publishes itself, so a `useContext` call in the same component that renders
//      `<SessionContext.Provider>` sees whatever sits above it — or the default.
//
// The actions are discriminated unions, and each reducer's `default` branch holds only a
// `never` check: add a new action type and forget its case, and that assignment stops compiling.

import { createContext, useContext, useReducer } from "react";
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

// Pure on purpose: every branch builds a new object, and the two arrays are replaced with
// spreads rather than pushed into. `STARTING_SESSION` is frozen and returned as-is on reset,
// so the reset target can never be mutated by accident.
function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "logRound":
      return { ...state, rounds: state.rounds + 1 };
    case "draftTechnique":
      return { ...state, draft: action.technique };
    case "commitTechnique": {
      const technique = state.draft.trim();
      // An empty box is a no-op: returning the same state tells React nothing changed.
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
      // Every action type above has a case, so `action` is `never` here. Add a type and forget
      // its case, and this assignment stops compiling — the union enforces completeness.
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

// One small hook so no panel has to handle the `null` case itself: the check happens once,
// here, instead of in all three of them.
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

// One small hook so no panel has to handle the `null` case itself: the check happens once,
// here, instead of in all three of them.
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
}
