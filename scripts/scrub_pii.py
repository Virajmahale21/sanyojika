"""
AICTE Sanyojika - PII Masking and Data Scrubbing Utility
Redacts Aadhaar numbers, phone numbers, and email addresses from public records.
"""

import re

AADHAAR_REGEX = r"\b\d{4}\s?\d{4}\s?\d{4}\b"
PHONE_REGEX = r"\b(?:\+91[-.\s]?)?[6-9]\d{9}\b"
EMAIL_REGEX = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"

def scrub_text(text: str) -> str:
    s = re.sub(AADHAAR_REGEX, "[REDACTED-AADHAAR]", text)
    s = re.sub(PHONE_REGEX, "[REDACTED-PHONE]", s)
    s = re.sub(EMAIL_REGEX, "[REDACTED-EMAIL]", s)
    return s

if __name__ == "__main__":
    sample = "Student phone +91 9876543210 and Aadhaar 1234 5678 9012 submitted."
    print("Cleaned:", scrub_text(sample))
