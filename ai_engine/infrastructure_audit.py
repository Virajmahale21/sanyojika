"""
AICTE Sanyojika - Institutional Infrastructure Compliance Audit Parser
Verifies laboratory, instructional, and administrative floor space requirements.
"""

from typing import Dict, Any

AICTE_AREA_NORMS_SQM = {
    "CLASSROOM_PER_STUDENT": 1.2,
    "LAB_PER_STUDENT": 4.5,
    "ADMINISTRATIVE_BASE_SQM": 500.0,
    "AMENITIES_BASE_SQM": 300.0
}

def audit_infrastructure(
    total_enrolled_students: int,
    classroom_area_sqm: float,
    lab_area_sqm: float,
    admin_area_sqm: float,
    fire_safety_valid: bool
) -> Dict[str, Any]:
    min_classroom = round(total_enrolled_students * AICTE_AREA_NORMS_SQM["CLASSROOM_PER_STUDENT"], 1)
    min_lab = round(total_enrolled_students * AICTE_AREA_NORMS_SQM["LAB_PER_STUDENT"], 1)
    
    classroom_compliant = classroom_area_sqm >= min_classroom
    lab_compliant = lab_area_sqm >= min_lab
    admin_compliant = admin_area_sqm >= AICTE_AREA_NORMS_SQM["ADMINISTRATIVE_BASE_SQM"]
    
    all_compliant = classroom_compliant and lab_compliant and admin_compliant and fire_safety_valid
    
    deficits = []
    if not classroom_compliant:
        deficits.append(f"Classroom area short by {round(min_classroom - classroom_area_sqm, 1)} sq.m")
    if not lab_compliant:
        deficits.append(f"Laboratory area short by {round(min_lab - lab_area_sqm, 1)} sq.m")
    if not admin_compliant:
        deficits.append(f"Admin space deficit of {round(AICTE_AREA_NORMS_SQM['ADMINISTRATIVE_BASE_SQM'] - admin_area_sqm, 1)} sq.m")
    if not fire_safety_valid:
        deficits.append("Fire Safety NOC is expired or unverified")
        
    return {
        "compliant": all_compliant,
        "deficits": deficits,
        "classroom_coverage_ratio": round(classroom_area_sqm / max(1.0, min_classroom), 2),
        "lab_coverage_ratio": round(lab_area_sqm / max(1.0, min_lab), 2)
    }
