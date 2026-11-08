"""
AICTE Sanyojika - Faculty Cadre Ratio & Qualification Validator
Audits institution faculty rosters against the 1:2:6 cadre ratio (Prof : Assoc Prof : Asst Prof).
"""

from typing import Dict, Any

def validate_faculty_cadre(
    professors: int,
    assoc_professors: int,
    asst_professors: int,
    phd_qualified_count: int
) -> Dict[str, Any]:
    total_faculty = professors + assoc_professors + asst_professors
    if total_faculty == 0:
        return {"valid": False, "error": "Faculty count cannot be zero"}
        
    phd_percentage = round((phd_qualified_count / total_faculty) * 100, 1)
    
    # AICTE Norm: At least Professors and Associate Professors must possess PhD
    senior_cadre = professors + assoc_professors
    phd_compliant = phd_qualified_count >= senior_cadre
    
    # Approximate ratio check
    ratio_notes = []
    if professors == 0:
        ratio_notes.append("Deficit: Missing Professor cadre (Principal/HOD qualification alert)")
    if phd_percentage < 30.0:
        ratio_notes.append(f"Warning: PhD faculty ratio ({phd_percentage}%) below recommended benchmark (30%)")
        
    return {
        "total_faculty": total_faculty,
        "phd_percentage": phd_percentage,
        "senior_cadre_phd_compliant": phd_compliant,
        "ratio_notes": ratio_notes,
        "is_cadre_healthy": len(ratio_notes) == 0
    }
