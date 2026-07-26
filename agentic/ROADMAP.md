---
status: ACTIVE
owner: CONDUCTOR
last_updated: 2026-07-27
---

# ROADMAP.md

> **Workers may read this document. Workers must NOT modify this document.**
> Implementation planning belongs in PIPELINE.md.

---

## Purpose

This document defines the long-term direction of the project.

Intended for: Product Owners, Project Managers, Architects, Developers, Future Contributors.

---

## Project Vision

เครื่องมือส่วนตัวที่จับเทรนด์มหภาค (น้ำมัน, AI/semiconductor ฯลฯ) มาแม็ปกับหุ้นโลกรายตัว แล้วให้คะแนนจาก fundamentals, ปันผล, และจุดเข้าซื้อ — เพื่อช่วยเจ้าของโปรเจกต์ (ผู้เชี่ยวชาญด้านสถิติ) ประหยัดเวลาในการหาหุ้นที่น่าสนใจ โดย Claude ทำหน้าที่ execute pipeline ส่วนเจ้าของใส่ edge/สมมติฐานเอง

---

## Problem Statement

- ติดตามเทรนด์มหภาคและแม็ปเข้ากับหุ้นรายตัวด้วยมือใช้เวลานาน
- ไม่มีระบบกลางที่รวมราคา, fundamentals, ปันผล, และ theme tagging ไว้ที่เดียว
- ยากต่อการเปรียบเทียบหุ้นในธีมเดียวกันอย่างเป็นระบบ

---

## Business Goals

### Goal 1 — Theme-Based Screening

Description: แม็ปหุ้นเข้ากับเทรนด์มหภาค แล้ว screen ตามเกณฑ์เชิงปริมาณ (valuation, dividend yield, momentum)

Success Criteria:
- [ ] ดึงราคา/fundamentals/ปันผลจาก Financial Modeling Prep ได้อัตโนมัติ
- [ ] Theme tagging (หุ้น ↔ เทรนด์) เก็บและแก้ไขได้
- [ ] Scoring engine ให้คะแนนหุ้นตาม weighting ที่กำหนดเองได้

### Goal 2 — Personal Dashboard

Description: Dashboard ส่วนตัวสำหรับดูผล screening, watchlist, และ theme grouping

Success Criteria:
- [ ] Dashboard แสดงหุ้นที่ผ่านเกณฑ์พร้อมคะแนน
- [ ] Watchlist ติดตามหุ้นที่สนใจพร้อม signal ล่าสุด
- [ ] Themes page แสดงกลุ่มเทรนด์และหุ้นที่แม็ปอยู่

---

## Current Progress

Greenfield — scaffold จาก mta-trader template เสร็จแล้ว (2026-07-27) ยังไม่มี screener logic, DB schema, หรือ D1 database จริง

---

## Milestone Backlog

| ID | Name | Goal | Status |
|----|------|------|--------|
| M-001 | Project Scaffold | ตั้งค่า monorepo จาก template, ตัด auth/payment/email ที่ไม่จำเป็นออก | COMPLETE |
| M-002 | DB Schema + Screener API | ออกแบบ schema (stocks, themes, scores), เพิ่ม screener domain ใน apps/api | PLANNING |
| M-003 | FMP Integration | ดึงราคา/fundamentals/ปันผลจาก Financial Modeling Prep | PLANNING |
| M-004 | Web Dashboard | หน้า Dashboard, Watchlist, Themes | PLANNING |

**Status values:** PLANNING · APPROVED · IN_PROGRESS · COMPLETE · CANCELLED

---

## Next Steps

- ออกแบบ DB schema สำหรับ stocks/themes/scores
- สมัคร Financial Modeling Prep, ตั้ง `FMP_API_KEY` เป็น Cloudflare secret
- สร้าง `wrangler d1 create viewfuture-db` แล้วใส่ database_id ใน `apps/api/wrangler.toml`
- เพิ่ม screener domain ใน `apps/api/src/domains/`

---

## Success Metrics

The project will be considered successful when:
- [ ] Screen หุ้นตาม theme และเกณฑ์เชิงปริมาณได้จริงจากข้อมูลสด
- [ ] Dashboard แสดงผล screening ได้โดยไม่ต้องรันสคริปต์มือ
- [ ] Theme tagging ปรับปรุงได้ง่ายเมื่อเทรนด์เปลี่ยน

---

## Risks

### Risk 1

Description: Theme tagging (หุ้น ↔ เทรนด์) ไม่มี API ไหนทำอัตโนมัติ ต้อง curate เอง หรือให้ Claude ช่วยสรุปจากข่าวเป็นระยะ

Mitigation: เริ่มจาก manual mapping เล็กๆ ก่อน ขยายทีหลังตามความจำเป็น

### Risk 2

Description: Financial Modeling Prep free tier มี rate limit — อาจไม่พอถ้า screen หุ้นจำนวนมากพร้อมกัน

Mitigation: cache ผลลัพธ์ใน D1, รัน screening เป็น batch ไม่ใช่ real-time ต่อ request

---

## Guiding Principles

1. Human governance first
2. Contracts before implementation
3. Architecture before coding
4. Validation before merge
5. Integration before release
6. Explicit documentation over assumptions

---

## Project Scope

**In Scope:**
- หุ้นโลก (US/Global), เครื่องมือส่วนตัว ผู้ใช้คนเดียว
- Theme/trend tagging + fundamental/dividend screening
- Web dashboard: Dashboard, Watchlist, Themes
- Cloudflare Workers API + D1 database

**Out of Scope:**
- Multi-tenant auth, payments, public product features
- Real-time streaming quotes (screening เป็น batch/periodic พอ)
- Investment advice / automated order execution

---

## Governance

See `GOVERNANCE_CORE.md` for file ownership and the relationship between documents.

Changes to this roadmap require:
1. Conductor review
2. Rationale
3. Impact analysis
4. Documentation update

Workers may not modify ROADMAP.md. Dev may edit directly (see GOVERNANCE_CORE.md), logged in DEV_LOG.md.

---

## Final Statement

**ROADMAP.md** is the source of truth for project direction.

**PIPELINE.md** is the source of truth for project execution.

See `GOVERNANCE_CORE.md` for authority order.
