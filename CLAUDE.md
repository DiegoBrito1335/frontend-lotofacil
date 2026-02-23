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

Public routes (no layout): `/`, `/login`, `/esqueceu-senha`, `/redefinir-senha`, `/confirmar-email`

Routes with Layout (header + footer):
- `/boloes` — browse pools (public)
- `/bolao/:id` — pool details (public)
- `/como-jogar`, `/regras` — static pages (public)
- `/minhas-cotas`, `/carteira`, `/depositar`, `/resultados`, `/perfil` — protected user pages
- `/admin`, `/admin/boloes`, `/admin/boloes/novo`, `/admin/boloes/:id` — protected admin pages

`ProtectedRoute` checks `useAuth().isAuthenticated` and redirects to `/login`.
`AdminRoute` additionally checks `isAdmin` and redirects to `/boloes` if not admin.

### API communication

All API calls go through `src/services/api.ts`, an Axios instance that:
- Prepends `/api/v1/` to all requests
- Injects `Authorization: Bearer {userId}` from localStorage
- Auto-logout on 401 responses

Each service module wraps specific endpoints (e.g., `bolaoService.getById(id)` calls `GET /boloes/{id}`).

### Authentication

The user's Supabase UUID is stored in localStorage (`user_id`, `user_email`, `user_nome`, `is_admin`) and sent as the Bearer token. Admin status comes from the login response `is_admin` flag (server validates by email whitelist). `AuthContext` provides `isAuthenticated`, `isAdmin`, `userId`, `userEmail`, `login()`, `logout()`.

**Email confirmation flow**: After registration, user receives a confirmation email. Login returns 403 with `"EMAIL_NOT_CONFIRMED"` if not confirmed — frontend shows specific error message. Pages involved: `ConfirmarEmailPage` (redirect target from email link), `ForgotPasswordPage`, `ResetPasswordPage` (reads `access_token` from URL hash `#access_token=...&type=recovery`).

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
- Theme is fintech/Nubank-inspired: slate palette (`--color-bg: #f8fafc`, `--color-border: #e2e8f0`, `--color-text: #0f172a`, `--color-text-muted: #64748b`)
- Body background: `linear-gradient(180deg, #86efac 0%, #f0fdf4 40%)` — subtle green top fade

Custom CSS classes:
- `.numero-bolao` — green circle (bg-green-100 text-green-700)
- `.numero-acerto` — green circle + yellow ring (hit)
- `.numero-erro` — gray circle (miss)
- `.saldo-glow` — banking card style: dark green gradient `linear-gradient(135deg, #16a34a 0%, #10b981 100%)` with glow shadow; use with white text (`text-white`, `text-white/80`)
- `.card-hover` — 20px radius card with green shadow; `active:scale(0.98)` on tap; `hover:translateY(-4px)`
- `.btn-gradient` — green gradient button with shine animation on hover; `hover:scale(1.02)`, `active:scale(0.95)`
- `.fade-in` — fadeIn 0.4s ease-out entrance animation
- `.valor-gold` — dark green bold text with prizeReveal bounce animation
- `.progress-animated` — width via `--progress` CSS var, scaleX animation

Layout notes:
- Bottom nav (`md:hidden fixed bottom-0`): premium style with `rounded-t-2xl shadow` — only visible on mobile when authenticated
- Main padding: `pb-24 md:pb-6` when authenticated (space for bottom nav)

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
- To prevent cold starts causing cron failures: set up a keep-alive cron at `GET https://bolao-lotofacil-api.onrender.com/` every 14 minutes (endpoint returns `{"status":"ok"}`)

**Backend cron endpoints** (protected by `X-Cron-Secret` header OR `?secret=` query param = `SECRET_KEY` env var):
- `POST /api/v1/cron/fechar-boloes` — closes all open pools; scheduled daily at 20:55 (America/Sao_Paulo)
- `POST /api/v1/cron/apurar-resultados` — fetches Lotofácil results and distributes prizes; schedule `*/15 21,22 * * *` (every 15 min 21h-22h)

**Lotofácil API**: Primary = official Caixa API (`servicebus2.caixa.gov.br`), fallback = Heroku mirror. Timeout 30s.

DNS (Hostinger): A `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`

## Known Issues & Fixes

### ResultadosPage — resumo de acertos
- Backend may return `resumo_acertos: {}` (empty) but `jogos[]` with `acertos` field populated
- Frontend calculates resumo from `jogos` as fallback when `resumo_acertos` is empty
- If `jogos[]` is empty (bolão has no games in `jogos_bolao` table), the "Resumo de Acertos" section is hidden entirely
- Prize (prêmio) can still appear even with 0 jogos — it comes from `premiacoes_bolao` table separately

### Render free tier 503 on cron
- Server sleeps after 15 min inactivity → cron hits 503
- Fix: keep-alive cron at `GET /` every 14 min on cron-job.org
