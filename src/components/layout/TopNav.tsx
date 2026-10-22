import { Link } from "react-router-dom";
import { DojoMark } from "../ui/DojoMark";

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
    <nav className="sticky top-0 z-20 shrink-0 border-b border-dojo-border bg-dojo-bg/85 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Jojo Dojo home">
          <DojoMark className="h-7 w-7 text-dojo-ember sm:h-8 sm:w-8" />
          <span className="font-display text-lg tracking-wide text-dojo-text">
            Jojo Dojo
          </span>
        </Link>

        <div className="flex items-center gap-2 text-sm sm:gap-4">
          <Link
            to="/dojo"
            className="rounded-md px-2 py-1.5 font-medium text-dojo-muted transition-colors hover:text-dojo-ember sm:px-3"
          >
            Dojo
          </Link>
          <a
            href="https://github.com/jonathan-llemit-dev/jojo-dojo"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-dojo-border px-2 py-1.5 text-dojo-muted transition-colors hover:border-dojo-ember hover:text-dojo-ember sm:px-3"
            aria-label="GitHub repository"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
