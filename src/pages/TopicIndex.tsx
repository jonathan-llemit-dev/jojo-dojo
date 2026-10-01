import { Link } from "react-router-dom";
import { topicRegistry } from "../topics/registry";
import type { BeltRank } from "../topics/types";

/** Color mapping for belt rank indicators. */
function beltColor(belt: BeltRank) {
  switch (belt) {
    case "black":
      return "text-dojo-crimson border-dojo-crimson";
    default: // white | blue
      return "text-dojo-ember border-dojo-ember";
  }
}

/** Default content rendered at `/dojo` — welcome text + overview grid of all topics. */
export function TopicIndex() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Welcome to the Dojo</h1>
      <p className="text-dojo-muted mb-8">
        Choose a topic from the sidebar above, or pick one below to start learning.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {topicRegistry.map((topic) => (
          <Link
            key={topic.slug}
            to={`/dojo/topic/${topic.slug}`}
            className="group block rounded-xl border border-dojo-border bg-dojo-surface/60 p-5 hover:border-dojo-ember transition"
          >
            <div className="flex items-start justify-between mb-2">
              <h2 className="font-semibold text-lg group-hover:text-dojo-ember transition">
                {topic.title}
              </h2>
              <span
                className={`ml-3 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${beltColor(topic.belt)}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${beltColor(topic.belt)}`}></span>
                {topic.belt}
              </span>
            </div>
            <p className="text-sm text-dojo-muted">{topic.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
