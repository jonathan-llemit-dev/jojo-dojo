import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

/** How far down the page has to be before the "back to top" button fades in. */
const BACK_TO_TOP_AFTER = 400;

/**
 * Tutorial shell used for /dojo and all /dojo/topic/:slug routes.
 * Renders the shared top nav, a lesson sidebar on the left, and the <Outlet />
 * (topic index or topic detail) in the main panel. Writing the sidebar once here
 * guarantees it persists across every topic view.
 *
 * **Two scroll models, because phones and desktops want different things.**
 *
 *   - below `md` the page scrolls normally: the burger nav sits at the top, the lesson
 *     flows underneath it, and the browser's own scrolling does the work;
 *   - from `md` up the shell is exactly one viewport tall (`md:h-dvh` + `overflow-hidden`),
 *     so the lesson pane and the topic list each get **their own scrollbar**. Reading a long
 *     lesson no longer drags the topic list off the screen, and scrolling the list does not
 *     move the lesson.
 *
 * `h-dvh` rather than `h-screen` on purpose: `100vh` on a phone is the *largest* viewport
 * height (toolbars hidden), so a `100vh` shell runs under the browser chrome. `dvh` tracks
 * the real height as the toolbars come and go.
 */
export function TutorialLayout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Two scrollers can be live at once — the window on phones, `main` from md up — so this
  // watches both and takes the larger offset. Scrolling the one that is not in use is a
  // no-op, which keeps this to a single code path instead of a breakpoint check.
  useEffect(() => {
    const main = mainRef.current;

    const handleScroll = () => {
      const offset = Math.max(window.scrollY, main?.scrollTop ?? 0);
      setShowBackToTop(offset > BACK_TO_TOP_AFTER);
    };

    // Deferred by one frame: a synchronous setState in an effect body is what
    // `react-hooks/set-state-in-effect` rejects, and the first paint is the first moment
    // the real scroll offset is knowable anyway.
    const frame = requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    main?.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      main?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // A new lesson starts at the top. Without this the pane keeps the previous lesson's
  // offset, so a long topic opens halfway down — the same annoyance the button below
  // exists to fix, arriving from the other direction.
  useEffect(() => {
    if (pathname) {
      mainRef.current?.scrollTo({ top: 0 });
      window.scrollTo({ top: 0 });
    }
  }, [pathname]);

  const handleBackToTop = () => {
    // Respect the OS "reduce motion" setting instead of always animating.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
    window.scrollTo({ top: 0, behavior });
    mainRef.current?.scrollTo({ top: 0, behavior });
  };

  return (
    <div className="relative flex min-h-dvh flex-col md:h-dvh md:overflow-hidden">
      <TopNav />

      {/* Phones: page scrolls, nav on top. md and up: viewport-height shell, two panes,
          two independent scrollbars. */}
      <div className="flex flex-1 flex-col md:min-h-0 md:flex-row md:overflow-hidden">
        <Sidebar />
        <main
          ref={mainRef}
          className="flex-1 px-4 py-6 md:min-h-0 md:overflow-y-auto md:px-6 md:py-8"
        >
          <Outlet />
        </main>
      </div>

      {/* Kept mounted and faded rather than added and removed, so the transition runs.
          While it is invisible it is also inert — pointer-events off, out of the tab
          order, and hidden from assistive tech — because a faded-out button that still
          takes focus is a trap. */}
      <button
        type="button"
        onClick={handleBackToTop}
        aria-label="Back to top"
        aria-hidden={!showBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
        className={`fixed right-5 bottom-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-dojo-border bg-dojo-surface text-lg text-dojo-ember shadow-lg shadow-black/40 transition-opacity duration-200 hover:border-dojo-ember hover:text-dojo-ember-bright md:right-8 md:bottom-8 ${
          showBackToTop ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <span aria-hidden="true">↑</span>
      </button>
    </div>
  );
}
