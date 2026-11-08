"""
Unit tests for Faculty Cadre Ratio Validator.
"""

import unittest
from ai_engine.faculty_validator import validate_faculty_cadre

class TestFacultyValidator(unittest.TestCase):
    def test_healthy_faculty_cadre(self):
        res = validate_faculty_cadre(
            professors=2,
            assoc_professors=4,
            asst_professors=12,
            phd_qualified_count=8
        )
        self.assertTrue(res["senior_cadre_phd_compliant"])
        self.assertTrue(res["is_cadre_healthy"])
        self.assertGreaterEqual(res["phd_percentage"], 30.0)

    def test_missing_professors_alert(self):
        res = validate_faculty_cadre(
            professors=0,
            assoc_professors=2,
            asst_professors=15,
            phd_qualified_count=2
        )
        self.assertFalse(res["is_cadre_healthy"])
        self.assertTrue(any("Missing Professor" in n for n in res["ratio_notes"]))

if __name__ == "__main__":
    unittest.main()
