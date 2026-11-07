"""
AICTE Sanyojika - Whistleblower Identity Protection & Privacy Filter
Detects unintentional disclosures of student identity in narrative text.
"""

from typing import Dict, Any
import re

STUDENT_ID_PATTERNS = [
    r"\broll\s*(?:no|number)?[:\s]*[A-Za-z0-9-]+\b",
    r"\benrollment\s*(?:no|number)?[:\s]*[A-Za-z0-9-]+\b",
    r"\bPRN[:\s]*[0-9]+\b"
]

def sanitize_whistleblower_narrative(text: str) -> Dict[str, Any]:
    cleaned = text
    detected_leaks = 0
    for pattern in STUDENT_ID_PATTERNS:
        matches = re.findall(pattern, cleaned, flags=re.IGNORECASE)
        if matches:
            detected_leaks += len(matches)
            cleaned = re.sub(pattern, "[PROTECTED_STUDENT_ID]", cleaned, flags=re.IGNORECASE)
            
    return {
        "sanitized_narrative": cleaned,
        "identity_leaks_prevented": detected_leaks,
        "is_safe_for_cross_bureau_dispatch": detected_leaks > 0
    }
