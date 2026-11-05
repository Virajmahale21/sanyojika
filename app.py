"""
AnumatiSetu — Python AI Microservice Server
Exposes HTTP endpoints for regulatory AI inference, risk evaluation,
overlap detection, and OCR extraction.
"""

import sys
import os
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

# Add root directory to module search path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ai_engine.risk_model import DelayRiskPredictor
from ai_engine.overlap_detector import OverlapDetector
from ai_engine.ocr_processor import DocumentOcrProcessor

risk_predictor = DelayRiskPredictor()
overlap_detector = OverlapDetector()
ocr_processor = DocumentOcrProcessor()


class AIRequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/health" or parsed.path == "/":
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "status": "HEALTHY",
                "service": "AnumatiSetu Python AI Regulatory Service",
                "version": "1.0.0",
                "modules": ["DelayRiskPredictor", "OverlapDetector", "DocumentOcrProcessor"]
            }).encode("utf-8"))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))

    def do_POST(self):
        parsed = urlparse(self.path)
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8")
        data = json.loads(body) if body else {}

        if parsed.path == "/predict-risk":
            result = risk_predictor.evaluate_risk(data)
            self._set_headers(200)
            self.wfile.write(json.dumps(result).encode("utf-8"))
        elif parsed.path == "/detect-overlap":
            current_case = data.get("currentCase", {})
            history = data.get("historicalCases", [])
            result = overlap_detector.analyze_cross_bureau_overlap(current_case, history)
            self._set_headers(200)
            self.wfile.write(json.dumps({"overlaps": result}).encode("utf-8"))
        elif parsed.path == "/verify-ocr":
            text = data.get("text", "")
            doc_type = data.get("documentType", "GENERAL_CERTIFICATE")
            result = ocr_processor.process_document_text(text, doc_type)
            self._set_headers(200)
            self.wfile.write(json.dumps(result).encode("utf-8"))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Unknown POST route"}).encode("utf-8"))


def run(port=8000):
    server_address = ("", port)
    httpd = HTTPServer(server_address, AIRequestHandler)
    print(f"AnumatiSetu Python AI Microservice running on http://localhost:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run(port)
