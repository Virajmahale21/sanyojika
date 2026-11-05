"""
AnumatiSetu — National Institutional Permission, Approval & Compliance Platform
AICTE APH 2026-27 Automated Regulatory Compliance Pipeline (SIH 2026 PS-262)

Primary Python Entrypoint:
- Semantic Overlap & Duplicate Complaint Detection
- Deterministic Delay Risk & SLA Breach Predictive Modeling
- Document OCR & Statutory Metadata Verification
"""

import sys
import os

# Add root directory to module search path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ai_engine.overlap_detector import OverlapDetector
from ai_engine.risk_model import DelayRiskPredictor
from ai_engine.ocr_processor import DocumentOcrProcessor
from ai_engine.main import run_self_test


def main():
    print("================================================================")
    print("   AnumatiSetu — Regulatory AI & Machine Learning Pipeline      ")
    print("   SIH 2026 Problem Statement PS-262 | AICTE APH 2026-27        ")
    print("================================================================\n")
    run_self_test()


if __name__ == "__main__":
    main()
