import { useState } from "react";

type Technique = {
  icon: string;
  name: string;
  belt: string;
  description: string;
};

const techniques: Technique[] = [
  {
    icon: "⚡",
    name: "Vite Strike",
    belt: "White Belt",
    description:
      "Instant hot reload and lightning builds. Your first move as a React warrior.",
  },
  {
    icon: "🎨",
    name: "Tailwind Flow",
    belt: "Blue Belt",
    description:
      "Utility-first styling that moves with you. Fluid, fast, and consistent.",
  },
  {
    icon: "🚀",
    name: "Vercel Launch",
    belt: "Black Belt",
    description:
      "Push to main and watch it fly. Continuous deployment, mastered.",
  },
];

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="relative min-h-screen flex flex-col z-10">
      {/* Navbar */}
      <nav className="border-b border-dojo-border px-6 py-4 flex items-center justify-between backdrop-blur sticky top-0 bg-dojo-bg/80 z-20">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-xl">🥋</span>
          <span className="bg-gradient-to-r from-dojo-ember via-dojo-ember-bright to-dojo-crimson bg-clip-text text-transparent">
            Jojo Dojo
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm text-dojo-muted">
          <a href="#techniques" className="hover:text-dojo-ember transition">
            Techniques
          </a>
          <a href="#training" className="hover:text-dojo-ember transition">
            Training
          </a>
          <a href="#about" className="hover:text-dojo-ember transition">
            About
          </a>
          <a
            href="https://github.com/jonathan-llemit-dev/my-react-app"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-md bg-dojo-ember text-black hover:bg-dojo-ember-bright transition font-medium"
          >
            Enter the Dojo
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 px-6 py-24 flex flex-col items-center text-center">
        <span className="mb-4 px-3 py-1 text-xs rounded-full border border-dojo-border text-dojo-muted">
          🥋 Welcome, student · v0.1.0
        </span>

        <p className="text-dojo-ember tracking-[0.3em] uppercase text-sm mb-4">
          React Training Ground
        </p>
        <h1 className="text-5xl md:text-7xl font-bold">
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
          <a
            href="#techniques"
            className="px-5 py-2.5 rounded-lg bg-dojo-ember text-black hover:bg-dojo-ember-bright transition font-medium"
          >
            Learn the Techniques
          </a>
          <a
            href="#training"
            className="px-5 py-2.5 rounded-lg border border-dojo-border hover:border-dojo-ember transition font-medium"
          >
            Begin Training
          </a>
        </div>
      </section>

      {/* Techniques */}
      <section
        id="techniques"
        className="px-6 py-20 border-t border-dojo-border"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-dojo-ember text-sm uppercase tracking-[0.2em] mb-2">
              The Curriculum
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Techniques of the Dojo
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {techniques.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-xl border border-dojo-border bg-dojo-surface/60 hover:border-dojo-ember/60 transition group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform origin-left">
                  {t.icon}
                </div>
                <p className="text-xs uppercase tracking-wider text-dojo-ember mb-1">
                  {t.belt}
                </p>
                <h3 className="font-semibold text-lg mb-2">{t.name}</h3>
                <p className="text-sm text-dojo-muted leading-relaxed">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training (counter) */}
      <section id="training" className="px-6 py-20 border-t border-dojo-border">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-dojo-ember text-sm uppercase tracking-[0.2em] mb-2">
            Daily Reps
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Focus & Discipline
          </h2>
          <p className="text-dojo-muted mb-8">
            Every rep counts. Track your progress, one rep at a time.
          </p>

          <div className="inline-flex items-center gap-6 p-6 rounded-xl border border-dojo-border bg-dojo-surface/60">
            <button
              onClick={() => setCount((c) => c - 1)}
              className="w-11 h-11 rounded-lg border border-dojo-border hover:border-dojo-crimson hover:bg-dojo-crimson/10 transition text-xl"
              aria-label="Decrease reps"
            >
              −
            </button>
            <div className="min-w-[4rem]">
              <span className="text-4xl font-mono tabular-nums text-dojo-ember">
                {count}
              </span>
              <p className="text-xs text-dojo-muted mt-1">reps</p>
            </div>
            <button
              onClick={() => setCount((c) => c + 1)}
              className="w-11 h-11 rounded-lg border border-dojo-border hover:border-dojo-ember hover:bg-dojo-ember/10 transition text-xl"
              aria-label="Increase reps"
            >
              +
            </button>
          </div>

          {count > 0 && (
            <p className="mt-6 text-sm text-dojo-muted">
              {count < 5 && "🌱 Warming up…"}
              {count >= 5 && count < 20 && "🔥 Getting stronger."}
              {count >= 20 && count < 50 && "💪 Serious training."}
              {count >= 50 && "🥋 Master level."}
            </p>
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-20 border-t border-dojo-border">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-dojo-ember text-sm uppercase tracking-[0.2em] mb-2">
            The Sensei
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            About the{" "}
            <span className="bg-gradient-to-r from-dojo-ember via-dojo-ember-bright to-dojo-crimson bg-clip-text text-transparent">
              Jojo Dojo
            </span>
          </h2>
          <p className="text-dojo-muted leading-relaxed">
            This is the personal workshop of{" "}
            <span className="text-dojo-text font-medium">
              Jonathan Llemit Jr.
            </span>{" "}
            — a place to sharpen React skills, experiment with modern tooling,
            and ship real projects. Every commit is a rep. Every deploy is a
            rank up.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dojo-border px-6 py-8 text-center text-sm text-dojo-muted">
        <p className="mb-2">
          Jojo Dojo ·{" "}
          <span className="text-dojo-ember">by Jonathan Llemit Jr.</span>
        </p>
        <p>
          © {new Date().getFullYear()} · Forged with{" "}
          <span className="text-dojo-ember">Vite</span> ·{" "}
          <span className="text-dojo-ember">Tailwind</span> ·{" "}
          <span className="text-dojo-ember">Vercel</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
