"""
AICTE Sanyojika - Predictive Escalation Probability Model
Estimates the statistical likelihood of an unresolved grievance escalating to legal/vigilance action.
"""

import math
from typing import Dict, Any

CATEGORY_WEIGHTS = {
    "CAPITATION_FEE": 0.40,
    "SEXUAL_HARASSMENT": 0.50,
    "FACULTY_SALARY_WITHHOLDING": 0.30,
    "INFRASTRUCTURE_DEFICIT": 0.20,
    "ADMISSION_IRREGULARITY": 0.35,
    "ROUTINE_INQUIRY": 0.05
}

def predict_escalation_probability(
    days_open: int,
    category: str,
    officer_response_count: int,
    has_prior_notices: bool = False
) -> Dict[str, Any]:
    cat_weight = CATEGORY_WEIGHTS.get(category.upper(), 0.15)
    
    # Linear combination
    z = (days_open * 0.04) + (cat_weight * 3.0) - (officer_response_count * 0.5)
    if has_prior_notices:
        z += 1.2
        
    # Sigmoid activation
    probability = round(1.0 / (1.0 + math.exp(-z)), 3)
    
    if probability >= 0.75:
        tier = "HIGH_ESCALATION_RISK"
        recommendation = "Immediate Intervention by Bureau Head & Vigilance Memo"
    elif probability >= 0.45:
        tier = "MODERATE_ESCALATION_RISK"
        recommendation = "Expedite Scrutiny Committee Response"
    else:
        tier = "LOW_ESCALATION_RISK"
        recommendation = "Standard Processing Queue"
        
    return {
        "escalation_probability": probability,
        "risk_tier": tier,
        "recommendation": recommendation,
        "days_elapsed": days_open
    }
