"""
AICTE Sanyojika - Synthetic Telemetry & Service Healthcheck
Validates uptime, HTTP latency, and response status across frontend, backend,
and AI microservices.
"""

import sys
import time
import urllib.request
import urllib.error
import json
from typing import Dict, Any

SERVICES = [
    {"name": "Frontend Portal (Vercel)", "url": "https://sih-264.vercel.app"},
    {"name": "Backend REST Gateway (Render)", "url": "https://sih264.onrender.com/api/complaints"},
    {"name": "Institutions Directory API", "url": "https://sih264.onrender.com/api/institutions"},
    {"name": "Overlap Collisions API", "url": "https://sih264.onrender.com/api/overlaps"},
    {"name": "Coordination Mandates API", "url": "https://sih264.onrender.com/api/coordination"},
    {"name": "Audit Logs API", "url": "https://sih264.onrender.com/api/audit-logs"}
]


def check_endpoint(name: str, url: str) -> Dict[str, Any]:
    start = time.time()
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Sanyojika-Synthetic-Monitor/2.4"}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            elapsed = round((time.time() - start) * 1000, 2)
            return {
                "service": name,
                "status": resp.status,
                "latency_ms": elapsed,
                "healthy": resp.status in (200, 201)
            }
    except urllib.error.HTTPError as e:
        elapsed = round((time.time() - start) * 1000, 2)
        return {
            "service": name,
            "status": e.code,
            "latency_ms": elapsed,
            "healthy": e.code in (200, 401)  # 401 indicates endpoint is alive but protected
        }
    except Exception as e:
        elapsed = round((time.time() - start) * 1000, 2)
        return {
            "service": name,
            "status": 0,
            "latency_ms": elapsed,
            "healthy": False,
            "error": str(e)
        }


def run_diagnostics():
    print("=" * 60)
    print(" AICTE Sanyojika - End-to-End Synthetic Healthcheck")
    print("=" * 60)
    all_healthy = True
    for svc in SERVICES:
        res = check_endpoint(svc["name"], svc["url"])
        status_flag = "PASS" if res["healthy"] else "FAIL"
        print(f"[{status_flag}] {res['service']:<35} | Status: {res['status']:<3} | Latency: {res['latency_ms']} ms")
        if not res["healthy"]:
            all_healthy = False
    print("=" * 60)
    return all_healthy


if __name__ == "__main__":
    success = run_diagnostics()
    sys.exit(0 if success else 1)
