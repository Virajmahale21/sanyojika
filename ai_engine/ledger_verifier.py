"""
AICTE Sanyojika - Cryptographic Audit Ledger Hash-Chain Verifier
Verifies tamper-evidence across sequential audit log entries using SHA-256 links.
"""

import hashlib
from typing import List, Dict, Any


def compute_entry_hash(prev_hash: str, timestamp: str, actor: str, action: str) -> str:
    payload = f"{prev_hash}|{timestamp}|{actor}|{action}".encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def verify_ledger_chain(entries: List[Dict[str, str]]) -> Dict[str, Any]:
    prev_hash = "0" * 64
    for idx, entry in enumerate(entries):
        expected = compute_entry_hash(
            prev_hash,
            entry["timestamp"],
            entry["actor"],
            entry["action"]
        )
        if entry.get("hash") != expected:
            return {
                "valid": False,
                "tampered_index": idx,
                "expected_hash": expected,
                "found_hash": entry.get("hash")
            }
        prev_hash = expected

    return {"valid": True, "verified_count": len(entries), "head_hash": prev_hash}
