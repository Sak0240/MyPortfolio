"""Vercel entry point: exposes the FastAPI app (see backend/app/main.py) as the /api function."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.app.main import app  # noqa: E402,F401
