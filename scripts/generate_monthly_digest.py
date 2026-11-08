"""
AICTE Sanyojika - Executive Monthly Grievance Digest Generator
Produces consolidated performance statistics across all regional bureaus.
"""

from typing import List, Dict, Any

def generate_monthly_digest(
    total_received: int,
    total_resolved: int,
    overlaps_flagged: int,
    mandates_formed: int
) -> Dict[str, Any]:
    disposal_rate = round((total_resolved / max(1, total_received)) * 100, 1)
    
    summary = (
        f"=== AICTE SANTOJIKA MONTHLY EXECUTIVE DIGEST ===\n"
        f"Grievances Ingested : {total_received}\n"
        f"Grievances Resolved : {total_resolved}\n"
        f"Disposal Efficiency : {disposal_rate}%\n"
        f"Cross-Bureau Overlaps Flagged : {overlaps_flagged}\n"
        f"Joint Mandates Orchestrated   : {mandates_formed}\n"
    )
    return {
        "disposal_rate_percent": disposal_rate,
        "overlaps_flagged": overlaps_flagged,
        "summary_text": summary
    }

if __name__ == "__main__":
    report = generate_monthly_digest(total_received=220, total_resolved=185, overlaps_flagged=68, mandates_formed=4)
    print(report["summary_text"])
