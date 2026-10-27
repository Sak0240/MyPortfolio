from backend.app.config import Settings
from backend.app.security import RateLimiter


def test_rate_limiter_allows_up_to_the_limit_then_blocks_until_the_window_passes():
    rl = RateLimiter(limit=2, window_s=60)
    assert rl.allow("a", now=0)
    assert rl.allow("a", now=1)
    assert not rl.allow("a", now=2)
    assert rl.allow("b", now=2)  # separate visitor
    assert rl.allow("a", now=62)  # window slid past the first hits


def test_origin_rules():
    s = Settings(allowed_origins=("https://example.com",))
    assert s.origin_allowed("https://example.com")
    assert s.origin_allowed("http://localhost:5173")
    assert s.origin_allowed("http://127.0.0.1:8000")
    assert not s.origin_allowed("https://example.com.evil.io")
    assert not s.origin_allowed("http://localhost")  # needs a port
    assert not s.origin_allowed("https://localhost:5173")
    assert not s.origin_allowed("")
