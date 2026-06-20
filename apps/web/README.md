# PromptVerse X Frontend 💻

The PromptVerse X frontend is a Next.js 15 App Router web application built with React 19, Tailwind CSS v4 (configured via `@tailwindcss/postcss`), and Framer Motion.

---

## 🚀 Key Operations Features

- **Interactive Canvas Backdrop**: A high-efficiency particle web drawing script linked to mouse client coordinates.
- **Prompt IDE Simulation**: Typewriter log simulator supporting intent routing, planner compilation, and safety guardrails.
- **Operations Dashboard (`/app`)**: Telemetry metrics dashboard showing fluctuating rings for CPU usage, database pools, cache ratios, and vector indexes alongside active system console log logs.
- **Clerk Bypass Engine**: When `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is not present or contains a placeholder, the app enters local developer sandbox mode. This bypasses Clerk middleware redirects and server-side authorization checkpoints to serve mock workspace lists and inline workspace creation actions.

---

## ⚙️ Configuration (.env)

Make sure to configure `.env.local` in this folder:
```bash
# Clerk credentials (leave as placeholder for dev mock bypass)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_placeholder
CLERK_SECRET_KEY=sk_test_placeholder

# Local FastAPI target URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🛠️ CLI Operations Commands

Run these inside `apps/web`:

- **Run Dev Server**: `pnpm dev`
- **Lint Code**: `pnpm lint`
- **Typecheck**: `pnpm typecheck`
- **Production Build**: `pnpm build`
