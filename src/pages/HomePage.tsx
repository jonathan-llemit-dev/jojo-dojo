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

/**
 * Four one-line answers to "what is this?" — a scannable strip under the About copy.
 *
 * The emoji is decoration only (`aria-hidden`), so each entry still reads as a sentence if
 * the glyph does not render: the title carries the meaning, the body explains it.
 */
const ABOUT_POINTS = [
  {
    emoji: "⚡",
    title: "Short lessons",
    body: "One concept per lesson: an explanation, a snippet, and a demo you can run.",
  },
  {
    emoji: "🧪",
    title: "Live examples",
    body: "Every demo is real, not a screenshot. Click them, break them, see what happens.",
  },
  {
    emoji: "📜",
    title: "Sample code",
    body: "The exact code behind each demo — a line-for-line mirror of what is running.",
  },
  {
    emoji: "🧭",
    title: "A guided path",
    body: "Topics are numbered in the order they build on each other, white belt through black.",
  },
];

/**
 * Landing page served at `/`.
 *
 * The copy is deliberately short. The hero is only the eyebrow, the name, the byline and
 * the buttons. The About section carries the one long-form paragraph, in the author's own
 * words, and the belt path below it answers the next question a visitor has: how much React
 * does each lesson assume, and which lessons are which.
 *
 * The belt path is **derived, not written out**. The three ranks come from `BELT_ORDER` and
 * the lessons under each one are filtered from `topicRegistry`, so a new lesson files itself
 * under the right belt with no edit to this file — and the section cannot fall out of step
 * with the badges on the cards, in the sidebar or on the lesson pages.
 */
export function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col z-10">
      {/* Top nav — branding only on landing */}
      <nav className="border-b border-dojo-border px-4 py-4 flex items-center justify-between backdrop-blur bg-dojo-bg/80 sticky top-0 z-20 sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-xl">🥋</span>
          <span className="bg-gradient-to-r from-dojo-ember via-dojo-ember-bright to-dojo-crimson bg-clip-text text-transparent">
            Jojo Dojo
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-dojo-muted sm:gap-6">
          <a href="#about" className="hover:text-dojo-ember transition">
            About
          </a>
          <a href="#belts" className="hover:text-dojo-ember transition">
            Belts
          </a>
          <a
            href="https://github.com/jonathan-llemit-dev/jojo-dojo"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-md bg-dojo-ember text-black hover:bg-dojo-ember-bright transition font-medium"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 px-4 py-16 flex flex-col items-center text-center sm:px-6 sm:py-24">
        <span className="mb-4 px-3 py-1 text-xs rounded-full border border-dojo-border text-dojo-muted">
          🥋 Welcome, student · v0.17
        </span>

        <p className="text-dojo-ember tracking-[0.3em] uppercase text-sm mb-4">
          React Training Ground
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold">
          The{" "}
          <span className="bg-gradient-to-r from-dojo-ember via-dojo-ember-bright to-dojo-crimson bg-clip-text text-transparent">
            Jojo Dojo
          </span>
        </h1>

        <p className="mt-6 text-sm uppercase tracking-[0.25em] text-dojo-ember">
          by Jonathan Llemit Jr.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/dojo"
            className="px-5 py-2.5 rounded-lg bg-dojo-ember text-black hover:bg-dojo-ember-bright transition font-medium"
          >
            Enter the Dojo
          </Link>
          <a
            href="#about"
            className="px-5 py-2.5 rounded-lg border border-dojo-border hover:border-dojo-ember transition font-medium"
          >
            About
          </a>
        </div>
      </section>

      {/* About — this is the element the #about links above and in the hero jump to.
          Without an id="about" somewhere on the page those links do nothing. */}
      <section
        id="about"
        className="border-t border-dojo-border px-4 py-16 text-center scroll-mt-20 sm:px-6"
      >
        <h2 className="text-2xl font-bold mb-5">
          About the <span className="text-dojo-ember">Dojo</span>
        </h2>

        <div className="mx-auto max-w-2xl space-y-4 text-pretty text-dojo-muted leading-relaxed">
          <p>
            I started this as my own training ground — somewhere to practise React and
            keep the fundamentals sharp. Then I opened it up: it is now for anyone
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
        <ul className="mx-auto mt-10 grid max-w-2xl list-none gap-3 p-0 text-left sm:grid-cols-2">
          {ABOUT_POINTS.map((point) => (
            <li
              key={point.title}
              className="flex items-start gap-3 rounded-lg border border-dojo-border bg-dojo-surface/60 px-4 py-3"
            >
              <span aria-hidden="true" className="text-lg leading-6">
                {point.emoji}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-dojo-text">
                  {point.title}
                </span>
                <span className="block text-xs leading-relaxed text-dojo-muted">
                  {point.body}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Belt path — the difficulty scale, and which lessons sit at each rank. */}
      <section
        id="belts"
        className="border-t border-dojo-border px-4 py-16 text-center scroll-mt-20 sm:px-6"
      >
        <h2 className="text-2xl font-bold mb-5">
          From white belt to <span className="text-dojo-ember">black</span>
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-pretty leading-relaxed text-dojo-muted">
          Every lesson wears a belt, so you can see how much React it assumes before you
          start. The same three colours mark the cards in the dojo and the lessons in the
          sidebar.
        </p>

        <ul className="mx-auto grid max-w-4xl list-none gap-4 p-0 text-left md:grid-cols-3">
          {BELT_ORDER.map((belt) => (
            <li
              key={belt}
              className="flex flex-col rounded-xl border border-dojo-border bg-dojo-surface/60 p-5 transition hover:border-dojo-ember"
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
                        className="inline-block rounded-md border border-dojo-border px-2 py-1 text-xs text-dojo-muted transition hover:border-dojo-ember hover:text-dojo-ember"
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

      {/* Footer */}
      <footer className="border-t border-dojo-border px-4 py-8 text-center text-sm text-dojo-muted sm:px-6">
        <p className="mb-2">
          Jojo Dojo ·{" "}
          <span className="text-dojo-ember">by Jonathan Llemit Jr.</span>
        </p>
        <p>
          © {new Date().getFullYear()} · Forged with Vite · Tailwind · Vercel
        </p>
      </footer>
    </div>
  );
}
