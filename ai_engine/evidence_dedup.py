"""
AICTE Sanyojika - Perceptual Document Hash & Evidence Deduplication
Flags duplicated PDF and image receipts uploaded across multiple grievance tickets.
"""

import hashlib
from typing import Dict, Any

def compute_evidence_fingerprint(file_bytes: bytes, file_name: str) -> Dict[str, Any]:
    sha256_hash = hashlib.sha256(file_bytes).hexdigest()
    md5_hash = hashlib.md5(file_bytes).hexdigest()
    byte_size = len(file_bytes)
    
    return {
        "file_name": file_name,
        "sha256": sha256_hash,
        "md5": md5_hash,
        "byte_size": byte_size,
        "fingerprint": f"{sha256_hash[:16]}-{byte_size}"
    }
