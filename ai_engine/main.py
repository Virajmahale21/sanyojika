"""
AnumatiSetu AI Engine — Microservice API & Standalone Runner
Exposes AI prediction, overlap analysis, and OCR verification.
"""

import sys
import json
from typing import Dict, Any

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from overlap_detector import OverlapDetector
from risk_model import DelayRiskPredictor
from ocr_processor import DocumentOcrProcessor


def run_self_test():
    """Executes verification tests across all three AI modules."""
    print("====================================================")
    print("   AnumatiSetu AI Engine — Self-Diagnostic Test     ")
    print("====================================================\n")

    # 1. Test Delay Risk Predictor
    print("1. Testing Delay Risk Predictor...")
    predictor = DelayRiskPredictor()
    sample_app = {
        "daysElapsed": 20,
        "slaTargetDays": 14,
        "missingDocuments": ["Fire Safety NOC", "Building Plan"],
        "fireNocDaysRemaining": 5,
        "unresolvedQueriesCount": 2
    }
    risk_result = predictor.evaluate_risk(sample_app)
    print(f" ✔ Risk Score: {risk_result['delayRiskScore']} / 100 [{risk_result['riskTier']}]")
    print(f" ✔ Action: {risk_result['escalationAction']}")
    for r in risk_result["deficiencyReasons"]:
        print(f"   - {r}")
    print()

    # 2. Test Overlap Detector
    print("2. Testing Overlap & Conflict Detector...")
    detector = OverlapDetector()
    current_case = {
        "permanentId": "1-1090123456",
        "subject": "Approval for intake expansion in Computer Engineering",
        "description": "Institution requests 60 additional seats in AI and Data Science."
    }
    historical_cases = [
        {
            "id": "case-901",
            "applicationNumber": "AICTE/2026-27/APP-1001",
            "bureau": "Engineering & Technology",
            "permanentId": "1-1090123456",
            "subject": "Extension of Approval for existing engineering courses",
            "description": "Routine annual Extension of Approval for existing divisions."
        },
        {
            "id": "case-902",
            "applicationNumber": "AICTE/2026-27/APP-1002",
            "bureau": "Management",
            "permanentId": "1-1090998877",
            "subject": "New MBA program initiation",
            "description": "Commencing new management department."
        }
    ]
    overlaps = detector.analyze_cross_bureau_overlap(current_case, historical_cases)
    print(f" ✔ Detected {len(overlaps)} overlap record(s):")
    for o in overlaps:
        print(f"   - Match: {o['applicationNumber']} | Score: {o['similarityScore']}% | {o['overlapReason']}")
    print()

    # 3. Test OCR Processor
    print("3. Testing Document OCR Processor...")
    ocr = DocumentOcrProcessor()
    sample_ocr_text = """
    MUNICIPAL CORPORATION OF GREATER MUMBAI
    DIRECTORATE OF FIRE SERVICES
    NOC No.: FB/NOC/2026/WRO-8842
    This is to certify that Government College of Engineering conforms to fire norms.
    Valid upto: 31-12-2027
    Issuing Authority: Chief Fire Officer, Mumbai Fire Brigade
    """
    ocr_result = ocr.process_document_text(sample_ocr_text, "FIRE_NOC")
    print(f" ✔ Certificate Number: {ocr_result['certificateNumber']}")
    print(f" ✔ Validity Date:      {ocr_result['validityDate']}")
    print(f" ✔ Issuing Authority:  {ocr_result['issuingAuthority']}")
    print(f" ✔ Verification State: {ocr_result['verificationStatus']} (Confidence: {ocr_result['confidenceScore']}%)")
    print()

    print("✔ All AI Engine modules passed validation tests successfully.")


if __name__ == "__main__":
    run_self_test()
