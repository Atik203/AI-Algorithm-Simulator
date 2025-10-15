"""
ASGI config for ai_simulator_project project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ai_simulator_project.settings")

application = get_asgi_application()
