"""
AICTE Sanyojika - Institutional Compliance & Risk Index Calculator
Computes a composite compliance score (0-100) and risk tier classification
(CRITICAL, HIGH, ELEVATED, LOW) for accredited technical institutions.
"""

from typing import Dict, Any


def compute_institutional_risk(
    total_complaints: int,
    unresolved_complaints: int,
    overdue_complaints: int,
    overlap_collisions: int,
    has_active_court_matter: bool = False,
    past_show_cause_count: int = 0
) -> Dict[str, Any]:
    """
    Computes weighted institutional risk index:
    - Base grievance pressure: 25%
    - SLA overdue penalty: 30%
    - Multi-bureau collision penalty: 25%
    - Regulatory history & litigation: 20%
    """
    # 1. Base Grievance Ratio (0-25)
    unresolved_ratio = (unresolved_complaints / max(1, total_complaints))
    score_grievance = min(25.0, unresolved_ratio * 15.0 + min(10.0, total_complaints * 0.5))

    # 2. Overdue Penalty (0-30)
    score_overdue = min(30.0, overdue_complaints * 6.0)

    # 3. Inter-Bureau Collision Penalty (0-25)
    score_overlaps = min(25.0, overlap_collisions * 8.0)

    # 4. Regulatory & Litigation Factors (0-20)
    score_history = min(12.0, past_show_cause_count * 4.0)
    if has_active_court_matter:
        score_history += 8.0

    total_risk = round(min(100.0, score_grievance + score_overdue + score_overlaps + score_history), 2)

    # Classification
    if total_risk >= 75.0:
        tier = "CRITICAL"
        action = "Immediate Multi-Bureau Joint Inspection & Show-Cause"
    elif total_risk >= 50.0:
        tier = "HIGH"
        action = "Notice of Inquiry & Scrutiny Committee Review"
    elif total_risk >= 25.0:
        tier = "ELEVATED"
        action = "Routine Monitoring & Bureau Alert"
    else:
        tier = "LOW"
        action = "Normal Operational Standing"

    return {
        "risk_score": total_risk,
        "risk_tier": tier,
        "recommended_regulatory_action": action,
        "breakdown": {
            "grievance_pressure": round(score_grievance, 2),
            "sla_overdue_penalty": round(score_overdue, 2),
            "inter_bureau_overlaps": round(score_overlaps, 2),
            "regulatory_litigation": round(score_history, 2)
        }
    }
