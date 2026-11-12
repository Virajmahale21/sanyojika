"""
Unit tests for Coordinated Spam Filing Detector.
"""

import unittest
from ai_engine.spam_detector import detect_coordinated_burst


class TestSpamDetector(unittest.TestCase):
    def test_detects_identical_boilerplate_burst(self):
        msg = "College collects unauthorized bus transport fee for remote hostel students."
        history = [msg, msg, msg]
        res = detect_coordinated_burst(msg, history)
        self.assertTrue(res["is_coordinated_burst"])
        self.assertEqual(res["action"], "MERGE_UNDER_SINGLE_DOSSIER")

    def test_unique_submission_accepted(self):
        msg = "Laboratory instruments in mechanical block require calibration certificate."
        history = ["Hostel canteen hygiene issue reported by students."]
        res = detect_coordinated_burst(msg, history)
        self.assertFalse(res["is_coordinated_burst"])
        self.assertEqual(res["action"], "ACCEPT_INDIVIDUAL")


if __name__ == "__main__":
    unittest.main()
