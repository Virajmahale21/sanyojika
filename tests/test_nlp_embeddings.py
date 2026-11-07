"""
Unit tests for NLP Semantic Similarity Embedding Generator.
"""

import unittest
from ai_engine.nlp_embeddings import (
    tokenize,
    build_term_frequencies,
    compute_cosine_similarity,
    evaluate_complaint_overlap
)


class TestNLPEmbeddings(unittest.TestCase):

    def test_tokenize_filters_stopwords_and_short_words(self):
        text = "The college is demanding an unauthorized capitation fee of 500000 rupees!"
        tokens = tokenize(text)
        self.assertNotIn("the", tokens)
        self.assertNotIn("is", tokens)
        self.assertNotIn("an", tokens)
        self.assertIn("college", tokens)
        self.assertIn("capitation", tokens)
        self.assertIn("demanding", tokens)

    def test_cosine_similarity_identical_texts(self):
        text = "Faculty members have not been paid salary for six consecutive months."
        tokens = tokenize(text)
        vec = build_term_frequencies(tokens)
        sim = compute_cosine_similarity(vec, vec)
        self.assertAlmostEqual(sim, 1.0, places=3)

    def test_cosine_similarity_disjoint_texts(self):
        vec_a = {"laboratory": 0.5, "equipment": 0.5}
        vec_b = {"hostel": 0.5, "mess": 0.5}
        sim = compute_cosine_similarity(vec_a, vec_b)
        self.assertEqual(sim, 0.0)

    def test_evaluate_complaint_overlap_high_confidence(self):
        complaint_1 = (
            "Management demanding cash capitation fee for admission into Computer Science branch "
            "without issuing official AICTE receipt."
        )
        complaint_2 = (
            "Admission cell insists on cash payment for CS seat allotment without providing "
            "legitimate bank receipt or fee breakdown."
        )
        score, keywords = evaluate_complaint_overlap(complaint_1, complaint_2)
        self.assertGreater(score, 0.20)
        self.assertIn("receipt", keywords)


if __name__ == "__main__":
    unittest.main()
