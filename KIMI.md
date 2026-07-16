# KIMI.md — Kimi Coding Standards

## Project
**National Ta'lim-ul-Qur'an & Waqf-e-Ardhi Management Platform** (Nurul-Ardhi Hub)

## Tech Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4 (CSS-based config)
- React Router v7
- TanStack Query v5
- Supabase (auth, database, storage)
- Lucide React (icons)

## Code Style
- Use **function components** with explicit return types where helpful
- Use **TypeScript interfaces** in `src/types/`
- Use **clsx** for conditional class merging
- Use **Tailwind** for all styling — no CSS-in-JS
- Path alias `@/` maps to `src/`

## Architecture
- `src/app/` — App providers (QueryClient, Router, AuthContext)
- `src/components/ui/` — Reusable UI primitives (Button, Card, Input, etc.)
- `src/features/<domain>/` — One folder per feature:
  - `components/` — Feature-specific components
  - `hooks/` — Feature-specific hooks
  - `types.ts` — Feature-specific types
- `src/layouts/` — Page frames (Public, Dashboard, Admin)
- `src/pages/` — Route-level page components
- `src/lib/` — Supabase client, generic helpers
- `src/hooks/` — Shared custom hooks
- `src/types/` — Shared TypeScript types

## Rules
- One task at a time. Review diffs before accepting.
- Never commit `.env` — it holds secrets.
- Never use the Supabase service role key in frontend code.
- RLS policies enforce authorization — UI is just the surface.
- Test after every change: `npm run dev` then click through.
- Commit small, working checkpoints with clear messages.
