"""
AICTE Sanyojika - Daily Bureau Escalation Digest Script
Generates structured notification payloads for cases approaching SLA expiration.
"""

from typing import List, Dict, Any
from ai_engine.sla_timer import compute_sla_status


def build_daily_escalation_digest(cases: List[Dict[str, str]]) -> List[Dict[str, Any]]:
    alerts = []
    for c in cases:
        sla = compute_sla_status(c["filed_at_iso"], sla_days=30)
        if sla["status"] in {"BREACHED", "CRITICAL_WARNING"}:
            alerts.append({
                "case_id": c["id"],
                "bureau": c["bureau"],
                "sla_status": sla["status"],
                "escalation_tier": sla["escalation_tier"],
                "remaining_days": sla["remaining_days"]
            })
    return alerts


if __name__ == "__main__":
    sample_cases = [
        {"id": "CMP-2026-011", "bureau": "PGRC", "filed_at_iso": "2026-09-01T10:00:00Z"},
        {"id": "CMP-2026-205", "bureau": "RB-WEST", "filed_at_iso": "2026-11-10T10:00:00Z"}
    ]
    print("Escalation Alerts:", build_daily_escalation_digest(sample_cases))
