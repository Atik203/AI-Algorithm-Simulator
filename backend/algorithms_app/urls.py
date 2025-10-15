from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    SimulationViewSet,
    get_current_user,
    register_user,
    run_algorithm,
    get_algorithms,
)

router = DefaultRouter()
router.register(r"simulations", SimulationViewSet, basename="simulation")

urlpatterns = [
    path("auth/register/", register_user, name="register"),
    path("auth/me/", get_current_user, name="current-user"),
    path("run-algorithm/", run_algorithm, name="run-algorithm"),
    path("algorithms/", get_algorithms, name="algorithms"),
] + router.urls
