"""
AICTE Sanyojika - Tuition & Fee Structure Ceiling Validator
Detects illegal overcharging beyond state Fee Regulatory Committee (FRC) caps.
"""

from typing import Dict, Any


def validate_fee_compliance(
    approved_frc_ceiling: float,
    charged_tuition_fee: float,
    unlisted_misc_charges: float = 0.0
) -> Dict[str, Any]:
    total_billed = charged_tuition_fee + unlisted_misc_charges
    excess_amount = round(max(0.0, total_billed - approved_frc_ceiling), 2)
    violation_detected = excess_amount > 0.0

    excess_percent = round(
        (excess_amount / max(1.0, approved_frc_ceiling)) * 100.0, 2
    )

    return {
        "violation_detected": violation_detected,
        "approved_ceiling": approved_frc_ceiling,
        "total_billed": round(total_billed, 2),
        "excess_amount": excess_amount,
        "excess_percentage": excess_percent,
        "refund_directive_required": violation_detected
    }
