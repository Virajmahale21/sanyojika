"""
AnumatiSetu AI Engine — Semantic Overlap & Duplicate Detection Module
AICTE APH 2026-27 Automated Regulatory Compliance Pipeline

Detects cross-bureau complaint overlaps and duplicate institution filings
using TF-IDF vectorization and cosine similarity scoring.
"""

from typing import List, Dict, Any, Tuple
import re
import math
from collections import Counter


class OverlapDetector:
    """
    Computes text similarity and entity overlap between applications
    and grievance complaints across AICTE Bureaus and Regional Offices.
    """

    def __init__(self, similarity_threshold: float = 0.72):
        self.similarity_threshold = similarity_threshold
        # Regulatory stopwords for academic/approval context
        self.stopwords = {
            "the", "a", "an", "and", "or", "in", "on", "at", "to", "for",
            "of", "with", "by", "is", "was", "are", "were", "be", "been",
            "aicte", "institution", "college", "application", "complaint"
        }

    def tokenize(self, text: str) -> List[str]:
        """Sanitizes and tokenizes natural language regulatory text."""
        cleaned = re.sub(r"[^\w\s]", " ", text.lower())
        tokens = cleaned.split()
        return [t for t in tokens if len(t) > 2 and t not in self.stopwords]

    def compute_tf_idf(self, docs: List[List[str]]) -> List[Dict[str, float]]:
        """Calculates term frequency - inverse document frequency vectors."""
        num_docs = len(docs)
        if num_docs == 0:
            return []

        # Document frequency
        df: Counter = Counter()
        for doc in docs:
            unique_terms = set(doc)
            for term in unique_terms:
                df[term] += 1

        vectors: List[Dict[str, float]] = []
        for doc in docs:
            tf: Counter = Counter(doc)
            total_terms = len(doc) or 1
            vector = {}
            for term, count in tf.items():
                term_tf = count / total_terms
                term_idf = math.log((1 + num_docs) / (1 + df[term])) + 1.0
                vector[term] = term_tf * term_idf
            vectors.append(vector)
        return vectors

    def cosine_similarity(self, vec1: Dict[str, float], vec2: Dict[str, float]) -> float:
        """Calculates cosine similarity between two sparse TF-IDF vectors."""
        intersection = set(vec1.keys()) & set(vec2.keys())
        dot_product = sum(vec1[k] * vec2[k] for k in intersection)

        norm1 = math.sqrt(sum(v * v for v in vec1.values()))
        norm2 = math.sqrt(sum(v * v for v in vec2.values()))

        if norm1 == 0.0 or norm2 == 0.0:
            return 0.0
        return dot_product / (norm1 * norm2)

    def analyze_cross_bureau_overlap(
        self,
        current_case: Dict[str, Any],
        historical_cases: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Scans historical applications/complaints to identify overlaps by:
        1. Exact Permanent ID (PID) matching across regional cells
        2. High textual semantic overlap in deficiency/complaint narratives
        """
        flagged_overlaps: List[Dict[str, Any]] = []

        curr_text = f"{current_case.get('subject', '')} {current_case.get('description', '')}"
        curr_tokens = self.tokenize(curr_text)
        curr_pid = current_case.get("permanentId")

        all_tokens = [curr_tokens] + [
            self.tokenize(f"{c.get('subject', '')} {c.get('description', '')}")
            for c in historical_cases
        ]
        vectors = self.compute_tf_idf(all_tokens)
        curr_vec = vectors[0]

        for i, hist_case in enumerate(historical_cases):
            hist_vec = vectors[i + 1]
            similarity = self.cosine_similarity(curr_vec, hist_vec)
            hist_pid = hist_case.get("permanentId")

            is_pid_match = bool(curr_pid and hist_pid and curr_pid == hist_pid)
            is_semantic_overlap = similarity >= self.similarity_threshold

            if is_pid_match or is_semantic_overlap:
                flagged_overlaps.append({
                    "caseId": hist_case.get("id"),
                    "applicationNumber": hist_case.get("applicationNumber"),
                    "bureau": hist_case.get("bureau"),
                    "permanentId": hist_pid,
                    "isSameInstitution": is_pid_match,
                    "similarityScore": round(similarity * 100, 2),
                    "overlapReason": (
                        "Cross-Bureau Institutional Linkage (Permanent ID Match)"
                        if is_pid_match
                        else f"High Semantic Similarity ({round(similarity * 100, 1)}%)"
                    )
                })

        return sorted(flagged_overlaps, key=lambda x: x["similarityScore"], reverse=True)
