"""
AnumatiSetu AI Engine — Synthetic Dataset Generator
Generates realistic regulatory application dossiers and grievance complaints
for benchmarking delay risk scoring, overlap detection, and SLA breach models.
"""

import random
import json
from typing import List, Dict, Any


INSTITUTION_NAMES = [
    ("Government College of Engineering and Technology (GCET)", "1-1090123456", "Mumbai", "Western"),
    ("COEP Technological University", "1-1090654321", "Pune", "Western"),
    ("Jamnalal Bajaj Institute of Management Studies (JBIMS)", "1-1090998877", "Mumbai", "Western"),
    ("National Institute of Industrial Engineering (NITIE)", "1-1090334455", "Mumbai", "Western"),
    ("Walchand College of Engineering", "1-1090776655", "Sangli", "Western"),
    ("Delhi Technological University (DTU)", "1-2090112233", "New Delhi", "Northern"),
    ("Harcourt Butler Technical University (HBTU)", "1-2090445566", "Kanpur", "Northern"),
    ("College of Engineering Guindy (CEG)", "1-3090778899", "Chennai", "Southern"),
]

COURSE_PROGRAMS = [
    "Computer Science and Engineering",
    "Artificial Intelligence and Data Science",
    "Cyber Security",
    "Electronics and Communication Engineering",
    "Mechanical Engineering",
    "Master of Business Administration (MBA)",
    "Master of Computer Applications (MCA)",
]

DEFICIENCIES_POOL = [
    "Structural Stability Certificate clarification unaddressed",
    "Fire Safety NOC approaching validity expiration",
    "Cadre ratio deficit in Professor / Associate Professor ranks",
    "Laboratory carpet area shortfall in AI Division",
    "Land Title mutation deed clarification pending",
    "Barrier-free built environment audit report overdue",
]


def generate_synthetic_applications(count: int = 50, seed: int = 42) -> List[Dict[str, Any]]:
    """Generates synthetic application records with deterministic seed for benchmarks."""
    random.seed(seed)
    applications: List[Dict[str, Any]] = []

    for i in range(1, count + 1):
        inst_name, pid, city, region = random.choice(INSTITUTION_NAMES)
        program = random.choice(COURSE_PROGRAMS)
        sla_target = 14
        days_elapsed = random.randint(3, 26)

        num_deficiencies = random.choices([0, 1, 2, 3], weights=[0.4, 0.3, 0.2, 0.1])[0]
        selected_deficiencies = random.sample(DEFICIENCIES_POOL, num_deficiencies)

        fire_noc_days = random.randint(-5, 120)
        missing_docs = []
        if fire_noc_days < 0 or random.random() < 0.2:
            missing_docs.append("Fire Safety NOC")
        if random.random() < 0.15:
            missing_docs.append("Building Plan Approval")

        app = {
            "applicationId": f"APP-2026-{1000 + i}",
            "institutionName": inst_name,
            "permanentId": pid,
            "city": city,
            "regionalOffice": region,
            "program": program,
            "daysElapsed": days_elapsed,
            "slaTargetDays": sla_target,
            "missingDocuments": missing_docs,
            "fireNocDaysRemaining": fire_noc_days,
            "unresolvedQueriesCount": num_deficiencies,
            "deficiencies": selected_deficiencies,
            "intakeRequested": random.choice([60, 120, 180]),
        }
        applications.append(app)

    return applications


if __name__ == "__main__":
    dataset = generate_synthetic_applications(10)
    print(json.dumps(dataset[:2], indent=2))
    print(f"\n✔ Successfully generated {len(dataset)} synthetic benchmarking records.")
