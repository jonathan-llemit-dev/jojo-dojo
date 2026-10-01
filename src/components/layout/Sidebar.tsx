import { Link, useMatch } from "react-router-dom";
import { topicRegistry } from "../../topics/registry";
import type { BeltRank } from "../../topics/types";

/** Color mapping for belt rank badges using the dojo palette. */
function beltColor(belt: BeltRank) {
  switch (belt) {
    case "black":
      return "text-dojo-crimson border-dojo-crimson";
    default: // white | blue
      return "text-dojo-ember border-dojo-ember";
  }
}

/** Left sidebar listing all React lessons. Active topic highlights via URL match. */
export function Sidebar() {
  const activeSlug = useMatch("/dojo/topic/:slug")?.params.slug ?? null;

  return (
    <aside className="w-64 shrink-0 border-r border-dojo-border bg-dojo-surface/30 p-4">
      <h2 className="mb-4 px-2 text-xs uppercase tracking-wider text-dojo-ember">
        Lessons
      </h2>
      <nav className="space-y-1">
        <Link
          to="/dojo"
          className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition ${
            activeSlug === null
              ? "bg-dojo-surface/80 text-dojo-ember border-l-2 border-dojo-ember"
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
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition ${
                isActive
                  ? "bg-dojo-surface/80 font-medium text-dojo-ember border-l-2 border-dojo-ember"
                  : "text-dojo-muted hover:bg-dojo-surface/60 hover:text-dojo-ember"
              }`}
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${beltColor(topic.belt)}`}
              />
              <span className="truncate">{topic.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
