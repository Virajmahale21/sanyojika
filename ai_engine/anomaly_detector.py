"""
AICTE Sanyojika - Multi-Signal Institutional Anomaly Detector
Detects statistical outliers in grievance filing velocities and intake spikes.
"""

from typing import Dict, List, Any
import math

def calculate_anomaly_score(daily_counts: List[int], threshold_z: float = 2.5) -> Dict[str, Any]:
    if not daily_counts:
        return {"anomaly_detected": False, "z_score": 0.0, "mean": 0.0, "std_dev": 0.0}
    
    n = len(daily_counts)
    mean = sum(daily_counts) / n
    variance = sum((x - mean) ** 2 for x in daily_counts) / max(1, n - 1)
    std_dev = math.sqrt(variance)
    
    latest = daily_counts[-1]
    if std_dev == 0:
        z_score = 0.0
    else:
        z_score = round((latest - mean) / std_dev, 2)
        
    return {
        "anomaly_detected": z_score >= threshold_z,
        "z_score": z_score,
        "mean": round(mean, 2),
        "std_dev": round(std_dev, 2),
        "latest_count": latest
    }
