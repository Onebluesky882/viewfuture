# ARCHITECTURE.md

## Overview

ViewFuture เป็น Monorepo สำหรับเครื่องมือส่วนตัวที่จับเทรนด์มหภาคมาแม็ปกับหุ้นโลก (US/Global) แล้วให้คะแนนหุ้นจาก fundamentals, ปันผล, และจุดเข้าซื้อ — ไม่มี multi-tenant auth เพราะเป็นเครื่องมือผู้ใช้คนเดียว

Architecture style: **Monorepo**

```
viewfuture/
├── apps/
│   ├── web/          # Next.js dashboard (frontend)
│   └── api/          # Hono API (Cloudflare Workers)
├── packages/
│   ├── config/       # Shared tsconfig + Biome config
│   ├── db/           # Drizzle schema + D1 client
│   └── ui/           # Shared React components
└── agentic/          # Governance files (read-only to workers)
```

⸻

## Modules / Components

| Module | Domain | Responsibility |
|--------|--------|----------------|
| `apps/web` | Frontend | Dashboard, Watchlist, Themes pages |
| `apps/api` | Backend | REST API — screener domain (stocks, themes, scores), fetches from Financial Modeling Prep |
| `packages/db` | Data | Drizzle schema for stocks/themes/scores, D1 client |
| `packages/ui` | Frontend | Shared components (Button, etc.) |

### Pages (apps/web) — planned

| Page | Route | Description |
|------|-------|--------------|
| Dashboard | `/` | สรุปผล screening และคะแนนหุ้นที่ผ่านเกณฑ์ |
| Watchlist | `/watchlist` | หุ้นที่ติดตาม พร้อมคะแนนและ signal ล่าสุด |
| Themes | `/themes` | กลุ่มเทรนด์/sector และหุ้นที่แม็ปอยู่ในแต่ละกลุ่ม |

⸻

## Data Flow

```
Financial Modeling Prep API (ราคา, fundamentals, ปันผล)
    ↕ apps/api (Hono — Cloudflare Workers)
    ↕ Cloudflare D1 (SQLite, ผ่าน Drizzle)
apps/web (Next.js — Cloudflare Workers via OpenNext)
    ← TanStack Query (server state)
```

⸻

## External Dependencies

| Service | Purpose |
|---------|---------|
| Cloudflare Workers | API + Web hosting |
| Cloudflare D1 | Database (SQLite) |
| Financial Modeling Prep | Stock price, fundamentals, dividend data |

⸻

## Constraints

- ห้าม `<a href>` สำหรับ internal navigation — ใช้ Next.js `Link` หรือ `router.push()` เท่านั้น
- ห้าม commit secrets (`FMP_API_KEY` ฯลฯ) — ใช้ Cloudflare Wrangler secrets เท่านั้น
- ทุกหน้ายกเว้น `/` ต้องมี back button
- ห้ามใช้ emoji ใน UI — ใช้ inline SVG เท่านั้น
- package versions ต้องเป็น latest stable (ดู DECISIONS.md — Version Policy)
- ไม่มี auth — อย่าเพิ่ม login/session logic โดยไม่ปรึกษา Dev ก่อน (เครื่องมือส่วนตัว ผู้ใช้คนเดียว)
