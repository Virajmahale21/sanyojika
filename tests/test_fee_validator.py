"""
Unit tests for Fee Structure Ceiling Validator.
"""

import unittest
from ai_engine.fee_validator import validate_fee_compliance


class TestFeeValidator(unittest.TestCase):
    def test_compliant_fee(self):
        res = validate_fee_compliance(approved_frc_ceiling=115000.0, charged_tuition_fee=115000.0)
        self.assertFalse(res["violation_detected"])
        self.assertEqual(res["excess_amount"], 0.0)

    def test_overcharged_fee_triggers_refund(self):
        res = validate_fee_compliance(
            approved_frc_ceiling=100000.0,
            charged_tuition_fee=120000.0,
            unlisted_misc_charges=15000.0
        )
        self.assertTrue(res["violation_detected"])
        self.assertEqual(res["excess_amount"], 35000.0)
        self.assertTrue(res["refund_directive_required"])


if __name__ == "__main__":
    unittest.main()
