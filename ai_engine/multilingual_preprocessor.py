"""
AICTE Sanyojika - Multilingual Grievance Text Normalizer
Normalizes Hindi (Devanagari) and transliterated Roman script into normalized keywords.
"""

import re
from typing import Dict, List

HINDI_KEYWORD_MAP = {
    "फीस": "fee",
    "रिश्वत": "bribe",
    "रैगिंग": "ragging",
    "वेतन": "salary",
    "अवैध": "illegal",
    "शोषण": "harassment",
    "प्रमाणपत्र": "certificate"
}

def normalize_multilingual_text(text: str) -> str:
    normalized = text
    for hindi_term, english_eq in HINDI_KEYWORD_MAP.items():
        normalized = normalized.replace(hindi_term, english_eq)
    return normalized
