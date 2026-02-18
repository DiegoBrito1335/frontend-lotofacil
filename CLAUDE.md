# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Frontend for a Lotofácil lottery pool platform ("Bolão Lotofácil"). Users can browse pools, buy quotas, manage wallets (Pix deposits), and view lottery results. Admins can create/edit pools, manage lottery games (15 numbers from 1-25), and run result appraisals.

Built with React 19 + TypeScript + Vite 7 + Tailwind CSS v4. The UI and comments are written in Brazilian Portuguese.

## Commands

### Frontend (this repo)
```bash
npm run dev      # Dev server on port 3000, /api proxied to http://localhost:8000
npm run build    # TypeScript check (tsc -b) then Vite build
npm run lint
npm run preview
```

### Backend (`../bolao-lotofacil-backend`)
```bash
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Backend is Python + FastAPI. Swagger UI available at `http://localhost:8000/docs` when running.

## Architecture

### Project structure

```
src/
├── App.tsx                     # Router setup, ProtectedRoute wrapper
├── index.css                   # Tailwind v4 theme + custom classes
├── components/
│   ├── Layout.tsx              # Header, footer, responsive navigation
│   ├── NumberPicker.tsx        # Reusable 5x5 lottery number picker (15 of 25 numbers)
│   └── ui/
│       ├── LoadingSpinner.tsx
│       └── StatusBadge.tsx     # aberto/fechado/apurado/cancelado → color mapping
├── contexts/
│   └── AuthContext.tsx         # Auth state (userId, email, isAuthenticated, login/logout)
├── pages/
│   ├── BolaoDetalhesPage.tsx   # Pool details, games, buy quota, results
│   ├── CarteiraPage.tsx        # Wallet balance + transaction history
│   ├── DepositarPage.tsx       # Pix deposit with QR code
│   └── admin/
│       └── AdminEditarBolaoPage.tsx  # Edit bolão, manage games, apuração
├── services/
│   ├── api.ts                  # Axios instance + auth interceptor
│   ├── bolaoService.ts
│   ├── cotaService.ts
│   ├── carteiraService.ts
│   ├── pagamentoService.ts
│   └── adminService.ts
└── types/
    └── index.ts                # All TypeScript interfaces
```

### Routing

Public routes (no layout): `/`, `/login`

Routes with Layout (header + footer):
- `/boloes` — browse pools (public)
- `/bolao/:id` — pool details (public)
- `/minhas-cotas`, `/carteira`, `/depositar` — protected user pages
- `/admin`, `/admin/boloes`, `/admin/boloes/novo`, `/admin/boloes/:id` — protected admin pages

`ProtectedRoute` checks `useAuth().isAuthenticated` and redirects to `/login`.

### API communication

All API calls go through `src/services/api.ts`, an Axios instance that:
- Prepends `/api/v1/` to all requests
- Injects `Authorization: Bearer {userId}` from localStorage
- Auto-logout on 401 responses

Each service module wraps specific endpoints (e.g., `bolaoService.getById(id)` calls `GET /boloes/{id}`).

### Authentication

The user's Supabase UUID is stored in localStorage (`user_id`, `user_email`) and sent as the Bearer token. Admin status is verified server-side via email check — there is no admin flag in the frontend. `AuthContext` provides `isAuthenticated`, `login()`, `logout()`.

### Backend architecture (relevant for API work)

The backend (`../bolao-lotofacil-backend`) uses:
- **FastAPI** + **Supabase** (PostgreSQL) — no ORM; a custom chainable HTTP client in `app/core/supabase.py`
- Two Supabase clients: `supabase` (anon key, respects RLS) and `supabase_admin` (service role, bypasses RLS)
- Atomic quota purchase via Supabase RPC: `comprar_cota(p_usuario_id, p_bolao_id, p_quantidade)`
- **Mercado Pago** for Pix payments; sandbox mode generates fake QR codes
- Result appraisal: manual (admin provides numbers) or automatic (fetches from Lotofácil public API)

Key backend env vars (in `../bolao-lotofacil-backend/.env`): `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_ENV`.

### Styling

Tailwind CSS v4 with custom theme in `src/index.css` via `@theme`:
- Primary: green (`#16a34a`), custom colors: `primary`, `primary-dark`, `secondary`, `accent`, `danger`, `success`, `bg`, `card`, `border`, `text`, `text-muted`

Custom CSS classes for lottery numbers:
- `.numero-bolao` — green circle
- `.numero-acerto` — green circle + yellow ring (hit)
- `.numero-erro` — gray circle (miss)

### Key components

**NumberPicker** (`src/components/NumberPicker.tsx`): 5x5 grid for selecting exactly 15 numbers (1-25). Props: `onConfirm`, `disabled`, `buttonLabel`, `maxNumbers`.

**StatusBadge** (`src/components/ui/StatusBadge.tsx`): Maps `aberto`→green, `fechado`→yellow, `apurado`→blue, `cancelado`→red.

### State management

React hooks (`useState`, `useEffect`) for local state. `AuthContext` for global auth. No external state library.

## Deployment

**Frontend**: Vercel — `www.boloeslotofacil.com`
- `vercel.json` — SPA rewrite (`/(.*) → /index.html`)
- Env var: `VITE_API_URL` — full backend URL including `/api/v1` (e.g., `https://bolao-lotofacil-api.onrender.com/api/v1`). Not used in dev (Vite proxy handles it).
- After changing env vars on Vercel: Deployments > 3 dots > Redeploy.

**Backend**: Render.com (free tier) — cold start ~30s after 15 min inactivity.

DNS (Hostinger): A `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`
