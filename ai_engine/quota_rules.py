"""
AICTE Sanyojika - Institutional Category & Quota Intake Rules
Verifies approved seats against regulatory ceilings per course and faculty ratio.
"""

from typing import Dict, Any

AICTE_NORMS = {
    "STUDENT_FACULTY_RATIO": 20.0,
    "MAX_INTAKE_PER_DIVISION": 60,
    "MANDATORY_LAB_SQ_METERS_PER_STUDENT": 4.5
}

def validate_intake_proposal(proposed_intake: int, faculty_count: int, lab_area_sqm: float) -> Dict[str, Any]:
    min_faculty_required = round(proposed_intake / AICTE_NORMS["STUDENT_FACULTY_RATIO"], 1)
    min_lab_required = round(proposed_intake * AICTE_NORMS["MANDATORY_LAB_SQ_METERS_PER_STUDENT"], 1)
    
    faculty_ok = faculty_count >= min_faculty_required
    lab_ok = lab_area_sqm >= min_lab_required
    
    return {
        "approved": faculty_ok and lab_ok,
        "faculty_compliance": {
            "current": faculty_count,
            "required": min_faculty_required,
            "compliant": faculty_ok
        },
        "lab_area_compliance": {
            "current_sqm": lab_area_sqm,
            "required_sqm": min_lab_required,
            "compliant": lab_ok
        }
    }
