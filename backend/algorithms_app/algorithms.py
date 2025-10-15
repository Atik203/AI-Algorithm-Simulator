"""
Algorithm implementations for pathfinding and search
"""
from heapq import heappush, heappop
from collections import deque
import math


class AlgorithmRunner:
    """Main class to execute different search algorithms"""
    
    def __init__(self, algorithm, grid, start, goal, heuristic='manhattan'):
        self.algorithm = algorithm
        self.grid = grid
        self.start = start
        self.goal = goal
        self.heuristic_type = heuristic
        self.rows = len(grid)
        self.cols = len(grid[0]) if grid else 0
        
    def execute(self):
        """Execute the selected algorithm"""
        algorithm_map = {
            'astar': self.astar,
            'bfs': self.bfs,
            'dfs': self.dfs,
            'dijkstra': self.dijkstra,
            'hill_climbing': self.hill_climbing,
            'simulated_annealing': self.simulated_annealing,
            'genetic': self.genetic_algorithm,
        }
        
        algo_func = algorithm_map.get(self.algorithm)
        if not algo_func:
            raise ValueError(f"Unknown algorithm: {self.algorithm}")
        
        return algo_func()
    
    def get_neighbors(self, pos):
        """Get valid neighboring cells (4-directional)"""
        row, col = pos
        neighbors = []
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # Right, Down, Left, Up
        
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc
            if (0 <= new_row < self.rows and 
                0 <= new_col < self.cols and 
                self.grid[new_row][new_col] != 1):  # 1 represents obstacle
                neighbors.append((new_row, new_col))
        
        return neighbors
    
    def heuristic(self, pos):
        """Calculate heuristic distance to goal"""
        if self.heuristic_type == 'manhattan':
            return abs(pos[0] - self.goal[0]) + abs(pos[1] - self.goal[1])
        elif self.heuristic_type == 'euclidean':
            return math.sqrt((pos[0] - self.goal[0])**2 + (pos[1] - self.goal[1])**2)
        return 0
    
    def reconstruct_path(self, came_from, current):
        """Reconstruct path from start to goal"""
        path = [list(current)]
        while current in came_from:
            current = came_from[current]
            path.append(list(current))
        path.reverse()
        return path
    
    def astar(self):
        """A* Search Algorithm"""
        open_set = []
        heappush(open_set, (0, self.start))
        came_from = {}
        g_score = {self.start: 0}
        f_score = {self.start: self.heuristic(self.start)}
        steps = []
        
        while open_set:
            _, current = heappop(open_set)
            steps.append({'position': list(current), 'type': 'visiting'})
            
            if current == self.goal:
                path = self.reconstruct_path(came_from, current)
                return {
                    'path_found': True,
                    'path': path,
                    'steps': steps,
                    'nodes_explored': len(steps),
                    'path_cost': g_score[current]
                }
            
            for neighbor in self.get_neighbors(current):
                tentative_g_score = g_score[current] + 1
                
                if neighbor not in g_score or tentative_g_score < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score
                    f_score[neighbor] = tentative_g_score + self.heuristic(neighbor)
                    heappush(open_set, (f_score[neighbor], neighbor))
                    steps.append({'position': list(neighbor), 'type': 'exploring'})
        
        return {
            'path_found': False,
            'path': None,
            'steps': steps,
            'nodes_explored': len(steps),
            'path_cost': 0
        }
    
    def bfs(self):
        """Breadth-First Search Algorithm"""
        queue = deque([self.start])
        came_from = {self.start: None}
        steps = []
        
        while queue:
            current = queue.popleft()
            steps.append({'position': list(current), 'type': 'visiting'})
            
            if current == self.goal:
                path = self.reconstruct_path(came_from, current)
                return {
                    'path_found': True,
                    'path': path,
                    'steps': steps,
                    'nodes_explored': len(steps),
                    'path_cost': len(path) - 1
                }
            
            for neighbor in self.get_neighbors(current):
                if neighbor not in came_from:
                    came_from[neighbor] = current
                    queue.append(neighbor)
                    steps.append({'position': list(neighbor), 'type': 'exploring'})
        
        return {
            'path_found': False,
            'path': None,
            'steps': steps,
            'nodes_explored': len(steps),
            'path_cost': 0
        }
    
    def dfs(self):
        """Depth-First Search Algorithm"""
        stack = [self.start]
        came_from = {self.start: None}
        visited = set()
        steps = []
        
        while stack:
            current = stack.pop()
            
            if current in visited:
                continue
                
            visited.add(current)
            steps.append({'position': list(current), 'type': 'visiting'})
            
            if current == self.goal:
                path = self.reconstruct_path(came_from, current)
                return {
                    'path_found': True,
                    'path': path,
                    'steps': steps,
                    'nodes_explored': len(steps),
                    'path_cost': len(path) - 1
                }
            
            for neighbor in self.get_neighbors(current):
                if neighbor not in visited and neighbor not in came_from:
                    came_from[neighbor] = current
                    stack.append(neighbor)
                    steps.append({'position': list(neighbor), 'type': 'exploring'})
        
        return {
            'path_found': False,
            'path': None,
            'steps': steps,
            'nodes_explored': len(steps),
            'path_cost': 0
        }
    
    def dijkstra(self):
        """Dijkstra's Algorithm (similar to A* but without heuristic)"""
        open_set = []
        heappush(open_set, (0, self.start))
        came_from = {}
        cost_so_far = {self.start: 0}
        steps = []
        
        while open_set:
            current_cost, current = heappop(open_set)
            steps.append({'position': list(current), 'type': 'visiting'})
            
            if current == self.goal:
                path = self.reconstruct_path(came_from, current)
                return {
                    'path_found': True,
                    'path': path,
                    'steps': steps,
                    'nodes_explored': len(steps),
                    'path_cost': cost_so_far[current]
                }
            
            for neighbor in self.get_neighbors(current):
                new_cost = cost_so_far[current] + 1
                
                if neighbor not in cost_so_far or new_cost < cost_so_far[neighbor]:
                    cost_so_far[neighbor] = new_cost
                    came_from[neighbor] = current
                    heappush(open_set, (new_cost, neighbor))
                    steps.append({'position': list(neighbor), 'type': 'exploring'})
        
        return {
            'path_found': False,
            'path': None,
            'steps': steps,
            'nodes_explored': len(steps),
            'path_cost': 0
        }
    
    def hill_climbing(self):
        """Hill Climbing Algorithm (simple local search)"""
        current = self.start
        steps = [{'position': list(current), 'type': 'visiting'}]
        path = [list(current)]
        
        max_iterations = 1000
        iteration = 0
        
        while current != self.goal and iteration < max_iterations:
            neighbors = self.get_neighbors(current)
            if not neighbors:
                break
            
            # Choose neighbor with best heuristic
            next_node = min(neighbors, key=lambda n: self.heuristic(n))
            
            # If no improvement, stop
            if self.heuristic(next_node) >= self.heuristic(current):
                break
            
            current = next_node
            path.append(list(current))
            steps.append({'position': list(current), 'type': 'visiting'})
            iteration += 1
        
        return {
            'path_found': current == self.goal,
            'path': path if current == self.goal else None,
            'steps': steps,
            'nodes_explored': len(steps),
            'path_cost': len(path) - 1 if current == self.goal else 0
        }
    
    def simulated_annealing(self):
        """Simulated Annealing Algorithm"""
        import random
        
        current = self.start
        steps = [{'position': list(current), 'type': 'visiting'}]
        path = [list(current)]
        
        temperature = 100.0
        cooling_rate = 0.95
        min_temp = 0.01
        
        while temperature > min_temp and current != self.goal:
            neighbors = self.get_neighbors(current)
            if not neighbors:
                break
            
            next_node = random.choice(neighbors)
            
            current_cost = self.heuristic(current)
            next_cost = self.heuristic(next_node)
            delta = next_cost - current_cost
            
            # Accept better solutions or worse with probability
            if delta < 0 or random.random() < math.exp(-delta / temperature):
                current = next_node
                path.append(list(current))
                steps.append({'position': list(current), 'type': 'visiting'})
            
            temperature *= cooling_rate
        
        return {
            'path_found': current == self.goal,
            'path': path if current == self.goal else None,
            'steps': steps,
            'nodes_explored': len(steps),
            'path_cost': len(path) - 1 if current == self.goal else 0
        }
    
    def genetic_algorithm(self):
        """Placeholder for Genetic Algorithm"""
        # This is a simplified placeholder
        # Genetic algorithms are better suited for optimization problems
        return {
            'path_found': False,
            'path': None,
            'steps': [],
            'nodes_explored': 0,
            'path_cost': 0,
            'message': 'Genetic Algorithm implementation coming soon'
        }
