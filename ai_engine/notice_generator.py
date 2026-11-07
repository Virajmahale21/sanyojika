"""
AICTE Sanyojika - Statutory Show-Cause Notice Automated Draft Generator
Generates standard legal notice templates citing AICTE Approval Handbook sections.
"""

from typing import Dict, Any

def generate_show_cause_notice(
    institution_name: str,
    pid: str,
    violation_clause: str,
    response_deadline_days: int = 14
) -> Dict[str, Any]:
    notice_text = (
        f"OFFICIAL SHOW-CAUSE NOTICE\n"
        f"All India Council for Technical Education (AICTE)\n"
        f"To: The Chairman / Principal, {institution_name} (AICTE PID: {pid})\n\n"
        f"Subject: Notice under Clause 4.2 of AICTE Regulations regarding {violation_clause}.\n\n"
        f"You are hereby directed to submit a written explanation within {response_deadline_days} days "
        f"from the receipt of this notice, failing which regulatory action including withdrawal of approval "
        f"shall be initiated under the AICTE Act."
    )
    return {
        "institution_name": institution_name,
        "pid": pid,
        "notice_body": notice_text,
        "response_deadline_days": response_deadline_days
    }
