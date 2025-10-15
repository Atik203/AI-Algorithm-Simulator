import time

from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Avg, Count
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .algorithms import AlgorithmRunner
from .models import Simulation
from .serializers import (
    AlgorithmExecutionSerializer,
    RegisterSerializer,
    SimulationSerializer,
    UserSerializer,
)

User = get_user_model()


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """Register a new user and return JWT tokens"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Generate JWT tokens for the new user
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def get_current_user(request):
    """Get the current authenticated user's profile"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def run_algorithm(request):
    """Execute the selected algorithm and return results"""
    serializer = AlgorithmExecutionSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data

    try:
        # Run the algorithm
        start_time = time.time()
        runner = AlgorithmRunner(
            algorithm=data["algorithm"],
            grid=data["grid"],
            start=tuple(data["start"]),
            goal=tuple(data["goal"]),
            heuristic=data.get("heuristic", "manhattan"),
        )
        result = runner.execute()
        execution_time = time.time() - start_time

        result["execution_time"] = execution_time

        # Save simulation if requested and user is authenticated
        if data.get("save_simulation") and request.user.is_authenticated:
            simulation = Simulation.objects.create(
                user=request.user,
                algorithm=data["algorithm"],
                grid_data=data["grid"],
                start_position=data["start"],
                goal_position=data["goal"],
                heuristic=data.get("heuristic", "manhattan"),
                path_found=result["path_found"],
                path=result.get("path"),
                steps=result.get("steps"),
                nodes_explored=result.get("nodes_explored", 0),
                path_cost=result.get("path_cost", 0.0),
                execution_time=execution_time,
            )
            result["simulation_id"] = simulation.id

        return Response(result, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_algorithms(request):
    """Return list of available algorithms"""
    algorithms = [
        {"id": "astar", "name": "A* Search", "category": "Informed"},
        {"id": "bfs", "name": "Breadth-First Search", "category": "Uninformed"},
        {"id": "dfs", "name": "Depth-First Search", "category": "Uninformed"},
        {"id": "dijkstra", "name": "Dijkstra", "category": "Informed"},
        {"id": "hill_climbing", "name": "Hill Climbing", "category": "Local Search"},
        {
            "id": "simulated_annealing",
            "name": "Simulated Annealing",
            "category": "Local Search",
        },
        {"id": "genetic", "name": "Genetic Algorithm", "category": "Evolutionary"},
    ]
    return Response(algorithms)


class SimulationViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and managing saved simulations"""

    serializer_class = SimulationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return simulations for the current user, ordered by most recent"""
        return Simulation.objects.filter(user=self.request.user).order_by("-created_at")

    def list(self, request, *args, **kwargs):
        """List all simulations for the current user"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """Allow deleting simulations"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics for the current user"""
    user = request.user
    simulations = Simulation.objects.filter(user=user)

    # Total simulations
    total_simulations = simulations.count()

    # Success rate
    successful_simulations = simulations.filter(path_found=True).count()
    success_rate = (
        (successful_simulations / total_simulations * 100)
        if total_simulations > 0
        else 0
    )

    # Most used algorithm
    algorithm_counts = (
        simulations.values("algorithm")
        .annotate(count=Count("algorithm"))
        .order_by("-count")
    )
    favorite_algorithm = algorithm_counts.first() if algorithm_counts else None

    # Recent simulations (last 5)
    recent_simulations = simulations[:5]
    recent_data = SimulationSerializer(recent_simulations, many=True).data

    # Average execution time
    avg_execution_time = (
        simulations.aggregate(Avg("execution_time"))["execution_time__avg"] or 0
    )

    return Response(
        {
            "total_simulations": total_simulations,
            "successful_simulations": successful_simulations,
            "success_rate": round(success_rate, 1),
            "favorite_algorithm": favorite_algorithm,
            "recent_simulations": recent_data,
            "avg_execution_time": round(avg_execution_time, 3),
        }
    )
