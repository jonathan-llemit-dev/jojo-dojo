# 🥋 React Jojo Dojo

> **React Training Ground** — a personal dojo for building modern React apps.
> By [Jonathan Llemit Jr.](https://github.com/jonathan-llemit-dev)

A dark, dojo-themed React learning journal forged with **Vite**, styled with **Tailwind CSS v4**, and ready to deploy on **Vercel**. The landing page is at `/`; every React lesson then lives at its own URL under `/dojo`. Every commit is a rep. Every deploy is a rank up.

---

## ✨ Features

- ⚡ **Vite 8** — lightning-fast dev server & optimized builds
- ⚛️ **React 19** — modern hooks-based components
- 🧭 **React Router v7** — a lesson per URL, with a sidebar that stays put
- 🟦 **TypeScript** — type-safe from day one
- 🎨 **Tailwind CSS v4** — utility-first styling with a custom dojo theme
- 🚀 **Vercel-ready** — push to `main`, deploy automatically
- 🌑 **Dark theme** — warm ember accents on deep charcoal
- 📱 **Mobile-ready** — the lesson sidebar collapses to a swipeable strip on small screens

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v20.19+ or v22.12+** (required by Vite 8)
- npm (comes with Node) or pnpm/yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/jonathan-llemit-dev/my-react-app
cd my-react-app

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the dojo.

---

## 🛠 Available Scripts

| Command           | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `npm run dev`     | Start the dev server with HMR                          |
| `npm run build`   | Type-check + build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally                   |
| `npm run lint`    | Run ESLint across the project                          |

---

## 📁 Project Structure

```
my-react-app/
├── public/                    # Static assets served as-is
├── src/
│   ├── main.tsx               # React entry point (<BrowserRouter> + <App />)
│   ├── App.tsx                # Route table only — no page content lives here
│   ├── index.css              # Tailwind import + custom @theme tokens
│   ├── assets/                # Images/SVGs (currently unreferenced scaffold files)
│   ├── components/
│   │   ├── layout/            # TutorialLayout (the shell), Sidebar, TopNav
│   │   ├── sandbox/           # Scratch components for experiments — not real pages
│   │   └── topics/            # TopicDetail — the individual lesson page
│   ├── pages/                 # HomePage (landing), TopicIndex (lesson grid)
│   └── topics/                # The lessons themselves
│       ├── types.ts           # BeltRank + Topic types
│       ├── beltStyles.ts      # BeltRank -> Tailwind classes
│       ├── registry.ts        # The list of lessons (source of truth)
│       ├── jsx/               # One folder per lesson: demo.tsx + index.ts
│       ├── components-props/  # One folder per lesson: demo.tsx + index.ts
│       └── use-state/         # One folder per lesson: demo.tsx + index.ts
├── index.html                 # HTML shell
├── vite.config.ts             # Vite + Tailwind plugin config
├── vercel.json                # SPA fallback so deep links work when deployed
├── CLAUDE.md                  # Architecture notes (written for AI assistants)
├── NOTES.md                   # Per-topic study notes
├── ROADMAP.md                 # What to learn and build next
└── package.json
```

---

## 🎨 The Dojo Theme

Custom design tokens live in `src/index.css` under `@theme`, so they become real Tailwind utilities:

| Token                       | Utility                | Use                   |
| --------------------------- | ---------------------- | --------------------- |
| `--color-dojo-bg`           | `bg-dojo-bg`           | Page background       |
| `--color-dojo-surface`      | `bg-dojo-surface`      | Cards, panels         |
| `--color-dojo-border`       | `border-dojo-border`   | Dividers, outlines    |
| `--color-dojo-ember`        | `text-dojo-ember`      | Primary accent (gold) |
| `--color-dojo-ember-bright` | `bg-dojo-ember-bright` | Hover accent          |
| `--color-dojo-crimson`      | `text-dojo-crimson`    | Danger / intensity    |
| `--color-dojo-muted`        | `text-dojo-muted`      | Secondary text        |
| `--color-dojo-text`         | `text-dojo-text`       | Primary text          |
| `--font-display`            | `font-display`         | Body font family      |

---

## ☁️ Deploying to Vercel

### Option A — Dashboard (recommended)

1. Push your repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New → Project**.
3. Import your `my-react-app` repo.
4. Vercel auto-detects **Vite** — leave defaults.
5. Click **Deploy**. Done in ~30 seconds.

### Option B — CLI

```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```

### Continuous Deployment

Once connected, **every push to `main` auto-deploys to production**, and every PR gets a unique preview URL.

---

## 🗺 Roadmap

This mirrors `ROADMAP.md`. That file is the one to edit — keep this list in step with it.

- [x] Vite + React + TypeScript scaffold
- [x] Tailwind CSS v4 with custom dojo theme
- [x] Personalized landing page (hero + about)
- [x] Multi-page routing (React Router v7) — `/`, `/dojo`, `/dojo/topic/:slug`
- [x] First lesson: `useState` at `/dojo/topic/use-state`
- [x] Mobile-responsive layout
- [ ] Deploy v0.1.0 to Vercel
- [ ] More lessons (topic list lives in `ROADMAP.md`)
- [ ] Framer Motion animations
- [ ] Light/dark theme toggle
- [ ] Social links (GitHub, LinkedIn)
- [ ] Custom domain

---

## 📄 License

Personal project by **Jonathan Llemit Jr.** — feel free to fork for inspiration, but please credit the original.

---

<p align="center">
  <strong>🥋 React Jojo Dojo</strong><br/>
  <em>Forged with Vite · Tailwind · Vercel</em><br/>
  <sub>© Jonathan Llemit Jr.</sub>
</p>
