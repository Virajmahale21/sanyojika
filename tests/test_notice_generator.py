"""
Unit tests for Notice Generator.
"""

import unittest
from ai_engine.notice_generator import generate_show_cause_notice

class TestNoticeGenerator(unittest.TestCase):
    def test_notice_generation(self):
        res = generate_show_cause_notice(
            institution_name="Test Engineering College",
            pid="1-9999",
            violation_clause="Unauthorized Capitation Fees"
        )
        self.assertIn("OFFICIAL SHOW-CAUSE NOTICE", res["notice_body"])
        self.assertIn("1-9999", res["notice_body"])
        self.assertEqual(res["response_deadline_days"], 14)

if __name__ == "__main__":
    unittest.main()
