from django.contrib.auth.models import User
from django.db import models


class Simulation(models.Model):
    """Store simulation results and configurations"""

    ALGORITHM_CHOICES = [
        ("astar", "A* Search"),
        ("bfs", "Breadth-First Search"),
        ("dfs", "Depth-First Search"),
        ("dijkstra", "Dijkstra"),
        ("hill_climbing", "Hill Climbing"),
        ("simulated_annealing", "Simulated Annealing"),
        ("genetic", "Genetic Algorithm"),
        # Puzzle algorithms
        ("8-puzzle-astar", "8-Puzzle A*"),
        ("8-puzzle-bfs", "8-Puzzle BFS"),
        ("n-queens", "N-Queens"),
        ("sudoku", "Sudoku"),
        # Game algorithms
        ("tic-tac-toe-minimax", "Tic-Tac-Toe Minimax"),
        ("tic-tac-toe-alphabeta", "Tic-Tac-Toe Alpha-Beta"),
        ("tower-of-hanoi", "Tower of Hanoi"),
        ("connect4", "Connect 4"),
    ]

    SIMULATION_TYPE_CHOICES = [
        ("pathfinding", "Pathfinding"),
        ("8-puzzle", "8-Puzzle"),
        ("n-queens", "N-Queens"),
        ("sudoku", "Sudoku"),
        ("tic-tac-toe", "Tic-Tac-Toe"),
        ("tower-of-hanoi", "Tower of Hanoi"),
        ("connect4", "Connect 4"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="simulations",
        null=True,
        blank=True,
    )
    simulation_type = models.CharField(
        max_length=50, choices=SIMULATION_TYPE_CHOICES, default="pathfinding"
    )
    algorithm = models.CharField(max_length=50, choices=ALGORITHM_CHOICES)

    # Pathfinding specific fields
    grid_data = models.JSONField(null=True, blank=True)  # Store grid configuration
    start_position = models.JSONField(null=True, blank=True)  # [x, y]
    goal_position = models.JSONField(null=True, blank=True)  # [x, y]
    heuristic = models.CharField(
        max_length=50, blank=True
    )  # manhattan, euclidean, etc.

    # Puzzle/Game specific fields
    initial_state = models.JSONField(
        null=True, blank=True
    )  # Initial board/puzzle state
    final_state = models.JSONField(null=True, blank=True)  # Solution state
    board_size = models.IntegerField(
        null=True, blank=True
    )  # Board size (e.g., 8 for 8x8)

    # Results
    path_found = models.BooleanField(default=False)
    solved = models.BooleanField(default=False)  # For puzzles/games
    path = models.JSONField(null=True, blank=True)  # List of positions
    steps = models.JSONField(null=True, blank=True)  # All exploration steps
    nodes_explored = models.IntegerField(default=0)
    path_cost = models.FloatField(default=0.0)
    execution_time = models.FloatField(default=0.0)  # in seconds
    total_moves = models.IntegerField(
        null=True, blank=True
    )  # For games like Tower of Hanoi

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.get_simulation_type_display()} - {self.algorithm} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
