import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { TestGreeting } from "./components/sandbox/TestGreeting";
import { TutorialLayout } from "./components/layout/TutorialLayout";
import { TopicIndex } from "./pages/TopicIndex";
import { TopicDetail } from "./components/topics/TopicDetail";

/**
 * Root route orchestrator.
 * - `/`            → landing hero (HomePage)
 * - `/dojo`        → tutorial layout shell (> TopicIndex overview)
 * - `/dojo/topic/:slug` → lesson detail with sidebar + content panel
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/test/:student/:name/:subjects" element={<TestGreeting />} />
      <Route path="/dojo" element={<TutorialLayout />}>
        <Route index element={<TopicIndex />} />
        <Route path="topic/:slug" element={<TopicDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
