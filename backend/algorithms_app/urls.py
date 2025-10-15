from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    SimulationViewSet,
    dashboard_stats,
    get_algorithms,
    get_current_user,
    get_simulation_types,
    play_game,
    register_user,
    run_algorithm,
    solve_puzzle,
)

router = DefaultRouter()
router.register(r"simulations", SimulationViewSet, basename="simulation")

urlpatterns = [
    path("auth/register/", register_user, name="register"),
    path("auth/me/", get_current_user, name="current-user"),
    path("run-algorithm/", run_algorithm, name="run-algorithm"),
    path("algorithms/", get_algorithms, name="algorithms"),
    path("simulation-types/", get_simulation_types, name="simulation-types"),
    path("solve-puzzle/", solve_puzzle, name="solve-puzzle"),
    path("play-game/", play_game, name="play-game"),
    path("dashboard/stats/", dashboard_stats, name="dashboard-stats"),
] + router.urls
