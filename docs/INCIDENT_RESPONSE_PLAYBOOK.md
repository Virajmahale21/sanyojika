# AICTE Sanyojika - Incident Response & DR Drill Playbook

**Classification:** Operational Standard Operating Procedure (SOP)  
**RTO Target:** < 15 Minutes | **RPO Target:** < 5 Minutes

---

## 1. Severity Tiers
- **SEV-1 (Critical):** Portal inaccessible or Audit Ledger integrity verification failure.
- **SEV-2 (High):** AI Overlap Engine degraded (> 2s latency) or Render gateway timeouts.
- **SEV-3 (Medium):** Delayed CSV batch export or non-blocking UI rendering issue.

## 2. Immediate Containment Checklist
1. Execute `python scripts/sanyojika_healthcheck.py` to isolate failing microservice.
2. Verify cryptographic chain integrity via `ai_engine/ledger_verifier.py`.
3. Fail over read traffic to secondary PostgreSQL replica if primary latency exceeds 500ms.
4. Notify AICTE Technical Nodal Officer with post-incident root-cause dossier within 24 hours.
