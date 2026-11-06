"""
Unit tests for DelayRiskPredictor module.
Verifies score boundaries, penalty accumulation, and tier classifications.
"""

import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ai_engine.risk_model import DelayRiskPredictor


class TestDelayRiskPredictor(unittest.TestCase):
    def setUp(self):
        self.predictor = DelayRiskPredictor()

    def test_ideal_application_low_risk(self):
        """Application well within SLA with all docs verified should be LOW risk."""
        data = {
            "daysElapsed": 3,
            "slaTargetDays": 14,
            "missingDocuments": [],
            "fireNocDaysRemaining": 180,
            "unresolvedQueriesCount": 0
        }
        res = self.predictor.evaluate_risk(data)
        self.assertLess(res["delayRiskScore"], 40)
        self.assertEqual(res["riskTier"], "LOW")
        self.assertFalse(res["isSlaAtRisk"])

    def test_sla_breach_penalty(self):
        """Application with elapsed days exceeding SLA target should trigger SLA penalty."""
        data = {
            "daysElapsed": 18,
            "slaTargetDays": 14,
            "missingDocuments": [],
            "fireNocDaysRemaining": 120,
            "unresolvedQueriesCount": 0
        }
        res = self.predictor.evaluate_risk(data)
        self.assertGreaterEqual(res["delayRiskScore"], 35)
        self.assertTrue(any("breached" in r for r in res["deficiencyReasons"]))

    def test_expired_fire_noc_triggers_high_risk(self):
        """Expired fire NOC should add critical penalty."""
        data = {
            "daysElapsed": 16,
            "slaTargetDays": 14,
            "missingDocuments": ["Fire Safety NOC", "Building Plan Approval"],
            "fireNocDaysRemaining": -2,
            "unresolvedQueriesCount": 2
        }
        res = self.predictor.evaluate_risk(data)
        self.assertGreaterEqual(res["delayRiskScore"], 70)
        self.assertEqual(res["riskTier"], "HIGH")
        self.assertTrue(res["isSlaAtRisk"])
        self.assertIn("Level 2 Escalation", res["escalationAction"])

    def test_score_bounded_between_zero_and_hundred(self):
        """Extreme input values should stay cleanly within [0, 100]."""
        extreme_data = {
            "daysElapsed": 200,
            "slaTargetDays": 5,
            "missingDocuments": ["Doc1", "Doc2", "Doc3", "Doc4", "Doc5"],
            "fireNocDaysRemaining": -100,
            "unresolvedQueriesCount": 20
        }
        res = self.predictor.evaluate_risk(extreme_data)
        self.assertEqual(res["delayRiskScore"], 100)


if __name__ == "__main__":
    unittest.main()
