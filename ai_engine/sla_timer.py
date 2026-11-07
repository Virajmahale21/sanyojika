"""
AICTE Sanyojika - SLA Deadline & Escalation Tier Calculator
Monitors statutory turnaround deadlines and computes escalation triggers.
"""

from datetime import datetime, timedelta
from typing import Dict, Any

def compute_sla_status(filing_time_iso: str, sla_days: int = 30) -> Dict[str, Any]:
    filed = datetime.fromisoformat(filing_time_iso.replace("Z", "+00:00"))
    deadline = filed + timedelta(days=sla_days)
    now = datetime.now(filed.tzinfo)
    
    remaining = (deadline - now).total_seconds()
    remaining_days = round(remaining / 86400, 1)
    
    if remaining_days < 0:
        status = "BREACHED"
        escalation_tier = "LEVEL_3_CVO"
    elif remaining_days <= 5:
        status = "CRITICAL_WARNING"
        escalation_tier = "LEVEL_2_BUREAU_HEAD"
    elif remaining_days <= 10:
        status = "EXPIRING_SOON"
        escalation_tier = "LEVEL_1_INVESTIGATING_OFFICER"
    else:
        status = "ON_TRACK"
        escalation_tier = "NORMAL"
        
    return {
        "status": status,
        "escalation_tier": escalation_tier,
        "remaining_days": remaining_days,
        "deadline_iso": deadline.isoformat()
    }
