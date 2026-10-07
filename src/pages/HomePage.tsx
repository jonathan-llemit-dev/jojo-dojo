import { Link } from "react-router-dom";

/** Three one-line answers to "what is this?" — a scannable strip under the About copy. */
const ABOUT_POINTS = ["Short lessons", "Live examples", "Sample Code"];

/**
 * Landing page served at `/`.
 *
 * The copy is deliberately short. The hero is only the eyebrow, the name, the byline and
 * the buttons — "React Training Ground" above "The Jojo Dojo" already says what this is,
 * and the dojo index shows the lessons themselves, so there is no count to advertise.
 * The About section carries the one long-form paragraph: why it exists, in the author's
 * own words.
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
          🥋 Welcome, student · v0.12
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

        <ul className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
          {ABOUT_POINTS.map((point) => (
            <li
              key={point}
              className="flex items-center justify-center gap-2 rounded-lg border border-dojo-border bg-dojo-surface/60 px-4 py-3 text-sm"
            >
              <span aria-hidden="true" className="text-dojo-ember">
                ✓
              </span>
              <span className="text-dojo-muted">{point}</span>
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
