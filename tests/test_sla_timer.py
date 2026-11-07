"""
Unit tests for SLA Deadline & Escalation Timer.
"""

import unittest
from datetime import datetime, timedelta, timezone
from ai_engine.sla_timer import compute_sla_status

class TestSLATimer(unittest.TestCase):
    def test_on_track_sla(self):
        recent = datetime.now(timezone.utc) - timedelta(days=5)
        res = compute_sla_status(recent.isoformat(), sla_days=30)
        self.assertEqual(res["status"], "ON_TRACK")
        self.assertEqual(res["escalation_tier"], "NORMAL")

    def test_breached_sla(self):
        old = datetime.now(timezone.utc) - timedelta(days=45)
        res = compute_sla_status(old.isoformat(), sla_days=30)
        self.assertEqual(res["status"], "BREACHED")
        self.assertEqual(res["escalation_tier"], "LEVEL_3_CVO")

if __name__ == "__main__":
    unittest.main()
