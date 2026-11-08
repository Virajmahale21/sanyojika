"""
Unit tests for Infrastructure Compliance Auditor.
"""

import unittest
from ai_engine.infrastructure_audit import audit_infrastructure

class TestInfrastructureAudit(unittest.TestCase):
    def test_fully_compliant_campus(self):
        res = audit_infrastructure(
            total_enrolled_students=200,
            classroom_area_sqm=300.0,
            lab_area_sqm=1000.0,
            admin_area_sqm=600.0,
            fire_safety_valid=True
        )
        self.assertTrue(res["compliant"])
        self.assertEqual(len(res["deficits"]), 0)

    def test_fire_safety_deficit(self):
        res = audit_infrastructure(
            total_enrolled_students=200,
            classroom_area_sqm=300.0,
            lab_area_sqm=1000.0,
            admin_area_sqm=600.0,
            fire_safety_valid=False
        )
        self.assertFalse(res["compliant"])
        self.assertIn("Fire Safety NOC is expired or unverified", res["deficits"])

if __name__ == "__main__":
    unittest.main()
