"""
AICTE Sanyojika - Microservice Latency & Compute Profiler
Measures execution time across AI algorithms to ensure sub-100ms response targets.
"""

import time
from typing import Dict, Any
from ai_engine.nlp_embeddings import evaluate_complaint_overlap
from ai_engine.compliance_score import compute_institutional_risk

def profile_core_algorithms() -> Dict[str, Any]:
    # 1. Profile NLP Overlap
    start = time.time()
    for _ in range(50):
        _ = evaluate_complaint_overlap(
            "College demands unauthorized capitation fee in cash for admission.",
            "Admission cell asking for unrecorded cash donation without receipt."
        )
    nlp_time_ms = round(((time.time() - start) / 50) * 1000, 3)
    
    # 2. Profile Risk Scoring
    start = time.time()
    for _ in range(100):
        _ = compute_institutional_risk(25, 12, 3, 2, True, 1)
    risk_time_ms = round(((time.time() - start) / 100) * 1000, 3)
    
    return {
        "nlp_overlap_avg_latency_ms": nlp_time_ms,
        "risk_scoring_avg_latency_ms": risk_time_ms,
        "meets_sub_100ms_sla": nlp_time_ms < 100.0 and risk_time_ms < 100.0
    }

if __name__ == "__main__":
    results = profile_core_algorithms()
    print("Latency Profile:", results)
