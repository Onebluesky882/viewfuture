# PIPELINE.md

Status: ACTIVE
Owner: CONDUCTOR
Conductor Branch: main
Last Updated: 2026-07-27

---

## Stage Overview

| Stage | Domain | Depends On | Status |
|-------|--------|------------|--------|
| stage-1-setup | root | none | DONE |

---

## Stage Detail

### stage-1-setup — DONE

**Domain:** root | **Status:** `DONE`

Scaffolded from the mta-trader "gover-agent" template (2026-07-27):
- pnpm workspace, Biome, TypeScript, Vitest ✓
- `packages/config` (shared tsconfig/Biome), `packages/db` (Drizzle + D1 client, empty schema), `packages/ui` (Button component) ✓
- `apps/api` — Hono + wrangler.toml, `/health` route only, no D1 database created yet ✓
- `apps/web` — Next.js shell (layout, navbar, dashboard placeholder page), no auth ✓
- Dropped from the template: `packages/auth`, `packages/email`, `apps/admin`, Stripe/Resend/R2 wiring — not needed for a personal single-user tool

See `agentic/gate-out/stage-1-setup.md` for the full scaffold report.

**Not yet started:** screener domain (API), stock/theme/score DB schema, D1 database creation, FMP API key setup.

---

## Next Session Plan

1. Design D1 schema in `packages/db/src/schema/` for: stocks, themes, theme-stock mapping, scores/screening runs
2. `wrangler d1 create viewfuture-db`, fill `database_id` into `apps/api/wrangler.toml`
3. Add `screener` domain to `apps/api/src/domains/` (schema/handler/route pattern, see `health` domain for reference)
4. Sign up for Financial Modeling Prep, `wrangler secret put FMP_API_KEY`
5. Build out `/watchlist` and `/themes` pages in `apps/web`
