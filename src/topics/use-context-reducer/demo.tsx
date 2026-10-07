// ─────────────────────────────────────────────
// Topic: useContext & useReducer — one piece of state, read from anywhere below
// Added: 2026-10-08 | Status: LD (lecture live — hands-on build outstanding)
// ─────────────────────────────────────────────
// (Statuses: OK = Mastered, LD = Learning, RV = Reviewing.)
//
// The card below has three panels that never talk to each other and receive no props at
// all. One `useReducer` owns the session state, one `createContext` publishes it, and each
// panel takes what it needs out of the context with `useContext`.
//
// Two rules hold the whole thing up:
//
//   1. the reducer **returns a new state object** — `{ ...state, rounds: state.rounds + 1 }`.
//      React compares the old state with the new one by reference, so handing back the very
//      object it passed in is invisible: no re-render, and the screen keeps the old number;
//   2. the provider must be an **ancestor** of every consumer. A component cannot read a
//      value it publishes itself, so a `useContext` call in the same component that renders
//      `<SessionContext.Provider>` sees whatever sits above it — or the default.
//
// The actions are a discriminated union with no `default` branch, so adding a new action
// type is a compile error until the reducer handles it.
//
// Hands-on task for this topic: see NOTES.md entry 12.

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

const STARTING_SESSION: SessionState = {
  rounds: 0,
  draft: "",
  log: [],
  nextId: 1,
};

// Pure on purpose: every branch builds a new object, and the two arrays are replaced with
// spreads rather than pushed into. `STARTING_SESSION` is returned as-is on reset because it
// is a constant nobody ever writes to.
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
    <section className="flex flex-col gap-2 rounded-lg border border-dojo-border bg-dojo-bg/40 p-4">
      <h3 className="text-xs uppercase tracking-wider text-dojo-muted">Rounds</h3>
      <p className="font-mono text-3xl tabular-nums text-dojo-ember">{state.rounds}</p>
      <button
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
    <section className="flex flex-col gap-2 rounded-lg border border-dojo-border bg-dojo-bg/40 p-4">
      <h3 className="text-xs uppercase tracking-wider text-dojo-muted">Technique</h3>
      <input
        value={state.draft}
        onChange={(event) =>
          dispatch({ type: "draftTechnique", technique: event.target.value })
        }
        placeholder="Roundhouse kick"
        className="w-full rounded-md border border-dojo-border bg-dojo-bg/60 px-3 py-2 text-sm text-dojo-text outline-none focus:border-dojo-ember"
      />
      <button
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
    <section className="flex flex-col gap-2 rounded-lg border border-dojo-border bg-dojo-bg/40 p-4">
      <h3 className="text-xs uppercase tracking-wider text-dojo-muted">Session log</h3>
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
        onClick={() => dispatch({ type: "reset" })}
        className="w-fit rounded-lg border border-dojo-border px-3 py-2 text-sm transition hover:border-dojo-crimson hover:text-dojo-crimson"
      >
        Reset the session
      </button>
    </section>
  );
}

export function UseContextReducerDemo() {
  const [state, dispatch] = useReducer(sessionReducer, STARTING_SESSION);
  return (
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
  );
}
