"""
Unit tests for Audit Ledger Hash-Chain Verifier.
"""

import unittest
from ai_engine.ledger_verifier import compute_entry_hash, verify_ledger_chain


class TestLedgerVerifier(unittest.TestCase):
    def test_valid_chain_passes(self):
        h1 = compute_entry_hash("0" * 64, "2026-11-12T10:00:00Z", "admin", "LOGIN")
        h2 = compute_entry_hash(h1, "2026-11-12T10:05:00Z", "admin", "APPEND_ACTION")
        chain = [
            {"timestamp": "2026-11-12T10:00:00Z", "actor": "admin", "action": "LOGIN", "hash": h1},
            {"timestamp": "2026-11-12T10:05:00Z", "actor": "admin", "action": "APPEND_ACTION", "hash": h2}
        ]
        res = verify_ledger_chain(chain)
        self.assertTrue(res["valid"])
        self.assertEqual(res["verified_count"], 2)

    def test_tampered_chain_detected(self):
        h1 = compute_entry_hash("0" * 64, "2026-11-12T10:00:00Z", "admin", "LOGIN")
        chain = [
            {"timestamp": "2026-11-12T10:00:00Z", "actor": "admin", "action": "DELETE_LOG", "hash": h1}
        ]
        res = verify_ledger_chain(chain)
        self.assertFalse(res["valid"])
        self.assertEqual(res["tampered_index"], 0)


if __name__ == "__main__":
    unittest.main()
