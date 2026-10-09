import { Link } from "react-router-dom";
import { topicRegistry } from "../topics/registry";
import { BELT_ORDER, beltBadgeClass, beltDotClass, beltLevel, beltName } from "../topics/beltStyles";

/**
 * Default content rendered at `/dojo` — welcome text + overview grid of all topics.
 *
 * The grid is an ordered list on purpose: the lessons build on each other, so the
 * number on each card is the recommended reading path, not decoration. Both the
 * number and the order come from `topicRegistry` — reordering that array reorders
 * the sidebar and these cards together, with nothing to keep in step by hand.
 */
export function TopicIndex() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-2 md:text-3xl">Welcome to the Dojo</h1>
      <p className="text-dojo-muted mb-3">
        The lessons build on each other, so the cards below are numbered in the order
        they are meant to be read. Any topic can also be opened straight from the
        sidebar.
      </p>

      {/*
        The key for the belts. It is built from `BELT_ORDER` — the same source the cards
        read — so a card cannot show a belt the legend does not explain, and renaming a
        level renames it in both places at once.
      */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="text-sm text-dojo-muted">Difficulty:</span>
        {BELT_ORDER.map((belt) => (
          <span
            key={belt}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${beltBadgeClass(belt)}`}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${beltDotClass(belt)}`}
            />
            {beltName(belt)} · {beltLevel(belt)}
          </span>
        ))}
      </div>

      <ol className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 2xl:grid-cols-3">
        {topicRegistry.map((topic, index) => (
          <li key={topic.slug}>
            <Link
              to={`/dojo/topic/${topic.slug}`}
              className="group flex h-full items-start gap-4 rounded-xl border border-dojo-border bg-dojo-surface/60 p-5 transition hover:border-dojo-ember"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-dojo-border bg-dojo-bg/60 font-mono text-xs tabular-nums text-dojo-ember"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h2 className="min-w-0 text-lg font-semibold transition group-hover:text-dojo-ember">
                    {topic.title}
                  </h2>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${beltBadgeClass(topic.belt)}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${beltDotClass(topic.belt)}`}
                    />
                    {beltLevel(topic.belt)}
                  </span>
                </div>
                <p className="text-sm text-dojo-muted">{topic.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
