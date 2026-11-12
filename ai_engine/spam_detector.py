"""
AICTE Sanyojika - Duplicate Petitioner & Coordinated Spam Filing Detector
Prevents flood attacks of identical boilerplate grievances targeting the same PID.
"""

from typing import List, Dict, Any
from ai_engine.nlp_embeddings import evaluate_complaint_overlap


def detect_coordinated_burst(
    new_narrative: str,
    recent_narratives: List[str],
    similarity_threshold: float = 0.85,
    burst_count_limit: int = 3
) -> Dict[str, Any]:
    near_duplicates = 0
    max_sim = 0.0

    for existing in recent_narratives:
        score, _ = evaluate_complaint_overlap(new_narrative, existing)
        if score > max_sim:
            max_sim = score
        if score >= similarity_threshold:
            near_duplicates += 1

    is_burst = near_duplicates >= burst_count_limit
    return {
        "is_coordinated_burst": is_burst,
        "near_duplicate_count": near_duplicates,
        "max_similarity_observed": round(max_sim, 4),
        "action": "MERGE_UNDER_SINGLE_DOSSIER" if is_burst else "ACCEPT_INDIVIDUAL"
    }
