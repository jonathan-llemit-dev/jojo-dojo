import { Link } from "react-router-dom";

/**
 * Landing page served at `/`.
 * Extracted from the original single-page App.tsx hero section.
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
            href="https://github.com/jonathan-llemit-dev/my-react-app"
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
          🥋 Welcome, student · v0.08
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

        <p className="mt-6 text-lg text-dojo-muted max-w-xl">
          A personal dojo for building modern React apps — forged with Vite,
          styled with Tailwind, and ready for Vercel.
        </p>

        <p className="mt-4 text-sm uppercase tracking-[0.25em] text-dojo-ember">
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
        <h2 className="text-2xl font-bold mb-4">
          About the <span className="text-dojo-ember">Dojo</span>
        </h2>
        <p className="mx-auto max-w-2xl text-dojo-muted leading-relaxed">
          React Jojo Dojo is a personal training journal for learning React. Every
          lesson gets its own URL under{" "}
          <code className="text-dojo-ember">/dojo</code>: an explanation, a sample
          snippet, and a live component you can actually click. The study notes for
          each topic are kept in{" "}
          <code className="text-dojo-ember">NOTES.md</code>.
        </p>
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
