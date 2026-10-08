import { Link } from "react-router-dom";

/**
 * Top navigation for the tutorial shell — `/dojo` and every lesson page under it.
 *
 * Note: the landing page (`pages/HomePage.tsx`) renders its own smaller nav instead,
 * because it links to `#about` and has no sidebar beside it. That duplicated markup is
 * the place to start if the two ever need to share the same links.
 *
 * "Dojo" navigates to /dojo (internal) rather than opening GitHub.
 */
export function TopNav() {
  return (
    <nav className="sticky top-0 z-20 shrink-0 border-b border-dojo-border bg-dojo-bg/80 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">🥋</span>
          <span className="bg-gradient-to-r from-dojo-ember via-dojo-ember-bright to-dojo-crimson bg-clip-text text-transparent">
            Jojo Dojo
          </span>
        </Link>

        <div className="flex items-center gap-2 text-sm sm:gap-4">
          <Link
            to="/dojo"
            className="rounded-md px-2 py-1.5 font-medium text-dojo-muted transition hover:text-dojo-ember sm:px-3"
          >
            Dojo
          </Link>
          <a
            href="https://github.com/jonathan-llemit-dev/jojo-dojo"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-dojo-border px-2 py-1.5 text-dojo-muted transition hover:border-dojo-ember hover:text-dojo-ember sm:px-3"
            aria-label="GitHub repository"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
