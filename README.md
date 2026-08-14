# FundedTechStreet — Funded Trading Platform (Demo)

A premium, fully interactive demo of a funded / prop-trading company. Traders buy a
challenge, trade a simulated funded account, track performance, and request payouts.
Admins manage users, challenges, accounts and payouts. All data is persisted in MongoDB.

> Client demonstration environment — no real brokers or payments are connected.

## Tech Stack

- **Frontend:** Next.js 15 (App Router) · React 18 · Tailwind CSS · shadcn/ui · Framer Motion · Recharts · Lucide
- **Backend:** Node.js — Next.js Route Handlers (no Python anywhere)
- **Database:** MongoDB (native driver) — database name `fundedtechstreet`
- **Auth:** Stateless signed token (HMAC-SHA256) + scrypt password hashing

## Architecture

```
Next.js Frontend (app/page.js -> components/fts/*)
        |  fetch('/api/...')
Node.js API  (app/api/[[...path]]/route.js)
        |  router -> service functions
MongoDB (native driver)
```

Business logic (account rule calculation, performance KPIs, seeding, checkout, RBAC)
lives in the backend. The mock trading engine (`makeTrades`, `makeEquity`) is isolated
so a real broker provider (MT5 / broker API) can replace it later without touching the UI.

### Key files

- `app/api/[[...path]]/route.js` — entire REST API + seeding + services
- `app/page.js` — client router / app shell
- `components/fts/Landing.jsx` — marketing site (hero, challenges, rules, performance, FAQ)
- `components/fts/Auth.jsx` — login / register / forgot password + simulated checkout
- `components/fts/Dashboard.jsx` — trader dashboard (overview, accounts, performance, trades, payouts, transactions, KYC, notifications, profile, support)
- `components/fts/Admin.jsx` — admin console (overview, users, challenges, accounts, trades, transactions, payouts, KYC, audit logs)
- `lib/fts-api.js` — API client + formatters

## Collections

`users`, `challenges`, `accounts`, `trades`, `transactions`, `payouts`,
`notifications`, `kyc`, `audit_logs`, `equity_points`. All documents use UUID `id` fields.

## Getting Started

```bash
yarn install
yarn dev        # starts Next.js on http://localhost:3000
```

The database **auto-seeds on the first API request** (admin, demo trader, 5 challenges,
a $100K account with 34 trades + 92 equity points, transactions, payouts, notifications,
KYC and audit logs). To force a re-seed, drop the `fundedtechstreet` database and restart.

## Demo Credentials

| Role   | Email                          | Password     |
|--------|--------------------------------|--------------|
| Trader | demo@fundedtechstreet.com      | Demo@12345   |
| Admin  | admin@fundedtechstreet.com     | Admin@12345  |

On the login screen use the one-tap **Trader / Admin** buttons to auto-fill. Admins can
open the Admin Console from the dashboard sidebar (or visit `/?admin=1`).

## Demo Flows

**Trader:** Landing → Challenges → Start Challenge → Demo Checkout → Account created → Dashboard → Performance / Trades / Payouts.

**Admin:** Login (admin) → Admin Console → Users → view demo trader → Accounts → Payouts → change payout status.

## API Overview

```
POST /api/auth/register|login|logout|forgot-password    GET /api/auth/me
GET  /api/challenges  GET /api/challenges/:idOrSlug      GET /api/stats/public
GET  /api/accounts    GET /api/accounts/:id
GET  /api/accounts/:id/performance?range=1D|1W|1M|3M|ALL  GET /api/accounts/:id/trades
GET  /api/trades?symbol&side&status&accountId&page&limit
GET  /api/payouts     POST /api/payouts                  GET /api/transactions
GET  /api/notifications  PATCH /api/notifications/:id/read  PATCH /api/notifications/read-all
GET/PATCH /api/profile   GET/POST /api/kyc               POST /api/checkout
# Admin (role ADMIN only):
GET  /api/admin/stats
GET  /api/admin/users  GET /api/admin/users/:id  PATCH /api/admin/users/:id/status
GET  /api/admin/accounts  PATCH /api/admin/accounts/:id/status
GET  /api/admin/challenges  POST /api/admin/challenges  PATCH|DELETE /api/admin/challenges/:id
GET  /api/admin/payouts  PATCH /api/admin/payouts/:id/status
GET  /api/admin/trades|transactions|kyc|audit-logs
```

## Environment Variables

See `.env.example` — `MONGO_URL`, `DB_NAME`, `JWT_SECRET`, `NEXT_PUBLIC_BASE_URL`, `CORS_ORIGINS`.

## Production Build

```bash
yarn build
yarn start
```

## Future Broker Integration

The mock trading engine implements the shape of a `TradingProvider`
(`getAccount / getPositions / getTrades / getEquity / getBalance / getHistory`).
Replace `MockTradingProvider` seeding with an `MT5TradingProvider` / broker adapter
to go live without rebuilding the dashboard or admin console.
