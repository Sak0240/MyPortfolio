"""Runtime settings, read from environment variables (set them in the Vercel dashboard)."""

from __future__ import annotations

import os
import re
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
KNOWLEDGE_FILE = BACKEND_DIR / "data" / "knowledge.json"

DEFAULT_ORIGINS = (
    "https://my-portfolio-fawn-kappa-86.vercel.app",
    "https://sak0240.github.io",
)
# any local dev port (Vite moves to 5174+ when 5173 is busy)
LOCAL_ORIGIN = re.compile(r"^http://(?:localhost|127\.0\.0\.1):\d{2,5}$")


def _csv(value: str) -> tuple[str, ...]:
    return tuple(s.strip() for s in value.split(",") if s.strip())


@dataclass(frozen=True)
class Settings:
    deepseek_api_key: str = ""
    deepseek_model: str = "deepseek-chat"
    deepseek_url: str = "https://api.deepseek.com/chat/completions"
    allowed_origins: tuple[str, ...] = field(default_factory=lambda: DEFAULT_ORIGINS)
    rate_limit_per_minute: int = 10
    top_k: int = 6
    max_tokens: int = 600
    llm_timeout_s: float = 20.0
    database_url: str = ""  # optional: Postgres for question analytics; otherwise events go to the logs

    def origin_allowed(self, origin: str) -> bool:
        return origin in self.allowed_origins or bool(LOCAL_ORIGIN.match(origin))


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    env = os.environ
    return Settings(
        deepseek_api_key=env.get("DEEPSEEK_API_KEY", ""),
        deepseek_model=env.get("DEEPSEEK_MODEL", "deepseek-chat"),
        allowed_origins=DEFAULT_ORIGINS + _csv(env.get("ALLOWED_ORIGINS", "")),
        rate_limit_per_minute=int(env.get("RATE_LIMIT_PER_MINUTE", "10")),
        database_url=env.get("DATABASE_URL", ""),
    )
