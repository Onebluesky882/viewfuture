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
| stage-2-schema-news | db, api, web | stage-1-setup | DONE |
| stage-3-d1-database | infra | stage-2-schema-news | DONE |
| stage-4-screener | api | stage-3-d1-database | DONE |

---

## Stage Detail

### stage-1-setup — DONE

**Domain:** root | **Status:** `DONE`

Scaffolded from the mta-trader "gover-agent" template (2026-07-27):
- pnpm workspace, Biome, TypeScript, Vitest ✓
- `packages/config` (shared tsconfig/Biome), `packages/db` (Drizzle + D1 client, empty schema), `packages/ui` (Button component) ✓
- `apps/api` — Hono + wrangler.toml, `/health` route only, no D1 database created yet ✓
- `apps/web` — Next.js shell (layout, navbar, dashboard placeholder page), no auth ✓
- Dropped from the template: `packages/auth`, `packages/email`, `apps/admin`, Stripe/Resend/R2 wiring

See `agentic/gate-out/stage-1-setup.md` for the full scaffold report.

---

### stage-2-schema-news — DONE

**Domain:** db, api, web | **Status:** `DONE`

Project direction changed this session: from single-user personal tool → public, free, no-login site, plus an AI news-translation feature.

- D1/Drizzle schema in `packages/db/src/schema/`: `stocks`, `themes` + `theme_stocks`, `fundamental_snapshots`, `screening_runs` + `stock_scores` (fundamental + valuation-percentile approach, peer-group ranked), `news_events` ✓
- `apps/api` — `news` domain added: `POST /api/news/translate` (calls Kimi API, inserts `draft`), `GET /api/news` (published only), `POST /api/news/:id/publish`; `KIMI_API`/`KIMI_BASE_URL`/`KIMI_MODEL` added to `Bindings` ✓
- `apps/api/.dev.vars` created (was mistakenly `.env`, which `wrangler dev` does not read); `.dev.vars.example` documents `KIMI_API` ✓
- `apps/web` — SEO rule added (every page must export its own `metadata`), applied to dashboard page; `DisclaimerFooter` ("not investment advice") added to root layout ✓
- Upgraded `next` → 16.2.12, confirmed `typescript` → 7.0.2 via `npm info` (Version Policy) ✓
- `agentic/PROJECT.md`, `ARCHITECTURE.md`, `DECISIONS.md` updated to reflect public/no-auth-for-now decision ✓
- `pnpm type-check` and `pnpm test` (apps/api) both pass ✓
- `apps/web` — `/themes` and `/watchlist` pages added (`GET /api/themes`, `GET /api/watchlist` API routes to match), each with back button, SEO metadata, loading/error/empty states; verified in a real headless-Chromium run (screenshots, zero console errors) ✓
- Fixed a real Next.js 16 + TypeScript 7 incompatibility: `next build` failed until `experimental.useTypeScriptCli: true` was added to `next.config.ts` ✓

**Not yet started:** no real Kimi model/base-URL verified against Moonshot's current API docs, no UI wired to real data (tables are empty), no screener/scoring logic yet.

---

### stage-3-d1-database — DONE

**Domain:** infra | **Status:** `DONE`

- `wrangler d1 create viewfuture-db` — real database created on Cloudflare (region APAC), `database_id` filled into `apps/api/wrangler.toml` ✓
- `packages/db/drizzle.config.ts` added; `drizzle-kit generate` produced `packages/db/drizzle/0000_naive_lucky_pierre.sql` from the schema (7 tables) ✓
- `migrations_dir` added to `wrangler.toml`; migration applied to both `--local` (dev) and `--remote` (real production D1) ✓ — verified via `wrangler d1 execute --remote` that all 7 tables exist
- All tables are empty — no stock/theme/news data loaded yet

---

### stage-4-screener — DONE

**Domain:** api | **Status:** `DONE`

- `apps/api/src/domains/screener/scoring.ts` — pure, unit-tested peer-group (sector) percentile scoring: valuation (PE/PB, lower=better), fundamental (revenue growth, debt/equity, FCF yield), dividend (yield percentile), weighted into `compositeScore`, globally ranked ✓
- `apps/api/src/domains/screener/fmp.client.ts` — fetches `quote`, `ratios-ttm`, `key-metrics-ttm`, `financial-growth` from FMP's `/stable` API and normalizes to fundamentals. **Field names are best-effort from FMP's public docs, not confirmed against a live response** — no `FMP_API_KEY` provisioned yet, docs site blocks scraping. Re-verify field casing once a real key exists ✓
- `apps/api/src/domains/screener/screener.route.ts` — `POST /api/screener/run` (fetches fundamentals for active stocks, upserts `fundamental_snapshots`, computes + inserts `screening_runs`/`stock_scores`), `GET /api/screener/runs`, `GET /api/screener/runs/:id/scores` ✓
- `scoring.test.ts` (4 tests) + `screener.test.ts` (2 tests) added; `pnpm test` (13 total) and `pnpm type-check` both pass ✓
- Not yet done: no real FMP key to test against, so `/run` is unverified end-to-end against live data

---

## Next Session Plan

1. Sign up for Financial Modeling Prep, `wrangler secret put FMP_API_KEY`; `wrangler secret put KIMI_API` for deploy — then run `POST /api/screener/run` once for real and fix any FMP field-name mismatches in `fmp.client.ts`
2. Verify the actual Kimi (Moonshot) model name and base URL against current docs — `kimi-latest` / `https://api.moonshot.ai/v1` in code are placeholders, not confirmed
3. Seed initial `stocks` / `themes` data so `/watchlist`, `/themes`, and the screener have something real to run against
4. Wire `apps/web` dashboard to `GET /api/screener/runs/:id/scores` so screening results are visible in the UI
5. Decide when to bring back `packages/auth` (e.g. once per-user watchlists are needed)
