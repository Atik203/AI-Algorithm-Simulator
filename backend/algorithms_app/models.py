from django.db import models
from django.contrib.auth.models import User


class Simulation(models.Model):
    """Store simulation results and configurations"""
    ALGORITHM_CHOICES = [
        ('astar', 'A* Search'),
        ('bfs', 'Breadth-First Search'),
        ('dfs', 'Depth-First Search'),
        ('dijkstra', 'Dijkstra'),
        ('hill_climbing', 'Hill Climbing'),
        ('simulated_annealing', 'Simulated Annealing'),
        ('genetic', 'Genetic Algorithm'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='simulations', null=True, blank=True)
    algorithm = models.CharField(max_length=50, choices=ALGORITHM_CHOICES)
    grid_data = models.JSONField()  # Store grid configuration
    start_position = models.JSONField()  # [x, y]
    goal_position = models.JSONField()  # [x, y]
    heuristic = models.CharField(max_length=50, blank=True)  # manhattan, euclidean, etc.
    
    # Results
    path_found = models.BooleanField(default=False)
    path = models.JSONField(null=True, blank=True)  # List of positions
    steps = models.JSONField(null=True, blank=True)  # All exploration steps
    nodes_explored = models.IntegerField(default=0)
    path_cost = models.FloatField(default=0.0)
    execution_time = models.FloatField(default=0.0)  # in seconds
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.algorithm} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
