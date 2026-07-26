# Dispatch-In: stage-1-setup

**Stage ID:** stage-1-setup
**Domain:** root
**Branch:** stage-1-setup
**Gate-In Verified:** YES

---

## Mission

ตั้งค่า Monorepo ให้พร้อมสำหรับการพัฒนา — clone จาก mta-trader "gover-agent" template แล้วตัดส่วนที่ไม่จำเป็นออกสำหรับเครื่องมือส่วนตัวผู้ใช้คนเดียว

---

## Context

ViewFuture เป็น Greenfield Monorepo สำหรับเครื่องมือส่วนตัวที่จับเทรนด์มหภาคมาแม็ปกับหุ้นโลก แล้วให้คะแนนจาก fundamentals/ปันผล/จุดเข้าซื้อ
Stack: TypeScript, pnpm workspaces, Next.js (apps/web), Hono (apps/api), Drizzle + D1 (packages/db)
Deployment: Cloudflare Workers (API + Web ผ่าน OpenNext)
ไม่มี auth/payment/email — ผู้ใช้คนเดียว ไม่ใช่ผลิตภัณฑ์สาธารณะ

---

## Deliverables

### 1. pnpm Workspace

`pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

โครงสร้าง:
```
viewfuture/
├── apps/
│   ├── web/          # Next.js — copied+stripped from template
│   └── api/          # Hono on Cloudflare Workers — copied+stripped
├── packages/
│   ├── config/        # shared tsconfig/Biome — copied as-is
│   ├── db/             # Drizzle + D1 client, empty schema
│   └── ui/              # Button component — copied as-is
├── pnpm-workspace.yaml
├── package.json
└── turbo.json
```

### 2. TypeScript / Biome / Vitest

Root `tsconfig.json`, `biome.json` copied from template as-is (project-agnostic). Vitest config per-app.

### 3. Cloudflare Wrangler (apps/api)

```toml
name = "viewfuture-api"
main = "src/index.ts"
compatibility_date = "2024-12-01"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "viewfuture-db"
database_id = ""  # Dev fills this after wrangler d1 create
```

### 4. Root package.json

```json
{
  "name": "viewfuture",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "biome check .",
    "format": "biome format --write .",
    "test": "turbo test",
    "type-check": "turbo type-check"
  }
}
```

### 5. Dropped from template

`packages/auth`, `packages/email`, `apps/admin`, Stripe/Resend/R2 wiring, `scripts/set-owner.ts` — no multi-tenant auth or payments needed for a personal tool.

---

## Acceptance Criteria

- [x] `pnpm install` runs at root with no errors
- [x] Directory structure matches target above
- [x] `apps/api/wrangler.toml` exists (database_id left blank — Dev fills after `wrangler d1 create`)
- [x] TypeScript configured for every package
- [x] `.gitignore` covers secrets and build artifacts

---

## Rules

- ใช้ `@latest` สำหรับทุก bootstrap command
- ห้าม commit `.env`/`.dev.vars` files
- ห้าม modify governance files ใน `agentic/`

---

## Gate-Out

ดู `agentic/gate-out/stage-1-setup.md`
