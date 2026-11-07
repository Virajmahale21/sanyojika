"""
Unit tests for AICTE Bureau Routing & Assignment Classifier.
"""

import unittest
from ai_engine.bureau_classifier import classify_bureau


class TestBureauClassifier(unittest.TestCase):

    def test_classify_vigilance_for_capitation_fee(self):
        narrative = "The college is demanding cash donation and capitation bribe for BTech seats."
        res = classify_bureau(narrative)
        self.assertEqual(res["primary_bureau"], "CENTRAL_VIGILANCE")
        self.assertIn("capitation", res["keywords_detected"])

    def test_classify_regional_bureau_for_faculty_salary(self):
        narrative = "Assistant professors salary has been withheld without appointment letters."
        res = classify_bureau(narrative)
        self.assertEqual(res["primary_bureau"], "REGIONAL_BUREAU")
        self.assertIn("salary", res["keywords_detected"])

    def test_classify_pgrc_for_student_issues(self):
        narrative = "Senior students engaged in severe ragging in hostel mess after curfew."
        res = classify_bureau(narrative)
        self.assertEqual(res["primary_bureau"], "PGRC")
        self.assertIn("ragging", res["keywords_detected"])

    def test_inter_bureau_notice_flag(self):
        narrative = (
            "Management taking cash capitation fee while simultaneously underpaying faculty "
            "salary and falsifying attendance records."
        )
        res = classify_bureau(narrative)
        self.assertTrue(res["requires_inter_bureau_notice"])


if __name__ == "__main__":
    unittest.main()
