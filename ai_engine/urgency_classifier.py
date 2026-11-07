"""
AICTE Sanyojika - Grievance Urgency Priority Classifier
Classifies cases as IMMEDIATE, HIGH, MEDIUM, or ROUTINE based on statutory triggers.
"""

from typing import Dict, Any

URGENT_TRIGGERS = [
    "suicide", "threat", "violence", "sexual harassment", "physical abuse",
    "hostel lockout", "degree withheld", "immediate police", "fir lodged"
]

def classify_urgency(text: str) -> Dict[str, Any]:
    cleaned = text.lower()
    matched = [t for t in URGENT_TRIGGERS if t in cleaned]
    
    if matched:
        priority = "IMMEDIATE"
        sla_hours = 24
    elif any(w in cleaned for w in ["capitation", "bribe", "faculty strike", "court hearing"]):
        priority = "HIGH"
        sla_hours = 72
    elif any(w in cleaned for w in ["fee refund", "marksheet delay", "attendance discrepancy"]):
        priority = "MEDIUM"
        sla_hours = 168
    else:
        priority = "ROUTINE"
        sla_hours = 360
        
    return {
        "priority": priority,
        "sla_target_hours": sla_hours,
        "triggered_critical_terms": matched
    }
