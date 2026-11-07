"""
Unit tests for Multilingual Preprocessor.
"""

import unittest
from ai_engine.multilingual_preprocessor import normalize_multilingual_text

class TestMultilingualPreprocessor(unittest.TestCase):
    def test_hindi_keyword_normalization(self):
        text = "कॉलेज में अवैध फीस और रिश्वत मांगी जा रही है"
        normalized = normalize_multilingual_text(text)
        self.assertIn("illegal", normalized)
        self.assertIn("fee", normalized)
        self.assertIn("bribe", normalized)

if __name__ == "__main__":
    unittest.main()
