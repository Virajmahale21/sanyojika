"""
AnumatiSetu AI Engine — Delay Risk & SLA Breach Predictive Model
AICTE APH 2026-27 Automated Regulatory Compliance Pipeline

Evaluates application parameters and historical scrutiny turnaround times
to compute a deterministic delay risk score and proactive SLA tier alert.
"""

from typing import Dict, Any, List


class DelayRiskPredictor:
    """
    Predicts SLA breach risk and identifies specific operational deficiencies
    contributing to regulatory processing delays.
    """

    def __init__(self):
        # Weights for delay factors based on APH statutory scrutiny benchmarks
        self.w_deadline_elapsed = 35.0
        self.w_missing_mandatory_docs = 25.0
        self.w_expiring_noc = 20.0
        self.w_past_cycle_deficiencies = 20.0

    def evaluate_risk(self, application_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates delay risk score (0-100) and produces actionable explanations.
        """
        score = 0.0
        reasons: List[str] = []

        days_elapsed = float(application_data.get("daysElapsed", 0))
        sla_target_days = float(application_data.get("slaTargetDays", 14))
        missing_docs = application_data.get("missingDocuments", [])
        noc_days_remaining = application_data.get("fireNocDaysRemaining", 90)
        unresolved_queries = application_data.get("unresolvedQueriesCount", 0)

        # 1. Timeline elapsed ratio
        if sla_target_days > 0:
            elapsed_ratio = days_elapsed / sla_target_days
            if elapsed_ratio >= 1.0:
                score += self.w_deadline_elapsed
                days_overdue = int(days_elapsed - sla_target_days)
                reasons.append(f"Statutory target deadline elapsed by {days_overdue} days (SLA breached)")
            elif elapsed_ratio >= 0.75:
                score += self.w_deadline_elapsed * 0.65
                reasons.append("Stage duration approaching statutory SLA cutoff (> 75% elapsed)")

        # 2. Missing mandatory documents
        if missing_docs:
            doc_penalty = min(self.w_missing_mandatory_docs, len(missing_docs) * 10.0)
            score += doc_penalty
            reasons.append(f"{len(missing_docs)} mandatory statutory document(s) unverified or missing")

        # 3. Fire NOC expiration proximity
        if noc_days_remaining is not None:
            if noc_days_remaining < 0:
                score += self.w_expiring_noc
                reasons.append("Mandatory Fire Safety NOC certificate has expired")
            elif noc_days_remaining <= 30:
                score += self.w_expiring_noc * 0.75
                reasons.append(f"Fire Safety NOC validity expires in {noc_days_remaining} days")

        # 4. Unaddressed scrutiny queries
        if unresolved_queries > 0:
            query_penalty = min(self.w_past_cycle_deficiencies, unresolved_queries * 8.0)
            score += query_penalty
            reasons.append(f"{unresolved_queries} scrutiny deficiency clarification(s) unaddressed by institution")

        final_score = int(min(100.0, max(0.0, round(score))))

        # Determine Tier & Escalation Level
        if final_score >= 70:
            risk_tier = "HIGH"
            escalation_action = "Level 2 Escalation (Regional Director Alert & Expedited Review)"
        elif final_score >= 40:
            risk_tier = "MEDIUM"
            escalation_action = "Level 1 Escalation (Scrutiny Officer Workload Prioritization)"
        else:
            risk_tier = "LOW"
            escalation_action = "Standard Lifecycle Monitoring (Within SLA Threshold)"

        return {
            "delayRiskScore": final_score,
            "riskTier": risk_tier,
            "escalationAction": escalation_action,
            "isSlaAtRisk": final_score >= 40,
            "deficiencyReasons": reasons if reasons else ["All regulatory milestones progressing within standard SLA parameters."]
        }
