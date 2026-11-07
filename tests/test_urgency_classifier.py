"""
Unit tests for Grievance Urgency Priority Classifier.
"""

import unittest
from ai_engine.urgency_classifier import classify_urgency

class TestUrgencyClassifier(unittest.TestCase):
    def test_immediate_priority_trigger(self):
        narrative = "Student faces physical abuse and severe hostel lockout after filing complaint."
        res = classify_urgency(narrative)
        self.assertEqual(res["priority"], "IMMEDIATE")
        self.assertEqual(res["sla_target_hours"], 24)
        self.assertIn("hostel lockout", res["triggered_critical_terms"])

    def test_routine_priority(self):
        narrative = "Requesting clarification on library lending hours during weekend."
        res = classify_urgency(narrative)
        self.assertEqual(res["priority"], "ROUTINE")
        self.assertEqual(res["sla_target_hours"], 360)

if __name__ == "__main__":
    unittest.main()
