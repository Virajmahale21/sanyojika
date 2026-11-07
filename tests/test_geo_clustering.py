"""
Unit tests for Geospatial Grievance Clustering.
"""

import unittest
from ai_engine.geo_clustering import cluster_grievances_by_state

class TestGeoClustering(unittest.TestCase):
    def test_state_aggregation(self):
        records = [
            {"pid": "1", "state": "MAHARASHTRA"},
            {"pid": "2", "state": "Maharashtra"},
            {"pid": "3", "state": "DELHI"}
        ]
        res = cluster_grievances_by_state(records)
        self.assertEqual(res["MAHARASHTRA"], 2)
        self.assertEqual(res["DELHI"], 1)

if __name__ == "__main__":
    unittest.main()
