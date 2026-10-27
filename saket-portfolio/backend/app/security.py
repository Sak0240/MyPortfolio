"""Per-IP rate limiting.

Best effort only: serverless instances are short-lived and not shared, so this is a speed bump,
not a guarantee. Also set a spending cap on the DeepSeek account.
"""

from __future__ import annotations

import time
from collections import defaultdict, deque


class RateLimiter:
    def __init__(self, limit: int, window_s: float = 60.0, max_keys: int = 500):
        self.limit = limit
        self.window_s = window_s
        self.max_keys = max_keys
        self._hits: dict[str, deque[float]] = defaultdict(deque)

    def allow(self, key: str, now: float | None = None) -> bool:
        now = time.monotonic() if now is None else now
        if len(self._hits) > self.max_keys:
            self._hits.clear()
        q = self._hits[key]
        while q and now - q[0] >= self.window_s:
            q.popleft()
        q.append(now)
        return len(q) <= self.limit
