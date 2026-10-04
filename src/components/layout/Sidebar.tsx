import { Link, useMatch } from "react-router-dom";
import { topicRegistry } from "../../topics/registry";
import { beltDotClass } from "../../topics/beltStyles";

/** Left sidebar listing all React lessons. Active topic highlights via URL match. */
export function Sidebar() {
  const activeSlug = useMatch("/dojo/topic/:slug")?.params.slug ?? null;

  return (
    <aside className="w-full shrink-0 border-b border-dojo-border bg-dojo-surface/30 p-3 md:w-64 md:border-b-0 md:border-r md:p-4">
      <h2 className="mb-3 hidden px-2 text-xs uppercase tracking-wider text-dojo-ember md:block">
        Lessons
      </h2>
      {/* Phones: a horizontal, swipeable strip above the content.
          md and up: the usual vertical list down the left.
          Same markup and same topic list — only the layout direction changes. */}
      <nav className="flex gap-2 overflow-x-auto pb-1 md:block md:space-y-1 md:overflow-visible md:pb-0">
        <Link
          to="/dojo"
          aria-current={activeSlug === null ? "page" : undefined}
          className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition md:px-2 ${
            activeSlug === null
              ? "bg-dojo-surface/80 font-medium text-dojo-ember md:border-l-2 md:border-dojo-ember"
              : "text-dojo-muted hover:bg-dojo-surface/60 hover:text-dojo-ember"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-dojo-ember" />
          All Topics
        </Link>

        {topicRegistry.map((topic) => {
          const isActive = topic.slug === activeSlug;
          return (
            <Link
              key={topic.slug}
              to={`/dojo/topic/${topic.slug}`}
              aria-current={isActive ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition md:px-2 md:whitespace-normal ${
                isActive
                  ? "bg-dojo-surface/80 font-medium text-dojo-ember md:border-l-2 md:border-dojo-ember"
                  : "text-dojo-muted hover:bg-dojo-surface/60 hover:text-dojo-ember"
              }`}
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${beltDotClass(topic.belt)}`}
              />
              <span className="md:truncate">{topic.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
