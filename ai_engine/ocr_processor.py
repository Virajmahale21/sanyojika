"""
AnumatiSetu AI Engine — Document OCR & Metadata Verification Pipeline
AICTE APH 2026-27 Automated Regulatory Compliance Pipeline

Extracts statutory certificate numbers, issuing authorities, and validity dates
from uploaded PDF/Image documents (Fire NOC, Building Plan, Land Ownership).
"""

import re
from typing import Dict, Any, Optional
from datetime import datetime


class DocumentOcrProcessor:
    """
    Extracts structured regulatory metadata from certificate text streams.
    """

    PATTERNS = {
        "certificate_number": [
            r"(?:NOC\s*No\.?|Certificate\s*No\.?|Ref\s*No\.?)\s*[:\-]?\s*([A-Z0-9/\-_]{6,30})",
            r"(?:Dispatch\s*No\.?|File\s*No\.?)\s*[:\-]?\s*([A-Z0-9/\-_]{6,30})",
        ],
        "validity_date": [
            r"(?:Valid\s*upto|Valid\s*until|Expiry\s*Date|Validity)\s*[:\-]?\s*(\d{1,2}[./\-]\d{1,2}[./\-]\d{2,4})",
            r"(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})",
        ],
        "issuing_authority": [
            r"((?:Chief\s+Fire\s+Officer|Municipal\s+Corporation|Town\s+Planning\s+Authority|Directorate\s+of\s+Fire\s+Services)[^,\n]+)",
            r"((?:Public\s+Works\s+Department|Competent\s+Authority|District\s+Collector)[^,\n]+)",
        ]
    }

    def process_document_text(self, document_text: str, document_type: str) -> Dict[str, Any]:
        """
        Parses raw text extracted from uploaded certificate to extract metadata.
        """
        extracted_cert_no: Optional[str] = None
        extracted_validity: Optional[str] = None
        extracted_authority: Optional[str] = None

        # 1. Match Certificate Number
        for pattern in self.PATTERNS["certificate_number"]:
            match = re.search(pattern, document_text, re.IGNORECASE)
            if match:
                extracted_cert_no = match.group(1).strip()
                break

        # 2. Match Validity Date
        for pattern in self.PATTERNS["validity_date"]:
            match = re.search(pattern, document_text, re.IGNORECASE)
            if match:
                extracted_validity = match.group(1).strip()
                break

        # 3. Match Issuing Authority
        for pattern in self.PATTERNS["issuing_authority"]:
            match = re.search(pattern, document_text, re.IGNORECASE)
            if match:
                extracted_authority = match.group(1).strip()
                break

        # Confidence heuristic
        matched_fields = sum(1 for f in [extracted_cert_no, extracted_validity, extracted_authority] if f is not None)
        confidence_score = round((matched_fields / 3.0) * 100, 1)

        is_verified = confidence_score >= 66.0

        return {
            "documentType": document_type,
            "certificateNumber": extracted_cert_no or "NOT_DETECTED",
            "validityDate": extracted_validity or "NOT_SPECIFIED",
            "issuingAuthority": extracted_authority or "COMPETENT_STATUTORY_AUTHORITY",
            "confidenceScore": confidence_score,
            "verificationStatus": "VERIFIED" if is_verified else "REQUIRES_MANUAL_REVIEW",
            "processedAt": datetime.utcnow().isoformat() + "Z"
        }
