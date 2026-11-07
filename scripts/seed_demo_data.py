"""
AICTE Sanyojika - Synthetic Data Seed Utility
Generates verified dummy records for SIH evaluation benchmarking.
"""

import json

DEMO_INSTITUTIONS = [
    {"pid": "1-1049281", "name": "Delhi Institute of Technology & Management", "region": "North", "risk": "CRITICAL"},
    {"pid": "1-2094812", "name": "Maharashtra College of Engineering & Research", "region": "West", "risk": "ELEVATED"},
    {"pid": "1-3948102", "name": "Karnataka Academy of Advanced Sciences", "region": "South", "risk": "LOW"},
    {"pid": "1-4829104", "name": "Kolkata Polytechnic Institute", "region": "East", "risk": "HIGH"}
]

def generate_seed_json() -> str:
    return json.dumps(DEMO_INSTITUTIONS, indent=2)

if __name__ == "__main__":
    print(generate_seed_json())
