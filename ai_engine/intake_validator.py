"""
AnumatiSetu AI Engine — Intake Capacity & Faculty Ratio Validator
AICTE APH 2026-27 Chapter II Regulatory Norms

Validates proposed student intake increases, division allocations,
and Student-to-Faculty Ratio (SFR) requirements before application submission.
"""

from typing import Dict, Any, List


class IntakeNormsValidator:
    """
    Validates academic intake proposals against statutory norms:
    - Under-Graduate Engineering: SFR 1:20 (Cadre ratio 1:2:6 for Prof:Assoc:Asst)
    - Post-Graduate Management (MBA): SFR 1:20 (Cadre ratio 1:2)
    - Post-Graduate MCA: SFR 1:20
    """

    STATUTORY_SFR = {
        "ENGINEERING_UG": 20,
        "ENGINEERING_PG": 15,
        "MANAGEMENT_MBA": 20,
        "COMPUTER_MCA": 20,
        "PHARMACY_UG": 15,
    }

    MAX_DIVISION_INTAKE = 60

    def validate_intake_proposal(
        self,
        program_type: str,
        current_intake: int,
        proposed_intake: int,
        faculty_count: int,
        professor_count: int,
        assoc_prof_count: int,
    ) -> Dict[str, Any]:
        """Validates intake expansion request against APH compliance rules."""
        violations: List[str] = []
        warnings: List[str] = []

        # 1. Division modulus check (multiples of 60 or 30)
        intake_delta = proposed_intake - current_intake
        if intake_delta > 0 and intake_delta % 30 != 0:
            violations.append(f"Proposed intake increase ({intake_delta}) must be in standard division units of 30 or 60 seats.")

        # 2. Maximum increase cap (max 2 divisions per academic cycle)
        if intake_delta > 120:
            violations.append(f"Intake increase ({intake_delta} seats) exceeds maximum permissible cap of 120 seats per cycle.")

        # 3. Student-to-Faculty Ratio (SFR) validation
        required_sfr = self.STATUTORY_SFR.get(program_type, 20)
        # Approximate 4-year cumulative strength for UG
        total_students = proposed_intake * (4 if "UG" in program_type else 2)
        min_required_faculty = total_students / float(required_sfr)

        if faculty_count < min_required_faculty:
            deficit = int(min_required_faculty - faculty_count)
            violations.append(
                f"Faculty strength deficit of {deficit} teachers for total student strength {total_students} (Required SFR 1:{required_sfr})."
            )

        # 4. Cadre ratio check (Professor / Associate Professor availability)
        if professor_count < 1 and total_students >= 240:
            violations.append("At least 1 regular Professor required for departments with total intake >= 240.")

        is_eligible = len(violations) == 0

        return {
            "isEligible": is_eligible,
            "programType": program_type,
            "currentIntake": current_intake,
            "proposedIntake": proposed_intake,
            "computedSfr": round(total_students / max(1, faculty_count), 1),
            "requiredSfr": f"1:{required_sfr}",
            "violations": violations,
            "status": "APPROVED_FOR_INTAKE_INCREASE" if is_eligible else "REJECTED_NORMS_DEFICIT"
        }
