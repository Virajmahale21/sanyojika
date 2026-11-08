"""
Unit tests for Distress Analyzer.
"""

import unittest
from ai_engine.distress_analyzer import analyze_distress

class TestDistressAnalyzer(unittest.TestCase):
    def test_high_distress_alert(self):
        narrative = "The continuous humiliation has caused extreme stress and depression, unable to sleep."
        res = analyze_distress(narrative)
        self.assertTrue(res["requires_immediate_counselor_alert"])
        self.assertGreaterEqual(res["distress_score"], 0.35)
        self.assertEqual(res["dispatch_protocol"], "AICTE_EMERGENCY_COUNSELING_HOTLINE")

    def test_benign_academic_inquiry(self):
        narrative = "Please provide syllabus update for third semester mathematics."
        res = analyze_distress(narrative)
        self.assertFalse(res["requires_immediate_counselor_alert"])
        self.assertEqual(res["distress_score"], 0.0)

if __name__ == "__main__":
    unittest.main()
