# AICTE Sanyojika - Event-Driven Microservices Specification

**Architecture Pattern:** Domain Events + Outbox Guarantees  
**Throughput Target:** 5,000 Concurrent Admissions-Season Submissions / Minute

---

## 1. Domain Event Catalog

| Event Topic | Producer | Consumers | Purpose |
| :--- | :--- | :--- | :--- |
| `grievance.ingested` | API Gateway | AI Overlap Engine, Audit Ledger | Trigger NLP collision scan & seal log |
| `overlap.flagged` | AI Engine | HQ Admin Notification, Coordination Svc | Provision Inter-Bureau Inquiry Mandate |
| `sla.threshold_warning` | SLA Scheduler | Bureau Heads, Vigilance Cell | Escalate overdue complaints |
| `notice.issued` | Coordination Svc | Institution Portal, Audit Ledger | Serve statutory show-cause notice |

---

## 2. Idempotency & Ordering
- All consumers process events idempotently keyed by `event_id` and `case_id`.
- Audit ledger transitions preserve causal ordering per AICTE Permanent ID (PID).
