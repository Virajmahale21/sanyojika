"""
Unit tests for Evidence Deduplication Fingerprinter.
"""

import unittest
from ai_engine.evidence_dedup import compute_evidence_fingerprint

class TestEvidenceDedup(unittest.TestCase):
    def test_identical_bytes_generate_matching_hash(self):
        sample = b"AICTE Capitation Fee Cash Receipt Sample"
        fp1 = compute_evidence_fingerprint(sample, "receipt1.pdf")
        fp2 = compute_evidence_fingerprint(sample, "duplicate_scan.pdf")
        self.assertEqual(fp1["sha256"], fp2["sha256"])
        self.assertEqual(fp1["fingerprint"], fp2["fingerprint"])

    def test_different_bytes_differ(self):
        fp1 = compute_evidence_fingerprint(b"Doc A", "a.pdf")
        fp2 = compute_evidence_fingerprint(b"Doc B", "b.pdf")
        self.assertNotEqual(fp1["sha256"], fp2["sha256"])

if __name__ == "__main__":
    unittest.main()
