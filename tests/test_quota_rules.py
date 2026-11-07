"""
Unit tests for Institutional Quota Rules.
"""

import unittest
from ai_engine.quota_rules import validate_intake_proposal

class TestQuotaRules(unittest.TestCase):
    def test_compliant_proposal(self):
        res = validate_intake_proposal(proposed_intake=120, faculty_count=8, lab_area_sqm=600.0)
        self.assertTrue(res["approved"])

    def test_deficit_faculty_rejection(self):
        res = validate_intake_proposal(proposed_intake=120, faculty_count=3, lab_area_sqm=600.0)
        self.assertFalse(res["approved"])
        self.assertFalse(res["faculty_compliance"]["compliant"])

if __name__ == "__main__":
    unittest.main()
