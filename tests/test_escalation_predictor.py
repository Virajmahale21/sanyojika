"""
Unit tests for Predictive Escalation Probability Model.
"""

import unittest
from ai_engine.escalation_predictor import predict_escalation_probability

class TestEscalationPredictor(unittest.TestCase):
    def test_high_risk_escalation(self):
        res = predict_escalation_probability(
            days_open=60,
            category="CAPITATION_FEE",
            officer_response_count=0,
            has_prior_notices=True
        )
        self.assertGreaterEqual(res["escalation_probability"], 0.75)
        self.assertEqual(res["risk_tier"], "HIGH_ESCALATION_RISK")

    def test_low_risk_routine(self):
        res = predict_escalation_probability(
            days_open=3,
            category="ROUTINE_INQUIRY",
            officer_response_count=2,
            has_prior_notices=False
        )
        self.assertLess(res["escalation_probability"], 0.45)
        self.assertEqual(res["risk_tier"], "LOW_ESCALATION_RISK")

if __name__ == "__main__":
    unittest.main()
