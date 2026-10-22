import { Link } from "react-router-dom";
import { topicRegistry } from "../topics/registry";
import { BELT_ORDER, beltBadgeClass, beltDotClass, beltLevel, beltName } from "../topics/beltStyles";
import { ArrowRightIcon } from "../components/ui/Icons";

/**
 * Default content rendered at `/dojo` — welcome text + overview cards of all topics.
 *
 * The grid is an ordered list on purpose: the lessons build on each other, so the
 * number on each card is the recommended reading path, not decoration. Both the
 * number and the order come from `topicRegistry` — reordering that array reorders
 * the sidebar and these cards together, with nothing to keep in step by hand.
 */
export function TopicIndex() {
  return (
    <div className="w-full">
      <h1 className="font-display text-4xl tracking-wide md:text-5xl">
        Welcome to the Dojo
      </h1>
      <p className="mt-3 max-w-[68ch] text-pretty leading-relaxed text-dojo-muted">
        The lessons build on each other, so the cards below are numbered in the order
        they are meant to be read. Any topic can also be opened straight from the
        sidebar.
      </p>

      {/*
        The key for the belts. It is built from `BELT_ORDER` — the same source the cards
        read — so a card cannot show a belt the legend does not explain, and renaming a
        level renames it in both places at once.
      */}
      <div className="mt-6 mb-8 flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-dojo-muted">Difficulty</span>
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

      <ol className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {topicRegistry.map((topic, index) => (
          <li key={topic.slug}>
            <Link
              to={`/dojo/topic/${topic.slug}`}
              className="group flex h-full flex-col rounded-xl border border-dojo-border bg-dojo-surface/60 p-5 transition-colors hover:border-dojo-ember/70 hover:bg-dojo-surface/80"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-xs tabular-nums text-dojo-ember">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${beltBadgeClass(topic.belt)}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${beltDotClass(topic.belt)}`}
                  />
                  {beltLevel(topic.belt)}
                </span>
              </div>

              <h2 className="mt-5 text-lg font-semibold transition-colors group-hover:text-dojo-ember">
                {topic.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-dojo-muted sm:line-clamp-3">
                {topic.description}
              </p>

              <span className="mt-auto flex items-center gap-1.5 border-t border-dojo-border/70 pt-4 text-xs font-medium text-dojo-muted transition-colors group-hover:text-dojo-ember">
                Read lesson
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
