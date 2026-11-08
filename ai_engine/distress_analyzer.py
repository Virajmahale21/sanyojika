"""
AICTE Sanyojika - Student Distress & Mental Health Urgency Analyzer
Identifies high-distress indicators in student complaints for immediate psycho-social intervention.
"""

from typing import Dict, Any

DISTRESS_INDICATORS = [
    "mental breakdown", "depression", "unable to sleep", "suicide", "end my life",
    "torture", "extreme stress", "crying every day", "hopeless", "humiliation"
]

def analyze_distress(text: str) -> Dict[str, Any]:
    cleaned = text.lower()
    matches = [kw for kw in DISTRESS_INDICATORS if kw in cleaned]
    
    distress_score = round(min(1.0, len(matches) * 0.35), 2)
    requires_counselor = distress_score >= 0.35 or any(k in cleaned for k in ["suicide", "end my life"])
    
    return {
        "distress_score": distress_score,
        "requires_immediate_counselor_alert": requires_counselor,
        "matched_distress_keywords": matches,
        "dispatch_protocol": "AICTE_EMERGENCY_COUNSELING_HOTLINE" if requires_counselor else "STANDARD"
    }
