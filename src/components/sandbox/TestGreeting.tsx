import { useParams } from "react-router-dom";

/**
 * TestGreeting component displays a personalized greeting based on URL parameters.
 * It extracts the `student`, `name`, and `teacher` parameters from the URL using the `useParams` hook.
 * The component renders a greeting message that includes the extracted parameters.
 */
export function TestGreeting() {
  // Deliberate demonstration of the :param <-> useParams() contract.
  // The route in App.tsx declares /test/:student/:name/:subjects, but this line
  // asks for `teacher` — a name the route never declares. So `teacher` is always
  // undefined (renders blank) while `subjects` is captured and never read.
  // Nothing warns you: both sides are ordinary strings living in different files.
  //
  // One call, one source of truth — don't call useParams() twice for the same data.
  const params = useParams();
  return (
    <div className="max-w-4xl">
      {/* Printing the whole object is the fastest way to see which keys really exist. */}
      <pre>{JSON.stringify(params, null, 2)}</pre>
      <p className="p-8 text-2xl">
        Hello, {params.name}!
        <br />
        Hi, {params.student}!
        <br />
        Good day, {params.teacher}!{/* always blank — the route has no :teacher */}
      </p>
    </div>
  );
}
