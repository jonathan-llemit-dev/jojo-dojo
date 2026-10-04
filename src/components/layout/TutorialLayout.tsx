import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

/**
 * Tutorial shell used for /dojo and all /dojo/topic/:slug routes.
 * Renders the shared top nav, a lesson sidebar on the left, and the <Outlet />
 * (topic index or topic detail) in the main panel. Writing the sidebar once here
 * guarantees it persists across every topic view.
 */
export function TutorialLayout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <TopNav />
      {/* Phones: sidebar strip on top, content below. md and up: side by side. */}
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
