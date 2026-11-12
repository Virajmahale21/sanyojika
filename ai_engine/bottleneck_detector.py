"""
AICTE Sanyojika - Regional Bureau Bottleneck & Backlog Detector
Identifies bureaus experiencing queuing delays exceeding statutory disposal capacity.
"""

from typing import Dict, List, Any


def analyze_bureau_bottlenecks(
    bureau_queues: List[Dict[str, Any]],
    capacity_ratio_threshold: float = 1.25
) -> List[Dict[str, Any]]:
    bottlenecks = []
    for entry in bureau_queues:
        bureau = entry["bureau"]
        pending = entry["pending_cases"]
        weekly_capacity = max(1, entry["weekly_disposal_capacity"])
        load_index = round(pending / (weekly_capacity * 2.0), 2)  # 2-week baseline target

        if load_index >= capacity_ratio_threshold:
            bottlenecks.append({
                "bureau": bureau,
                "pending_cases": pending,
                "load_index": load_index,
                "status": "BOTTLENECK_ALERT",
                "recommended_action": "Allocate temporary scrutiny taskforce"
            })
    return bottlenecks
