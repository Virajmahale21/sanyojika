"""
AICTE Sanyojika - Regional Grievance Geospatial Clustering
Groups institutional complaints into geographic clusters to detect territorial hotspots.
"""

from typing import List, Dict, Any

REGIONS = {
    "NORTH": ["DELHI", "HARYANA", "PUNJAB", "UTTAR PRADESH", "RAJASTHAN"],
    "SOUTH": ["KARNATAKA", "TAMIL NADU", "KERALA", "TELANGANA", "ANDHRA PRADESH"],
    "WEST": ["MAHARASHTRA", "GUJARAT", "GOA", "MADHYA PRADESH"],
    "EAST": ["WEST BENGAL", "ODISHA", "BIHAR", "JHARKHAND", "ASSAM"]
}

def cluster_grievances_by_state(records: List[Dict[str, Any]]) -> Dict[str, int]:
    counts: Dict[str, int] = {}
    for r in records:
        state = r.get("state", "UNKNOWN").upper()
        counts[state] = counts.get(state, 0) + 1
    return counts
