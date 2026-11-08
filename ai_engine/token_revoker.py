"""
AICTE Sanyojika - JWT Token Revocation & JTI Blacklist Manager
Ensures instant session invalidation upon officer logout or role transfer.
"""

import time
from typing import Set, Dict

class TokenBlacklistManager:
    def __init__(self):
        self._blacklisted_jtis: Dict[str, float] = {}

    def revoke_token(self, jti: str, expires_at_timestamp: float) -> None:
        self._blacklisted_jtis[jti] = expires_at_timestamp

    def is_token_revoked(self, jti: str) -> bool:
        if jti not in self._blacklisted_jtis:
            return False
        exp = self._blacklisted_jtis[jti]
        if time.time() > exp:
            del self._blacklisted_jtis[jti]
            return False
        return True

    def purge_expired(self) -> int:
        now = time.time()
        expired = [jti for jti, exp in self._blacklisted_jtis.items() if now > exp]
        for jti in expired:
            del self._blacklisted_jtis[jti]
        return len(expired)
