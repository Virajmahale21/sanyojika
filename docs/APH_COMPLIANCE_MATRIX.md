# AICTE Approval Process Handbook (APH 2026–27) Compliance Matrix

This document provides a statutory compliance mapping between the official clauses of the **AICTE Approval Process Handbook (APH 2026–27)** and the architectural modules implemented in **AnumatiSetu** for **SIH 2026 Problem Statement 262**.

---

## 🏛️ Statutory Requirements & Platform Mapping

| APH Clause | Regulatory Requirement | AnumatiSetu Implementation | Verification Module |
|---|---|---|---|
| **Chapter I §1.3** | Mandatory submission of institutional land title, building plans, and statutory fire NOCs | AI OCR Document Intake Vault with automated validity date and authority extraction | `/api/documents/upload`, `/api/documents/:id/ocr` |
| **Chapter I §1.6** | Time-bound scrutiny and stage-wise SLA compliance | Proactive 3-tier SLA countdown timers with automated escalation alerts | `/api/tasks`, `/api/tasks/escalate` |
| **Chapter II §2.2** | Deficiency notification and institutional response loop | Formal Deficiency Notice module with time-bounded compliance submission | `/api/applications/:id/deficiency` |
| **Chapter II §2.4** | Independent Expert Visit Committee (EVC) and conflict-of-interest prevention | Conflict-of-interest detection engine preventing assignment of experts from parent universities or applicant trusts | `/api/inspections/schedule` |
| **Chapter III §3.1** | Immutable record of committee recommendations and final approvals | Tamper-evident, append-only blockchain/audit log capturing all decision states and officer IDs | `/api/audit-logs` |
| **Chapter IV §4.2** | Multi-tier grievance redressal and delay risk monitoring | AI-assisted delay risk scoring calculating institutional and regional risk indicators | `/api/applications` (DelayRisk) |
| **National Language Mandate** | National Education Policy (NEP 2020) trilingual citizen interface | Full trilingual localization in English, Hindi, and Marathi with responsive official branding | `AnumatiSetuLogo`, `i18n.ts`, `locales/` |

---

## 🛡️ SLA Escalation Hierarchy (§1.6)

AnumatiSetu enforces a strict 3-tier automated escalation schedule:

1. **Level 1 Escalation (3 Days Overdue)**:
   - Alert sent to Scrutiny Officer.
   - Application flagged as `MEDIUM_RISK` in the bureau queue.
2. **Level 2 Escalation (7 Days Overdue)**:
   - Alert escalated to Regional Director / Bureau Head.
   - High-priority SMS/Email notification dispatched.
   - Application flagged as `HIGH_RISK`.
3. **Level 3 Escalation (14 Days Overdue - Critical Breach)**:
   - Statutory escalation directly to Member Secretary & Central Council HQ.
   - Flagged as `CRITICAL_BREACH` on executive oversight dashboard.
