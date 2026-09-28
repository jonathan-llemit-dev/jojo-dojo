import { useState } from "react";

type Feature = {
  icon: string;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: "⚡",
    title: "Lightning Fast",
    description: "Powered by Vite for instant hot reload and optimized builds.",
  },
  {
    icon: "🎨",
    title: "Styled with Tailwind",
    description: "Utility-first CSS for rapid, consistent UI development.",
  },
  {
    icon: "🚀",
    title: "Deploy in Seconds",
    description: "Push to GitHub and Vercel handles the rest automatically.",
  },
];

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between backdrop-blur sticky top-0 bg-neutral-950/80 z-10">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-xl">🚀</span>
          <span>MyReactApp</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-neutral-400">
          <a href="#features" className="hover:text-white transition">
            Features
          </a>
          <a href="#demo" className="hover:text-white transition">
            Demo
          </a>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-md bg-white text-black hover:bg-neutral-200 transition"
          >
            Deploy
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 px-6 py-24 flex flex-col items-center text-center">
        <span className="mb-4 px-3 py-1 text-xs rounded-full border border-neutral-700 text-neutral-400">
          v0.1.0 · Built with Vite + React + TS
        </span>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
          Build something{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            remarkable
          </span>
        </h1>

        <p className="mt-6 text-lg text-neutral-400 max-w-xl">
          A modern React starter — styled with Tailwind, ready for Vercel, and
          built to grow with your ideas.
        </p>

        <div className="mt-8 flex gap-3">
          <a
            href="#features"
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-medium"
          >
            Get Started
          </a>
          <a
            href="#demo"
            className="px-5 py-2.5 rounded-lg border border-neutral-700 hover:border-neutral-500 transition font-medium"
          >
            See Demo
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 border-t border-neutral-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="demo" className="px-6 py-20 border-t border-neutral-800">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Interactive Demo</h2>
          <p className="text-neutral-400 mb-8">
            State management works out of the box.
          </p>

          <div className="inline-flex items-center gap-4 p-6 rounded-xl border border-neutral-800 bg-neutral-900/50">
            <button
              onClick={() => setCount((c) => c - 1)}
              className="w-10 h-10 rounded-lg border border-neutral-700 hover:bg-neutral-800 transition text-xl"
            >
              −
            </button>
            <span className="text-3xl font-mono w-16 tabular-nums">
              {count}
            </span>
            <button
              onClick={() => setCount((c) => c + 1)}
              className="w-10 h-10 rounded-lg border border-neutral-700 hover:bg-neutral-800 transition text-xl"
            >
              +
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 px-6 py-8 text-center text-sm text-neutral-500">
        <p>© {new Date().getFullYear()} MyReactApp · Ready for Vercel</p>
      </footer>
    </div>
  );
}

export default App;
