import { useState } from "react";
import { Link, useMatch } from "react-router-dom";
import { topicRegistry } from "../../topics/registry";
import { beltDotClass } from "../../topics/beltStyles";

/**
 * Topic navigation — one list, two presentations.
 *
 *   - phones: a burger button that expands the topic list in place
 *   - md and up: the familiar vertical sidebar
 *
 * Three decisions worth knowing:
 *
 * 1. The panel **expands in place** instead of floating over the content. The shell in
 *    `TutorialLayout` wraps everything in `overflow-hidden`, which would clip an
 *    absolutely-positioned dropdown — and pushing the content down is perfectly good
 *    mobile behaviour.
 * 2. It is capped at 70vh with its own scroll. The roadmap has a dozen more topics
 *    coming, and a list that long would otherwise run off the screen.
 * 3. Tapping a link closes the menu, so the panel never stays open on top of the lesson
 *    you just opened.
 *
 * Rows show `topic.shortTitle` rather than `topic.title`: the full titles are
 * "Concept — subtitle" strings and were being truncated to "Components & Props — Dat…",
 * which made the list unscannable. A two-digit lesson number leads each row so the
 * sidebar reads as an ordered path rather than an unordered bag of links.
 *
 * There is deliberately **no Escape-to-close**: that needs a keydown listener, which in
 * React means `useEffect`. Leaving it out keeps this file free of a hook the journal has
 * not taught yet — it is a good first job for `useEffect` when that topic comes up.
 */
export function Sidebar() {
  const activeSlug = useMatch("/dojo/topic/:slug")?.params.slug ?? null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeTopic = topicRegistry.find((topic) => topic.slug === activeSlug);
  const currentLabel = activeTopic?.shortTitle ?? "All Topics";

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <aside className="w-full shrink-0 border-b border-dojo-border bg-dojo-surface/30 p-3 md:w-64 md:border-b-0 md:border-r md:p-4">
      {/* Phones: the burger, showing which topic you are on. Hidden from md up,
          where the plain heading below takes its place. */}
      <button
        type="button"
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-expanded={isMenuOpen}
        aria-controls="lesson-list"
        className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm text-dojo-muted transition hover:bg-dojo-surface/60 md:hidden"
      >
        <span className="flex shrink-0 items-center gap-2">
          <span aria-hidden="true" className="text-base leading-none">
            ☰
          </span>
          <span className="text-xs uppercase tracking-wider text-dojo-ember">
            Lessons
          </span>
        </span>
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate">{currentLabel}</span>
          <span aria-hidden="true" className="text-xs">
            {isMenuOpen ? "▲" : "▼"}
          </span>
        </span>
      </button>

      <h2 className="mb-3 hidden px-2 text-xs uppercase tracking-wider text-dojo-ember md:block">
        Lessons
      </h2>

      <nav
        id="lesson-list"
        className={`${
          isMenuOpen ? "block" : "hidden"
        } mt-2 max-h-[70vh] overflow-y-auto md:mt-0 md:block md:max-h-none md:space-y-1 md:overflow-y-visible`}
      >
        <Link
          to="/dojo"
          onClick={closeMenu}
          aria-current={activeSlug === null ? "page" : undefined}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition md:px-2 md:py-1.5 ${
            activeSlug === null
              ? "border-l-2 border-dojo-ember bg-dojo-surface/80 font-medium text-dojo-ember"
              : "text-dojo-muted hover:bg-dojo-surface/60 hover:text-dojo-ember"
          }`}
        >
          <span className="w-5 shrink-0" aria-hidden="true" />
          <span className="h-2 w-2 shrink-0 rounded-full bg-dojo-ember" />
          All Topics
        </Link>

        {topicRegistry.map((topic, index) => {
          const isActive = topic.slug === activeSlug;
          return (
            <Link
              key={topic.slug}
              to={`/dojo/topic/${topic.slug}`}
              onClick={closeMenu}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition md:px-2 md:py-1.5 ${
                isActive
                  ? "border-l-2 border-dojo-ember bg-dojo-surface/80 font-medium text-dojo-ember"
                  : "text-dojo-muted hover:bg-dojo-surface/60 hover:text-dojo-ember"
              }`}
            >
              <span className="w-5 shrink-0 font-mono text-[11px] tabular-nums text-dojo-muted/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${beltDotClass(topic.belt)}`}
              />
              <span className="min-w-0 truncate">{topic.shortTitle}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
