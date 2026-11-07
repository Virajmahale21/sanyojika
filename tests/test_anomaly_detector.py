"""
Unit tests for Institutional Anomaly Detector.
"""

import unittest
from ai_engine.anomaly_detector import calculate_anomaly_score

class TestAnomalyDetector(unittest.TestCase):
    def test_normal_distribution_no_anomaly(self):
        data = [5, 4, 6, 5, 5, 4, 6]
        res = calculate_anomaly_score(data, threshold_z=2.0)
        self.assertFalse(res["anomaly_detected"])
        self.assertLess(res["z_score"], 2.0)

    def test_spike_triggers_anomaly(self):
        data = [3, 3, 3, 3, 3, 3, 3, 3, 35]
        res = calculate_anomaly_score(data, threshold_z=2.0)
        self.assertTrue(res["anomaly_detected"])
        self.assertGreater(res["z_score"], 2.0)

if __name__ == "__main__":
    unittest.main()
