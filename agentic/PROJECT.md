# PROJECT.md

## Project Name
ViewFuture

## Goal
เครื่องมือส่วนตัวสำหรับหาหุ้นโลก (US/Global) ที่น่าสนใจ โดยจับเทรนด์มหภาค (น้ำมัน, AI/semiconductor ฯลฯ) มาแม็ปกับหุ้นรายตัว แล้วให้คะแนนจาก fundamentals, ปันผล, และจุดเข้าซื้อ

**หน้าหลัก:**
- Dashboard — สรุปผล screening และคะแนนหุ้นที่ผ่านเกณฑ์
- Watchlist — หุ้นที่ติดตามอยู่ พร้อมคะแนนและ signal ล่าสุด
- Themes — กลุ่มเทรนด์/sector และหุ้นที่แม็ปอยู่ในแต่ละกลุ่ม

## Tech Stack
- Language: TypeScript
- Frontend: Next.js (Cloudflare Workers via OpenNext)
- Backend: Hono (Cloudflare Workers)
- Database: Cloudflare D1 (SQLite) + Drizzle ORM
- Auth: ไม่มี — เครื่องมือส่วนตัว ผู้ใช้คนเดียว
- Data source: Financial Modeling Prep API (ราคา, fundamentals, ปันผล)
- Package manager: pnpm
- Linting: Biome
- Testing: Vitest
- State: TanStack Query

## Team / Agents
เจ้าของโปรเจกต์คนเดียว — ใช้งานส่วนตัว ไม่ใช่ผลิตภัณฑ์สาธารณะ

## Current Stage
Greenfield — scaffold จาก mta-trader template เสร็จแล้ว (root config, packages/config, packages/db, packages/ui, apps/api ที่มีแค่ /health, apps/web shell) ยังไม่มี screener logic หรือ DB schema

---

## Status
ACTIVE

---

## License

```
license_status: active
```

<!-- Dev sets this to "active" before any work begins. -->
<!-- Conductor checks this field before every dispatch. -->
<!-- See CONDUCTOR.md → PRE-FLIGHT CHECK for enforcement. -->

---

## Config

```
conductor_branch: main
owner_email: wansing05@gmail.com
```

<!-- conductor_branch: the branch all PRs merge into (answer from QUESTIONS.md Q23) -->
<!-- owner_email: the user who gets owner role after first deploy (answer from QUESTIONS.md Q0) -->
