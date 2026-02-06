# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Frontend for a Lotofácil lottery pool platform ("Bolão Lotofácil"). Users can browse pools, buy quotas, manage wallets (Pix deposits), and view lottery results. Admins can create/edit pools, manage lottery games (15 numbers from 1-25), and run result appraisals.

Built with React 19 + TypeScript + Vite 7 + Tailwind CSS v4. The UI and comments are written in Brazilian Portuguese.

## Commands

### Run development server
```bash
npm run dev
```
Starts on port 3000 with `/api` proxied to backend at `http://localhost:8000`.

### Build for production
```bash
npm run build
```
Runs TypeScript check (`tsc -b`) then Vite build.

### Lint
```bash
npm run lint
```

### Preview production build
```bash
npm run preview
```

## Architecture

### Project structure

```
src/
├── App.tsx                     # Router setup, ProtectedRoute wrapper
├── main.tsx                    # React entry point
├── index.css                   # Tailwind v4 theme + custom classes
├── components/
│   ├── Layout.tsx              # Header, footer, responsive navigation
│   ├── NumberPicker.tsx         # Reusable 5x5 lottery number picker
│   └── ui/
│       ├── LoadingSpinner.tsx   # Loading indicator with optional text
│       └── StatusBadge.tsx      # Colored badge (aberto/fechado/apurado/cancelado)
├── contexts/
│   └── AuthContext.tsx          # Auth state (userId, email, login/logout)
├── pages/
│   ├── LandingPage.tsx          # Public landing page
│   ├── LoginPage.tsx            # Login/Register tabs
│   ├── HomePage.tsx             # Lists available bolões
│   ├── BolaoDetalhesPage.tsx    # Pool details, games, buy quota, results
│   ├── MinhasCotasPage.tsx      # User's purchased quotas
│   ├── CarteiraPage.tsx         # Wallet balance + transaction history
│   ├── DepositarPage.tsx        # Pix deposit with QR code
│   └── admin/
│       ├── AdminDashboard.tsx   # Stats cards + activity feed
│       ├── AdminBoloesPage.tsx  # Table of all bolões with CRUD
│       ├── AdminCriarBolaoPage.tsx  # Create new bolão
│       └── AdminEditarBolaoPage.tsx # Edit bolão, manage games, apuração
├── services/
│   ├── api.ts                   # Axios instance + auth interceptor
│   ├── bolaoService.ts          # Public pool endpoints
│   ├── cotaService.ts           # Quota purchase/listing
│   ├── carteiraService.ts       # Wallet + transactions
│   ├── pagamentoService.ts      # Pix payment endpoints
│   └── adminService.ts          # Admin endpoints (CRUD, games, stats, apuração)
└── types/
    └── index.ts                 # All TypeScript interfaces
```

### Routing

Public routes (no layout): `/`, `/login`

Routes with Layout (header + footer):
- `/boloes` — browse pools (public)
- `/bolao/:id` — pool details (public)
- `/minhas-cotas` — user's quotas (protected)
- `/carteira` — wallet (protected)
- `/depositar` — Pix deposit (protected)
- `/admin` — admin dashboard (protected)
- `/admin/boloes` — manage bolões (protected)
- `/admin/boloes/novo` — create bolão (protected)
- `/admin/boloes/:id` — edit bolão (protected)

`ProtectedRoute` checks `useAuth().isAuthenticated` and redirects to `/login`.

### API communication

All API calls go through `src/services/api.ts`, an Axios instance that:
- Prepends `/api/v1/` to all requests
- Injects `Authorization: Bearer {userId}` from localStorage
- Auto-logout on 401 responses

Each service module wraps specific endpoints (e.g., `bolaoService.getById(id)` calls `GET /boloes/{id}`).

### Authentication

Simple Bearer token model — the user's Supabase UUID is stored in localStorage (`user_id`, `user_email`) and sent as the Bearer token. `AuthContext` provides `isAuthenticated`, `login()`, `logout()` to all components.

### Styling

Tailwind CSS v4 with custom theme variables in `src/index.css`:
- Primary: green (`#16a34a`)
- Uses `@theme` directive for custom colors: `primary`, `primary-dark`, `secondary`, `accent`, `danger`, `success`, `bg`, `card`, `border`, `text`, `text-muted`

Custom CSS classes for lottery number display:
- `.numero-bolao` — green circle (normal lottery number)
- `.numero-acerto` — green circle + yellow ring (correct number)
- `.numero-erro` — gray circle (missed number)

### Key components

**NumberPicker** (`src/components/NumberPicker.tsx`): Reusable 5x5 grid for selecting exactly 15 numbers (1-25). Used in both game creation and manual result input. Props: `onConfirm`, `disabled`, `buttonLabel`, `maxNumbers`.

**StatusBadge** (`src/components/ui/StatusBadge.tsx`): Colored status badge. Maps pool statuses to colors (aberto=green, fechado=yellow, apurado=blue, cancelado=red).

### State management

React hooks (`useState`, `useEffect`) for local state. `AuthContext` for global auth state. No external state management library.

## Configuration

### Vite (`vite.config.ts`)
- Port: 3000
- Proxy: `/api` → `http://localhost:8000`
- Path alias: `@` → `./src/`
- Plugins: React + Tailwind CSS v4

### TypeScript
- Target: ES2022
- Module: ESNext
- Path alias: `@/*` → `src/*`
- Strict mode enabled

## Deployment

**Production**: Vercel — domain `www.boloeslotofacil.com`

Deployment config:
- `vercel.json` — SPA rewrite rule (`/(.*) → /index.html`) so React Router works on all paths.

Environment variables on Vercel:
- `VITE_API_URL` — full backend API base URL including `/api/v1` suffix (e.g., `https://bolao-lotofacil-api.onrender.com/api/v1`). In development, the Vite proxy handles this; in production, this env var is required.

DNS (Hostinger):
- A record `@` → `76.76.21.21` (Vercel)
- CNAME `www` → `cname.vercel-dns.com`

After changing environment variables on Vercel, a redeploy is required (Deployments > 3 dots > Redeploy).

## Dependencies

- **react** 19 + **react-dom** 19
- **react-router-dom** 7 — client-side routing
- **axios** — HTTP client with interceptors
- **lucide-react** — icon library
- **tailwindcss** 4 — utility-first CSS (via Vite plugin)
- **vite** 7 — build tool
- **typescript** 5.9
