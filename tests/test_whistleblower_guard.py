"""
Unit tests for Whistleblower Guard.
"""

import unittest
from ai_engine.whistleblower_guard import sanitize_whistleblower_narrative

class TestWhistleblowerGuard(unittest.TestCase):
    def test_roll_number_sanitization(self):
        text = "I am a student with Roll No: 2022-CS-041 reporting illegal capitation fee collection."
        res = sanitize_whistleblower_narrative(text)
        self.assertNotIn("2022-CS-041", res["sanitized_narrative"])
        self.assertIn("[PROTECTED_STUDENT_ID]", res["sanitized_narrative"])
        self.assertEqual(res["identity_leaks_prevented"], 1)

if __name__ == "__main__":
    unittest.main()
