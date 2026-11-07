"""
AICTE Sanyojika - Master Test Suite Runner
Discovers and executes all unit, integration, and security tests.
"""

import unittest
import sys

def run_full_suite() -> bool:
    loader = unittest.TestLoader()
    suite = loader.discover("tests", pattern="test_*.py")
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    return result.wasSuccessful()

if __name__ == "__main__":
    success = run_full_suite()
    sys.exit(0 if success else 1)
