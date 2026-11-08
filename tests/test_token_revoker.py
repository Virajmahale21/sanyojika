"""
Unit tests for Token Blacklist Manager.
"""

import unittest
import time
from ai_engine.token_revoker import TokenBlacklistManager

class TestTokenRevoker(unittest.TestCase):
    def test_revocation_lifecycle(self):
        mgr = TokenBlacklistManager()
        jti = "test-jti-session-8842"
        now = time.time()
        
        self.assertFalse(mgr.is_token_revoked(jti))
        mgr.revoke_token(jti, expires_at_timestamp=now + 60.0)
        self.assertTrue(mgr.is_token_revoked(jti))

    def test_expired_token_auto_purged(self):
        mgr = TokenBlacklistManager()
        jti = "expired-jti-001"
        mgr.revoke_token(jti, expires_at_timestamp=time.time() - 10.0)
        self.assertFalse(mgr.is_token_revoked(jti))

if __name__ == "__main__":
    unittest.main()
