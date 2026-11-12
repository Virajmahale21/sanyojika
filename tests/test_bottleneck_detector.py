"""
Unit tests for Regional Bureau Bottleneck Detector.
"""

import unittest
from ai_engine.bottleneck_detector import analyze_bureau_bottlenecks


class TestBottleneckDetector(unittest.TestCase):
    def test_detects_overloaded_bureau(self):
        queues = [
            {"bureau": "RB-NORTH", "pending_cases": 90, "weekly_disposal_capacity": 20},
            {"bureau": "RB-SOUTH", "pending_cases": 15, "weekly_disposal_capacity": 20}
        ]
        alerts = analyze_bureau_bottlenecks(queues)
        self.assertEqual(len(alerts), 1)
        self.assertEqual(alerts[0]["bureau"], "RB-NORTH")
        self.assertEqual(alerts[0]["status"], "BOTTLENECK_ALERT")


if __name__ == "__main__":
    unittest.main()
