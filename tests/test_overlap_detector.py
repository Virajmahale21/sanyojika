"""
Unit tests for OverlapDetector module.
Verifies tokenization, TF-IDF calculation, cosine similarity,
and cross-bureau Permanent ID duplicate detection.
"""

import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ai_engine.overlap_detector import OverlapDetector


class TestOverlapDetector(unittest.TestCase):
    def setUp(self):
        self.detector = OverlapDetector(similarity_threshold=0.60)

    def test_tokenize_cleans_punctuation_and_stopwords(self):
        """Tokenize should lowercase, strip punctuation and filter out stopwords."""
        raw_text = "The AICTE institution filed an urgent complaint with college authorities!"
        tokens = self.detector.tokenize(raw_text)
        self.assertNotIn("the", tokens)
        self.assertNotIn("with", tokens)
        self.assertIn("urgent", tokens)
        self.assertIn("authorities", tokens)

    def test_exact_permanent_id_match_detected(self):
        """Cases sharing the same Permanent ID should be flagged even with different text."""
        current_case = {
            "permanentId": "1-1090123456",
            "subject": "New Computer Division Request",
            "description": "Applying for additional division in AI"
        }
        history = [
            {
                "id": "c-101",
                "applicationNumber": "APP-2026-101",
                "bureau": "Western Regional Office",
                "permanentId": "1-1090123456",
                "subject": "Fire safety certificate clarification",
                "description": "Routine annual renewal query."
            }
        ]
        overlaps = self.detector.analyze_cross_bureau_overlap(current_case, history)
        self.assertEqual(len(overlaps), 1)
        self.assertTrue(overlaps[0]["isSameInstitution"])
        self.assertIn("Permanent ID Match", overlaps[0]["overlapReason"])

    def test_semantic_text_overlap_detected(self):
        """Cases with high text overlap should be detected even under different IDs."""
        current_case = {
            "permanentId": "1-9999",
            "subject": "Faculty Cadre Ratio Shortfall in Mechanical Engineering",
            "description": "Severe deficiency observed in Professor cadre ratio for mechanical department."
        }
        history = [
            {
                "id": "c-202",
                "applicationNumber": "APP-2026-202",
                "bureau": "Engineering Bureau",
                "permanentId": "1-8888",
                "subject": "Faculty Cadre Ratio Shortfall in Mechanical Engineering Department",
                "description": "Severe deficiency observed in Professor cadre ratio for mechanical department."
            }
        ]
        overlaps = self.detector.analyze_cross_bureau_overlap(current_case, history)
        self.assertEqual(len(overlaps), 1)
        self.assertGreaterEqual(overlaps[0]["similarityScore"], 70.0)

    def test_unrelated_cases_not_flagged(self):
        """Completely different cases with different IDs should not be flagged."""
        current_case = {
            "permanentId": "1-1111",
            "subject": "Approval for new MBA syllabus",
            "description": "Marketing management elective structure update."
        }
        history = [
            {
                "id": "c-303",
                "applicationNumber": "APP-2026-303",
                "bureau": "Architecture Bureau",
                "permanentId": "1-2222",
                "subject": "Studio carpet area layout",
                "description": "Drafting tables and studio square meter norms."
            }
        ]
        overlaps = self.detector.analyze_cross_bureau_overlap(current_case, history)
        self.assertEqual(len(overlaps), 0)


if __name__ == "__main__":
    unittest.main()
