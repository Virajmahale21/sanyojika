"""
AICTE Sanyojika - Institutional Accreditation & NBA/NAAC Validity Checker
Verifies expiry windows of institutional accreditation tiers and flags lapse risks.
"""

from datetime import datetime
from typing import Dict, Any, Optional


def check_accreditation_status(
    nba_expiry_iso: Optional[str],
    naac_grade: Optional[str],
    reference_date_iso: str
) -> Dict[str, Any]:
    ref_dt = datetime.fromisoformat(reference_date_iso.replace("Z", "+00:00"))
    nba_active = False
    days_remaining = 0

    if nba_expiry_iso:
        exp_dt = datetime.fromisoformat(nba_expiry_iso.replace("Z", "+00:00"))
        delta = (exp_dt - ref_dt).days
        days_remaining = delta
        nba_active = delta >= 0

    valid_naac = (naac_grade or "").upper() in {"A++", "A+", "A", "B++", "B+"}
    renewal_alert = nba_active and days_remaining <= 90

    return {
        "nba_active": nba_active,
        "nba_days_remaining": days_remaining,
        "naac_grade": naac_grade or "UNGRADED",
        "naac_standing_valid": valid_naac,
        "requires_renewal_notice": (not nba_active) or renewal_alert
    }
