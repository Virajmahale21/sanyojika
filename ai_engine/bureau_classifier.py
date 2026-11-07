"""
AICTE Sanyojika - Intelligent Bureau Routing & Assignment Engine
Maps complaint narrative keywords and severity flags to the appropriate
AICTE administrative bureau.
"""

from typing import Dict, List, Optional


BUREAU_MAPPINGS = {
    "PGRC": {
        "label": "Public Grievance Redressal Cell",
        "keywords": [
            "student", "harassment", "ragging", "mental", "hostel",
            "mess", "hygiene", "scholarship", "caste", "discrimination",
            "certificate", "original", "withholding", "marksheet"
        ]
    },
    "REGIONAL_BUREAU": {
        "label": "Regional Bureau (Territorial Oversight)",
        "keywords": [
            "faculty", "salary", "underpayment", "appointment", "adhoc",
            "qualifications", "phd", "recruitment", "service", "tenure",
            "inspection", "local", "campus", "attendance", "biometric"
        ]
    },
    "APPROVAL_BUREAU": {
        "label": "Approval & Accreditation Bureau",
        "keywords": [
            "intake", "seat", "unapproved", "affiliation", "land",
            "infrastructure", "laboratory", "built-up", "fire", "safety",
            "closure", "aicte approval", "eoaa", "extension"
        ]
    },
    "CENTRAL_VIGILANCE": {
        "label": "Central Vigilance & Legal Enforcement",
        "keywords": [
            "capitation", "bribe", "donation", "kickback", "fir",
            "criminal", "forgery", "fake", "fraud", "corruption",
            "financial", "misappropriation", "cash"
        ]
    }
}


def classify_bureau(
    narrative: str,
    declared_category: Optional[str] = None
) -> Dict[str, object]:
    """
    Evaluates grievance text and recommends primary and secondary bureau routing.
    """
    cleaned = narrative.lower()
    scores: Dict[str, int] = {b: 0 for b in BUREAU_MAPPINGS}
    matched_reasons: Dict[str, List[str]] = {b: [] for b in BUREAU_MAPPINGS}

    for bureau, meta in BUREAU_MAPPINGS.items():
        for kw in meta["keywords"]:
            if kw in cleaned:
                scores[bureau] += 1
                matched_reasons[bureau].append(kw)

    # If user explicitly declared a category, give a strong hint
    if declared_category:
        decl_lower = declared_category.lower()
        if "capitation" in decl_lower or "bribe" in decl_lower or "fraud" in decl_lower:
            scores["CENTRAL_VIGILANCE"] += 3
        elif "faculty" in decl_lower or "salary" in decl_lower:
            scores["REGIONAL_BUREAU"] += 3
        elif "student" in decl_lower or "ragging" in decl_lower:
            scores["PGRC"] += 3
        elif "infrastructure" in decl_lower or "approval" in decl_lower:
            scores["APPROVAL_BUREAU"] += 3

    # Find highest scoring bureau
    sorted_bureaus = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    primary_key, primary_score = sorted_bureaus[0]
    secondary_key, secondary_score = sorted_bureaus[1]

    # Fallback to PGRC if no keywords matched
    if primary_score == 0:
        primary_key = "PGRC"

    confidence = round(min(1.0, primary_score / 5.0), 2)

    return {
        "primary_bureau": primary_key,
        "primary_label": BUREAU_MAPPINGS[primary_key]["label"],
        "confidence": confidence,
        "keywords_detected": matched_reasons[primary_key],
        "secondary_bureau": secondary_key if secondary_score > 0 else None,
        "requires_inter_bureau_notice": secondary_score >= 2
    }
