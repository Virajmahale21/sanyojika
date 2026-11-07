"""
Unit tests for Institutional Compliance & Risk Index Calculator.
"""

import unittest
from ai_engine.compliance_score import compute_institutional_risk


class TestComplianceScore(unittest.TestCase):

    def test_low_risk_institution(self):
        result = compute_institutional_risk(
            total_complaints=2,
            unresolved_complaints=0,
            overdue_complaints=0,
            overlap_collisions=0,
            has_active_court_matter=False,
            past_show_cause_count=0
        )
        self.assertEqual(result["risk_tier"], "LOW")
        self.assertLess(result["risk_score"], 25.0)

    def test_critical_risk_institution(self):
        result = compute_institutional_risk(
            total_complaints=35,
            unresolved_complaints=28,
            overdue_complaints=6,
            overlap_collisions=3,
            has_active_court_matter=True,
            past_show_cause_count=2
        )
        self.assertEqual(result["risk_tier"], "CRITICAL")
        self.assertGreaterEqual(result["risk_score"], 75.0)
        self.assertIn("Immediate Multi-Bureau", result["recommended_regulatory_action"])

    def test_score_does_not_exceed_100(self):
        result = compute_institutional_risk(
            total_complaints=200,
            unresolved_complaints=180,
            overdue_complaints=20,
            overlap_collisions=15,
            has_active_court_matter=True,
            past_show_cause_count=10
        )
        self.assertLessEqual(result["risk_score"], 100.0)


if __name__ == "__main__":
    unittest.main()
