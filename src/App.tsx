import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 My React App</h1>
        <p>Deployed on Vercel • Built with Vite + TypeScript</p>
      </header>

      <main className="app-main">
        <div className="card">
          <button onClick={() => setCount((c) => c + 1)}>
            Count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR.
          </p>
        </div>
      </main>

      <footer className="app-footer">
        <p>v0.1.0 — Let's build something great.</p>
      </footer>
    </div>
  );
}

export default App;
