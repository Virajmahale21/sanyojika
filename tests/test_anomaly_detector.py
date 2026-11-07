"""
Unit tests for Institutional Anomaly Detector.
"""

import unittest
from ai_engine.anomaly_detector import calculate_anomaly_score

class TestAnomalyDetector(unittest.TestCase):
    def test_normal_distribution_no_anomaly(self):
        data = [5, 4, 6, 5, 5, 4, 6]
        res = calculate_anomaly_score(data)
        self.assertFalse(res["anomaly_detected"])
        self.assertLess(res["z_score"], 2.5)

    def test_spike_triggers_anomaly(self):
        data = [3, 2, 4, 3, 3, 2, 35]
        res = calculate_anomaly_score(data)
        self.assertTrue(res["anomaly_detected"])
        self.assertGreater(res["z_score"], 2.5)

if __name__ == "__main__":
    unittest.main()
