"""
Unit tests for DocumentOcrProcessor module.
Verifies certificate regex extraction, date formatting,
issuing authority recognition, and confidence scoring.
"""

import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ai_engine.ocr_processor import DocumentOcrProcessor


class TestDocumentOcrProcessor(unittest.TestCase):
    def setUp(self):
        self.processor = DocumentOcrProcessor()

    def test_extract_full_fire_noc_metadata(self):
        """Standard Fire NOC format should extract certificate number, validity and authority."""
        raw_text = """
        GOVERNMENT OF MAHARASHTRA
        DIRECTORATE OF FIRE SERVICES
        NOC No.: MH/FIRE/2026/PUNE-1042
        This is to certify that ABC College of Engineering has fulfilled all mandatory fire safety criteria.
        Valid upto: 31/03/2028
        Issuing Authority: Chief Fire Officer, Municipal Corporation of Greater Pune
        """
        res = self.processor.process_document_text(raw_text, "FIRE_NOC")
        self.assertEqual(res["certificateNumber"], "MH/FIRE/2026/PUNE-1042")
        self.assertEqual(res["validityDate"], "31/03/2028")
        self.assertIn("Chief Fire Officer", res["issuingAuthority"])
        self.assertEqual(res["verificationStatus"], "VERIFIED")
        self.assertEqual(res["confidenceScore"], 100.0)

    def test_extract_building_approval_certificate(self):
        """Building approval format with Dispatch No and written date format."""
        raw_text = """
        TOWN PLANNING AND VALUATION DEPARTMENT
        Dispatch No.: TP/BLDG/2026/AP-88
        Approval granted for Institutional Complex Phase II.
        Validity: 15th December 2029
        Issuing Authority: Competent Authority, Town Planning Department
        """
        res = self.processor.process_document_text(raw_text, "BUILDING_APPROVAL")
        self.assertEqual(res["certificateNumber"], "TP/BLDG/2026/AP-88")
        self.assertIn("15th December 2029", res["validityDate"])
        self.assertEqual(res["verificationStatus"], "VERIFIED")

    def test_incomplete_document_requires_manual_review(self):
        """Unreadable or truncated text missing fields should trigger manual review."""
        poor_text = "Illegible scanned document. Scrutiny required."
        res = self.processor.process_document_text(poor_text, "LAND_TITLE")
        self.assertEqual(res["certificateNumber"], "NOT_DETECTED")
        self.assertEqual(res["verificationStatus"], "REQUIRES_MANUAL_REVIEW")
        self.assertLess(res["confidenceScore"], 50.0)


if __name__ == "__main__":
    unittest.main()
