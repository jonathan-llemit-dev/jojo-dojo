# 🥋 React Jojo Dojo

> **React Training Ground** — a personal dojo for building modern React apps.
> By [Jonathan Llemit Jr.](https://github.com/jonathan-llemit-dev)

A dark, dojo-themed React starter forged with **Vite**, styled with **Tailwind CSS v4**, and ready to deploy on **Vercel**. Every commit is a rep. Every deploy is a rank up.

---

## ✨ Features

- ⚡ **Vite** — lightning-fast dev server & optimized builds
- ⚛️ **React 18** — modern hooks-based components
- 🟦 **TypeScript** — type-safe from day one
- 🎨 **Tailwind CSS v4** — utility-first styling with a custom dojo theme
- 🚀 **Vercel-ready** — push to `main`, deploy automatically
- 🌑 **Dark theme** — warm ember accents on deep charcoal

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v18+**
- npm (comes with Node) or pnpm/yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/jonathan-llemit-dev/my-react-app
cd react-jojo-dojo

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
react-jojo-dojo/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images, SVGs
│   ├── App.tsx           # Main landing page component
│   ├── main.tsx          # React entry point
│   └── index.css         # Tailwind import + custom @theme tokens
├── index.html            # HTML shell
├── vite.config.ts        # Vite + Tailwind plugin config
├── tsconfig.json         # TypeScript config
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

---

## ☁️ Deploying to Vercel

### Option A — Dashboard (recommended)

1. Push your repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New → Project**.
3. Import your `react-jojo-dojo` repo.
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

- [x] Vite + React + TypeScript scaffold
- [x] Tailwind CSS v4 with custom dojo theme
- [x] Personalized landing page (hero, techniques, training, about)
- [ ] Deploy v0.1.0 to Vercel
- [ ] Framer Motion animations
- [ ] Light/dark theme toggle
- [ ] Multi-page routing (React Router)
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
