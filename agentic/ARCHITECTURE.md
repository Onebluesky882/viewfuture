# ARCHITECTURE.md

## Overview

ViewFuture เป็น Monorepo สำหรับเว็บสาธารณะที่จับเทรนด์มหภาคมาแม็ปกับหุ้นโลก (US/Global) แล้วให้คะแนนหุ้นจาก fundamentals, ปันผล, และจุดเข้าซื้อ พร้อมข่าว/เทรนด์แปลโดย AI — เปิดให้ใช้ฟรีโดยไม่ต้อง login ในเฟสนี้ (auth วางแผนไว้สำหรับอนาคต)

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
- ทุกหน้า frontend (`apps/web/app/**/page.tsx`) ต้อง export `metadata: Metadata` ของตัวเอง (title, description) ผ่าน Next.js Metadata API — ห้ามปล่อยให้ใช้แค่ title กลางจาก root layout
- package versions ต้องเป็น latest stable (ดู DECISIONS.md — Version Policy)
- ไม่มี auth ในเฟสนี้ — อย่าเพิ่ม login/session logic โดยไม่ปรึกษา Dev ก่อน (เว็บสาธารณะ เปิดให้ทุกคนใช้ฟรี, auth จะเพิ่มในเฟสอนาคต)
- ทุกหน้าต้องมี disclaimer ว่าข้อมูลไม่ใช่คำแนะนำการลงทุน (ดู `DisclaimerFooter` ใน root layout)
- เนื้อหาข่าวที่ AI แปล ต้องมี `sourceUrl` อ้างอิงแหล่งข่าวจริงเสมอ — AI ทำหน้าที่แปลเท่านั้น ห้ามให้วิเคราะห์/คาดการณ์เพิ่มเอง
