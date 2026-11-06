"""
AnumatiSetu AI Engine — Command Line Interface (CLI)
Provides batch evaluation, synthetic testing, and individual application
auditing directly from the terminal.
"""

import sys
import os
import argparse
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ai_engine.risk_model import DelayRiskPredictor
from ai_engine.overlap_detector import OverlapDetector
from ai_engine.ocr_processor import DocumentOcrProcessor
from ai_engine.data_generator import generate_synthetic_applications


def main():
    parser = argparse.ArgumentParser(
        description="AnumatiSetu AI Regulatory Engine CLI — SIH 2026 PS-262"
    )
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # Command 1: risk
    risk_parser = subparsers.add_parser("risk", help="Evaluate delay risk for an application")
    risk_parser.add_argument("--days-elapsed", type=int, default=10, help="Days elapsed in current stage")
    risk_parser.add_argument("--sla-target", type=int, default=14, help="Statutory target SLA in days")
    risk_parser.add_argument("--missing-docs", nargs="*", default=[], help="List of missing document names")
    risk_parser.add_argument("--fire-noc-days", type=int, default=90, help="Days remaining on Fire Safety NOC")
    risk_parser.add_argument("--queries", type=int, default=0, help="Unresolved deficiency queries count")

    # Command 2: batch
    batch_parser = subparsers.add_parser("batch", help="Run batch evaluation on synthetic dataset")
    batch_parser.add_argument("--count", type=int, default=10, help="Number of synthetic applications to audit")
    batch_parser.add_argument("--output", type=str, default="", help="Optional JSON file to save report")

    # Command 3: ocr
    ocr_parser = subparsers.add_parser("ocr", help="Parse document text for statutory metadata")
    ocr_parser.add_argument("--text", type=str, required=True, help="Raw OCR text to inspect")
    ocr_parser.add_argument("--type", type=str, default="FIRE_NOC", help="Document type")

    args = parser.parse_args()

    if args.command == "risk":
        predictor = DelayRiskPredictor()
        payload = {
            "daysElapsed": args.days_elapsed,
            "slaTargetDays": args.sla_target,
            "missingDocuments": args.missing_docs,
            "fireNocDaysRemaining": args.fire_noc_days,
            "unresolvedQueriesCount": args.queries
        }
        res = predictor.evaluate_risk(payload)
        print(json.dumps(res, indent=2))

    elif args.command == "batch":
        predictor = DelayRiskPredictor()
        apps = generate_synthetic_applications(count=args.count)
        print(f"\nAuditing {len(apps)} applications across AICTE Bureaus...\n")

        results = []
        high_risk_count = 0
        for app in apps:
            res = predictor.evaluate_risk(app)
            if res["riskTier"] == "HIGH":
                high_risk_count += 1
            results.append({
                "applicationId": app["applicationId"],
                "institution": app["institutionName"],
                "score": res["delayRiskScore"],
                "tier": res["riskTier"],
                "escalation": res["escalationAction"],
            })
            print(f"[{res['riskTier']:4s}] {app['applicationId']} | {app['institutionName'][:40]:40s} | Score: {res['delayRiskScore']:3d}")

        print(f"\nAudit Complete: {high_risk_count}/{len(apps)} flagged for urgent SLA escalation.")

        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                json.dump(results, f, indent=2)
            print(f"Report saved to {args.output}")

    elif args.command == "ocr":
        processor = DocumentOcrProcessor()
        res = processor.process_document_text(args.text, args.type)
        print(json.dumps(res, indent=2))

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
