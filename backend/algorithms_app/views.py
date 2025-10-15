import time

from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Avg, Count, Q, Sum
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


@api_view(["GET"])
def get_simulation_types(request):
    """Return list of available simulation types"""
    simulation_types = [
        {
            "id": "pathfinding",
            "name": "Pathfinding",
            "description": "Find shortest path in a grid with obstacles",
            "algorithms": [
                "astar",
                "bfs",
                "dfs",
                "dijkstra",
                "hill_climbing",
                "simulated_annealing",
            ],
            "icon": "map",
        },
        {
            "id": "8-puzzle",
            "name": "8-Puzzle Solver",
            "description": "Solve the classic sliding tile puzzle",
            "algorithms": ["astar", "bfs"],
            "icon": "grid_3x3",
        },
        {
            "id": "n-queens",
            "name": "N-Queens Problem",
            "description": "Place N queens on NxN board without conflicts",
            "algorithms": ["backtracking"],
            "icon": "extension",
        },
        {
            "id": "tic-tac-toe",
            "name": "Tic-Tac-Toe AI",
            "description": "Game AI using Minimax algorithm",
            "algorithms": ["minimax", "alpha_beta"],
            "icon": "sports_esports",
        },
        {
            "id": "sudoku",
            "name": "Sudoku Solver",
            "description": "Solve Sudoku puzzles using backtracking",
            "algorithms": ["backtracking"],
            "icon": "grid_on",
        },
        {
            "id": "tower-of-hanoi",
            "name": "Tower of Hanoi",
            "description": "Classic recursive puzzle solver",
            "algorithms": ["recursive"],
            "icon": "account_tree",
        },
    ]
    return Response(simulation_types)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def solve_puzzle(request):
    """Solve various puzzles (8-puzzle, N-Queens, Sudoku, etc.)"""
    from .puzzle_algorithms import EightPuzzleSolver, NQueensSolver, SudokuSolver

    puzzle_type = request.data.get("puzzle_type")
    algorithm = request.data.get("algorithm", "astar")

    try:
        if puzzle_type == "8-puzzle":
            initial_state = request.data.get("initial_state")
            solver = EightPuzzleSolver(initial_state)

            if algorithm == "astar":
                result = solver.solve_astar()
            elif algorithm == "bfs":
                result = solver.solve_bfs()
            else:
                return Response(
                    {"error": f"Algorithm {algorithm} not supported for 8-puzzle"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(result, status=status.HTTP_200_OK)

        elif puzzle_type == "n-queens":
            n = request.data.get("board_size", 8)
            find_all = request.data.get("find_all", False)
            solver = NQueensSolver(n)
            result = solver.solve(find_all)

            return Response(result, status=status.HTTP_200_OK)

        elif puzzle_type == "sudoku":
            board = request.data.get("board")
            solver = SudokuSolver(board)
            result = solver.solve()

            return Response(result, status=status.HTTP_200_OK)

        else:
            return Response(
                {"error": f"Unknown puzzle type: {puzzle_type}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def play_game(request):
    """Play games with AI (Tic-Tac-Toe, Connect 4, etc.)"""
    from .game_algorithms import Connect4AI, TicTacToeAI, TowerOfHanoi

    game_type = request.data.get("game_type")

    try:
        if game_type == "tic-tac-toe":
            board = request.data.get("board", None)
            action = request.data.get("action", "find_move")  # find_move or play_game
            use_alpha_beta = request.data.get("use_alpha_beta", False)
            player = request.data.get("player", "X")

            ai = TicTacToeAI(board)

            if action == "find_move":
                result = ai.find_best_move(player, use_alpha_beta)
            elif action == "play_game":
                result = ai.play_game(
                    first_player=request.data.get("first_player", "X"),
                    use_alpha_beta=use_alpha_beta,
                )
            else:
                return Response(
                    {"error": f"Unknown action: {action}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(result, status=status.HTTP_200_OK)

        elif game_type == "tower-of-hanoi":
            n_disks = request.data.get("n_disks", 3)
            solver = TowerOfHanoi(n_disks)
            result = solver.get_solution()

            return Response(result, status=status.HTTP_200_OK)

        elif game_type == "connect4":
            board = request.data.get("board", None)
            piece = request.data.get("piece", "X")
            depth = request.data.get("depth", 4)

            ai = Connect4AI()
            if board:
                ai.board = board

            result = ai.find_best_move(piece, depth)

            return Response(result, status=status.HTTP_200_OK)

        else:
            return Response(
                {"error": f"Unknown game type: {game_type}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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

    # Success rate (path_found for pathfinding, solved for puzzles/games)
    successful_simulations = simulations.filter(
        Q(path_found=True) | Q(solved=True)
    ).count()
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

    # Simulation type breakdown
    simulation_type_counts = (
        simulations.values("simulation_type")
        .annotate(count=Count("simulation_type"))
        .order_by("-count")
    )

    # Recent simulations (last 5)
    recent_simulations = simulations[:5]
    recent_data = SimulationSerializer(recent_simulations, many=True).data

    # Average execution time
    avg_execution_time = (
        simulations.aggregate(Avg("execution_time"))["execution_time__avg"] or 0
    )

    # Total nodes explored
    total_nodes_explored = (
        simulations.aggregate(Sum("nodes_explored"))["nodes_explored__sum"] or 0
    )

    return Response(
        {
            "total_simulations": total_simulations,
            "successful_simulations": successful_simulations,
            "success_rate": round(success_rate, 1),
            "favorite_algorithm": favorite_algorithm,
            "simulation_type_counts": list(simulation_type_counts),
            "recent_simulations": recent_data,
            "avg_execution_time": round(avg_execution_time, 3),
            "total_nodes_explored": total_nodes_explored,
        }
    )
