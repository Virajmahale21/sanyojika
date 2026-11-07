"""
AICTE Sanyojika - RFC 7807 Standard Error Formatting
Provides machine-readable error models across microservices.
"""

from typing import Dict, Any, Optional

def format_problem_detail(
    status: int,
    title: str,
    detail: str,
    instance: str,
    invalid_params: Optional[Dict[str, str]] = None
) -> Dict[str, Any]:
    problem = {
        "type": f"https://sanyojika.aicte.gov.in/errors/{status}",
        "title": title,
        "status": status,
        "detail": detail,
        "instance": instance
    }
    if invalid_params:
        problem["invalid_parameters"] = invalid_params
    return problem
