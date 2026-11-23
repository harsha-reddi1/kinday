import os
import sys

# Ensure current api directory is first in python path
current_dir = os.path.dirname(__file__)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from app.main import app

# Export app instance for Vercel Serverless
__all__ = ["app"]
