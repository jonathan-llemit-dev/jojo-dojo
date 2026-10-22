import { Link } from "react-router-dom";
import { topicRegistry } from "../topics/registry";
import {
  BELT_ORDER,
  beltBadgeClass,
  beltBlurb,
  beltDotClass,
  beltLevel,
  beltName,
} from "../topics/beltStyles";
import { DojoMark } from "../components/ui/DojoMark";
import { BoltIcon, CodeIcon, CompassIcon, FlaskIcon } from "../components/ui/Icons";

/**
 * Four one-line answers to "what is this?" — a scannable list under the About
 * copy. The icons are authored SVG, not emoji, so they inherit the palette and
 * keep one stroke weight across platforms.
 */
const ABOUT_POINTS = [
  {
    icon: BoltIcon,
    title: "Short lessons",
    body: "One concept per lesson: an explanation, a snippet, and a demo you can run.",
  },
  {
    icon: FlaskIcon,
    title: "Live examples",
    body: "Every demo is real, not a screenshot. Click them, break them, see what happens.",
  },
  {
    icon: CodeIcon,
    title: "Sample code",
    body: "The exact code behind each demo — a line-for-line mirror of what is running.",
  },
  {
    icon: CompassIcon,
    title: "A guided path",
    body: "Topics are numbered in the order they build on each other, white belt through black.",
  },
];

/**
 * Landing page served at `/`.
 *
 * The hero is the name, one line of orientation, the byline and the buttons.
 * The About section carries the long-form paragraph in the author's own words,
 * and the belt path below answers the next question a visitor has: how much
 * React does each lesson assume, and which lessons are which.
 *
 * The belt path is **derived, not written out**. The three ranks come from
 * `BELT_ORDER` and the lessons under each one are filtered from `topicRegistry`,
 * so a new lesson files itself under the right belt with no edit to this file —
 * and the section cannot fall out of step with the badges on the cards, in the
 * sidebar or on the lesson pages.
 */
export function HomePage() {
  return (
    <div className="relative z-10 flex min-h-dvh flex-col">
      {/* Top nav — branding only on landing */}
      <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-dojo-border bg-dojo-bg/85 px-4 py-4 backdrop-blur sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Jojo Dojo home">
          <DojoMark className="h-7 w-7 text-dojo-ember sm:h-8 sm:w-8" />
          <span className="font-display text-xl tracking-wide text-dojo-text">
            Jojo Dojo
          </span>
        </Link>
        <div className="flex items-center gap-3 text-sm text-dojo-muted sm:gap-6">
          <a href="#about" className="transition-colors hover:text-dojo-ember">
            About
          </a>
          <a href="#belts" className="transition-colors hover:text-dojo-ember">
            Belts
          </a>
          <a
            href="https://github.com/jonathan-llemit-dev/jojo-dojo"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-dojo-border px-3 py-1.5 font-medium text-dojo-text transition-colors hover:border-dojo-ember hover:text-dojo-ember"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-20 text-center sm:px-6 sm:py-28">
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="font-display text-6xl leading-[0.88] tracking-wide text-dojo-text sm:text-7xl md:text-8xl">
            The <span className="text-dojo-ember">Jojo Dojo</span>
          </h1>

          <div className="mt-5 flex items-center gap-1.5" aria-hidden="true">
            <span className="h-0.5 w-8 rounded-full bg-dojo-muted/70" />
            <span className="h-0.5 w-8 rounded-full bg-dojo-azure/70" />
            <span className="h-0.5 w-8 rounded-full bg-dojo-crimson/70" />
          </div>

          <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-dojo-muted sm:text-lg">
            A React training ground: one concept, one demo, one belt at a time.
          </p>
          <p className="mt-4 text-sm text-dojo-muted">by Jonathan Llemit Jr.</p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/dojo"
              className="rounded-lg bg-dojo-ember px-5 py-2.5 font-medium text-black transition-colors hover:bg-dojo-ember-bright"
            >
              Enter the Dojo
            </Link>
            <a
              href="#about"
              className="rounded-lg border border-dojo-border px-5 py-2.5 font-medium text-dojo-text transition-colors hover:border-dojo-ember hover:text-dojo-ember"
            >
              About
            </a>
          </div>
        </div>
      </section>

      {/* About — this is the element the #about links above and in the hero jump to. */}
      <section
        id="about"
        className="scroll-mt-20 border-t border-dojo-border px-4 py-16 text-center sm:px-6"
      >
        <h2 className="font-display text-4xl tracking-wide">
          About the <span className="text-dojo-ember">Dojo</span>
        </h2>

        <div className="mx-auto mt-5 max-w-2xl space-y-4 text-pretty leading-relaxed text-dojo-muted">
          <p>
            I started this as my own training ground — somewhere to practice React and
            keep my fundamentals sharp. Then I opened it up: it is now for anyone
            learning React, or revisiting the topics that matter, to work through lesson
            by lesson.
          </p>
          <p>
            Strong fundamentals are a must, so the lessons stay short — an explanation, a
            sample snippet, and a live example you can click and break.
          </p>
        </div>

        {/* `text-left` because the section centres its prose; a list of icon + title + body
            reads badly centred, and worse on a phone where each entry wraps. */}
        <ul className="mx-auto mt-12 grid max-w-3xl list-none gap-x-10 gap-y-8 p-0 text-left sm:grid-cols-2">
          {ABOUT_POINTS.map((point) => {
            const PointIcon = point.icon;
            return (
              <li
                key={point.title}
                className="flex items-start gap-3 border-t border-dojo-border pt-4"
              >
                <PointIcon className="mt-0.5 h-4 w-4 shrink-0 text-dojo-ember" />
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-dojo-text">{point.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-dojo-muted">
                    {point.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Belt path — the difficulty scale, and which lessons sit at each rank. */}
      <section
        id="belts"
        className="scroll-mt-20 border-t border-dojo-border px-4 py-16 text-center sm:px-6"
      >
        <h2 className="font-display text-4xl tracking-wide">
          From white belt to <span className="text-dojo-ember">black</span>
        </h2>

        <p className="mx-auto mb-10 mt-5 max-w-2xl text-pretty leading-relaxed text-dojo-muted">
          Every lesson wears a belt, so you can see how much React it assumes before you
          start. The same three colours mark the cards in the dojo and the lessons in the
          sidebar.
        </p>

        <ul className="mx-auto grid max-w-4xl list-none gap-4 p-0 text-left md:grid-cols-3">
          {BELT_ORDER.map((belt) => (
            <li
              key={belt}
              className="flex flex-col rounded-xl border border-dojo-border bg-dojo-surface/40 p-5 transition-colors hover:border-dojo-ember/60 focus-within:border-dojo-ember/60"
            >
              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${beltBadgeClass(belt)}`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${beltDotClass(belt)}`}
                />
                {beltName(belt)} · {beltLevel(belt)}
              </span>

              <p className="mt-3 text-sm leading-relaxed text-dojo-muted">
                {beltBlurb(belt)}
              </p>

              <ul className="mt-4 flex list-none flex-wrap gap-2 p-0">
                {topicRegistry
                  .filter((topic) => topic.belt === belt)
                  .map((topic) => (
                    <li key={topic.slug}>
                      <Link
                        to={`/dojo/topic/${topic.slug}`}
                        className="inline-block rounded-md border border-dojo-border px-2 py-1 text-xs text-dojo-muted transition-colors hover:border-dojo-ember hover:text-dojo-ember"
                      >
                        {topic.shortTitle}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-dojo-border px-4 py-8 text-center text-sm text-dojo-muted sm:px-6">
        <p className="mb-2">
          Jojo Dojo · <span className="text-dojo-ember">by Jonathan Llemit Jr.</span>
        </p>
        <p>
          © {new Date().getFullYear()} · v0.20 · Forged with Vite · Tailwind · Vercel
        </p>
      </footer>
    </div>
  );
}
