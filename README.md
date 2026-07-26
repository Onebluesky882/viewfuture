# ViewFuture

A personal tool that maps macro trends (oil, AI/semiconductors, etc.) to global (US) stocks, then scores them on fundamentals, dividend yield, and entry-point signals.

Scaffolded from the mta-trader "gover-agent" AI-governed fullstack template — see `agentic/` for the governance system and `agentic/gate-out/stage-1-setup.md` for what was carried over.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) + OpenNext |
| Backend | Hono on Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) + Drizzle ORM |
| Data source | Financial Modeling Prep (price, fundamentals, dividends) |
| Auth | None — single-user personal tool |
| Deploy | Cloudflare Workers + Wrangler |
| Package manager | pnpm (monorepo) |
| Build | Turborepo |
| Linting | Biome |
| Language | TypeScript (strict) |

---

## Project Structure

```
apps/
  web/          Next.js — Dashboard, Watchlist, Themes
  api/          Hono — Cloudflare Worker API (screener domain to be added)

packages/
  db/           Drizzle schema (empty placeholder) + D1 client
  ui/           Shared React components
  config/       Shared tsconfig + Biome config

agentic/        AI governance system (Conductor + Worker workflow)
  PROJECT.md          Project identity and status
  ROADMAP.md          Long-term direction
  PIPELINE.md         Stage tracking
  DECISIONS.md        Architectural decisions
  tasks/              Stage dispatch files
  gate-out/           Worker completion reports
```

---

## Quick Start

### 1. Install

```bash
pnpm install
```

### 2. Create D1 database

```bash
wrangler login
wrangler d1 create viewfuture-db
# Copy the database_id into apps/api/wrangler.toml
```

### 3. Set environment variables

```bash
cp apps/api/.dev.vars.example apps/api/.dev.vars
cp apps/web/.env.local.example apps/web/.env.local
```

Sign up at [financialmodelingprep.com](https://financialmodelingprep.com) for an API key and fill in `FMP_API_KEY` in `apps/api/.dev.vars`.

### 4. Run locally

```bash
pnpm dev
```

### 5. Deploy

```bash
cd apps/api && wrangler secret put FMP_API_KEY && wrangler deploy
cd apps/web && opennextjs-cloudflare build && wrangler deploy
```

---

## Status

Greenfield scaffold — no screener logic or DB schema yet. See `agentic/PIPELINE.md` → "Next Session Plan" for what's next.
