"""
AnumatiSetu — Automated Python Test Suite Runner
Discovers and executes all unit tests under tests/ directory,
aggregating test results and reporting code execution health.
"""

import unittest
import sys
import os
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')


def run_tests():
    start_time = time.time()
    test_loader = unittest.TestLoader()
    test_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'tests'))
    
    suite = test_loader.discover(start_dir=test_dir, pattern='test_*.py')
    runner = unittest.TextTestRunner(verbosity=2)
    
    print("====================================================")
    print("   AnumatiSetu Python AI Engine — Test Runner      ")
    print("====================================================\n")
    
    result = runner.run(suite)
    elapsed = time.time() - start_time
    
    print("\n----------------------------------------------------")
    print(f"Tests Executed: {result.testsRun}")
    print(f"Failures:       {len(result.failures)}")
    print(f"Errors:         {len(result.errors)}")
    print(f"Execution Time: {elapsed:.3f} seconds")
    print("----------------------------------------------------")
    
    if result.wasSuccessful():
        print("✔ ALL UNIT TESTS PASSED SUCCESSFULLY.")
        sys.exit(0)
    else:
        print("✖ UNIT TEST SUITE DETECTED FAILURES.")
        sys.exit(1)


if __name__ == "__main__":
    run_tests()
