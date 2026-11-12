"""
Unit tests for Institutional Accreditation Validity Checker.
"""

import unittest
from ai_engine.accreditation_checker import check_accreditation_status


class TestAccreditationChecker(unittest.TestCase):
    def test_valid_accreditation(self):
        res = check_accreditation_status(
            nba_expiry_iso="2027-06-30T00:00:00+00:00",
            naac_grade="A+",
            reference_date_iso="2026-11-12T00:00:00+00:00"
        )
        self.assertTrue(res["nba_active"])
        self.assertTrue(res["naac_standing_valid"])
        self.assertFalse(res["requires_renewal_notice"])

    def test_expired_nba_triggers_notice(self):
        res = check_accreditation_status(
            nba_expiry_iso="2026-09-01T00:00:00+00:00",
            naac_grade="B",
            reference_date_iso="2026-11-12T00:00:00+00:00"
        )
        self.assertFalse(res["nba_active"])
        self.assertTrue(res["requires_renewal_notice"])


if __name__ == "__main__":
    unittest.main()
