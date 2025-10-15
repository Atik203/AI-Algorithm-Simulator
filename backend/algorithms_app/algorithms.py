"""
Algorithm implementations for pathfinding and search
"""

import math
from collections import deque
from heapq import heappop, heappush


class AlgorithmRunner:
    """Main class to execute different search algorithms"""

    def __init__(self, algorithm, grid, start, goal, heuristic="manhattan"):
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
            "astar": self.astar,
            "bfs": self.bfs,
            "dfs": self.dfs,
            "dijkstra": self.dijkstra,
            "hill_climbing": self.hill_climbing,
            "simulated_annealing": self.simulated_annealing,
            "genetic": self.genetic_algorithm,
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
            if (
                0 <= new_row < self.rows
                and 0 <= new_col < self.cols
                and self.grid[new_row][new_col] != 1
            ):  # 1 represents obstacle
                neighbors.append((new_row, new_col))

        return neighbors

    def heuristic(self, pos):
        """Calculate heuristic distance to goal"""
        if self.heuristic_type == "manhattan":
            return abs(pos[0] - self.goal[0]) + abs(pos[1] - self.goal[1])
        elif self.heuristic_type == "euclidean":
            return math.sqrt(
                (pos[0] - self.goal[0]) ** 2 + (pos[1] - self.goal[1]) ** 2
            )
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
            steps.append({"position": list(current), "type": "visiting"})

            if current == self.goal:
                path = self.reconstruct_path(came_from, current)
                return {
                    "path_found": True,
                    "path": path,
                    "steps": steps,
                    "nodes_explored": len(steps),
                    "path_cost": g_score[current],
                }

            for neighbor in self.get_neighbors(current):
                tentative_g_score = g_score[current] + 1

                if neighbor not in g_score or tentative_g_score < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score
                    f_score[neighbor] = tentative_g_score + self.heuristic(neighbor)
                    heappush(open_set, (f_score[neighbor], neighbor))
                    steps.append({"position": list(neighbor), "type": "exploring"})

        return {
            "path_found": False,
            "path": None,
            "steps": steps,
            "nodes_explored": len(steps),
            "path_cost": 0,
        }

    def bfs(self):
        """Breadth-First Search Algorithm"""
        queue = deque([self.start])
        came_from = {self.start: None}
        steps = []

        while queue:
            current = queue.popleft()
            steps.append({"position": list(current), "type": "visiting"})

            if current == self.goal:
                path = self.reconstruct_path(came_from, current)
                return {
                    "path_found": True,
                    "path": path,
                    "steps": steps,
                    "nodes_explored": len(steps),
                    "path_cost": len(path) - 1,
                }

            for neighbor in self.get_neighbors(current):
                if neighbor not in came_from:
                    came_from[neighbor] = current
                    queue.append(neighbor)
                    steps.append({"position": list(neighbor), "type": "exploring"})

        return {
            "path_found": False,
            "path": None,
            "steps": steps,
            "nodes_explored": len(steps),
            "path_cost": 0,
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
            steps.append({"position": list(current), "type": "visiting"})

            if current == self.goal:
                path = self.reconstruct_path(came_from, current)
                return {
                    "path_found": True,
                    "path": path,
                    "steps": steps,
                    "nodes_explored": len(steps),
                    "path_cost": len(path) - 1,
                }

            for neighbor in self.get_neighbors(current):
                if neighbor not in visited and neighbor not in came_from:
                    came_from[neighbor] = current
                    stack.append(neighbor)
                    steps.append({"position": list(neighbor), "type": "exploring"})

        return {
            "path_found": False,
            "path": None,
            "steps": steps,
            "nodes_explored": len(steps),
            "path_cost": 0,
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
            steps.append({"position": list(current), "type": "visiting"})

            if current == self.goal:
                path = self.reconstruct_path(came_from, current)
                return {
                    "path_found": True,
                    "path": path,
                    "steps": steps,
                    "nodes_explored": len(steps),
                    "path_cost": cost_so_far[current],
                }

            for neighbor in self.get_neighbors(current):
                new_cost = cost_so_far[current] + 1

                if neighbor not in cost_so_far or new_cost < cost_so_far[neighbor]:
                    cost_so_far[neighbor] = new_cost
                    came_from[neighbor] = current
                    heappush(open_set, (new_cost, neighbor))
                    steps.append({"position": list(neighbor), "type": "exploring"})

        return {
            "path_found": False,
            "path": None,
            "steps": steps,
            "nodes_explored": len(steps),
            "path_cost": 0,
        }

    def hill_climbing(self):
        """Hill Climbing Algorithm (simple local search)"""
        current = self.start
        steps = [{"position": list(current), "type": "visiting"}]
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
            steps.append({"position": list(current), "type": "visiting"})
            iteration += 1

        return {
            "path_found": current == self.goal,
            "path": path if current == self.goal else None,
            "steps": steps,
            "nodes_explored": len(steps),
            "path_cost": len(path) - 1 if current == self.goal else 0,
        }

    def simulated_annealing(self):
        """Simulated Annealing Algorithm"""
        import random

        current = self.start
        steps = [{"position": list(current), "type": "visiting"}]
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
                steps.append({"position": list(current), "type": "visiting"})

            temperature *= cooling_rate

        return {
            "path_found": current == self.goal,
            "path": path if current == self.goal else None,
            "steps": steps,
            "nodes_explored": len(steps),
            "path_cost": len(path) - 1 if current == self.goal else 0,
        }

    def genetic_algorithm(self):
        """
        Genetic Algorithm for pathfinding
        Uses evolutionary approach with population, selection, crossover, and mutation
        """
        import random

        population_size = 50
        generations = 100
        mutation_rate = 0.1
        elite_size = 5

        steps = []

        # Generate initial population of random paths
        def generate_random_path():
            """Generate a random path from start to goal"""
            path = [self.start]
            current = self.start
            visited = {self.start}
            max_steps = self.rows * self.cols

            for _ in range(max_steps):
                if current == self.goal:
                    break

                neighbors = [n for n in self.get_neighbors(current) if n not in visited]
                if not neighbors:
                    # Backtrack or try unvisited neighbors
                    neighbors = self.get_neighbors(current)
                    if not neighbors:
                        break

                # Prefer neighbors closer to goal
                if random.random() < 0.7:  # 70% greedy
                    next_node = min(neighbors, key=lambda n: self.heuristic(n))
                else:  # 30% random exploration
                    next_node = random.choice(neighbors)

                path.append(next_node)
                visited.add(next_node)
                current = next_node

            return path

        # Fitness function - lower is better (distance to goal + path length)
        def fitness(path):
            if not path:
                return float("inf")
            last = path[-1]
            distance_to_goal = self.heuristic(last)
            path_length = len(path)
            reached_goal = 1 if last == self.goal else 0

            # Reward reaching goal, penalize distance and length
            return distance_to_goal + path_length * 0.5 - reached_goal * 1000

        # Selection - tournament selection
        def select_parent(population, fitnesses, tournament_size=3):
            tournament = random.sample(
                list(zip(population, fitnesses)), tournament_size
            )
            return min(tournament, key=lambda x: x[1])[0]

        # Crossover - combine two parent paths
        def crossover(parent1, parent2):
            if len(parent1) < 2 or len(parent2) < 2:
                return parent1.copy()

            # Find common nodes
            common = set(parent1) & set(parent2)
            if not common or self.start not in common:
                return parent1.copy()

            # Pick a crossover point from common nodes
            common_nodes = [n for n in parent1 if n in common]
            if len(common_nodes) < 2:
                return parent1.copy()

            crossover_point = random.choice(common_nodes[1:])

            # Build child path
            idx1 = parent1.index(crossover_point)
            idx2 = parent2.index(crossover_point)

            child = parent1[: idx1 + 1] + parent2[idx2 + 1 :]
            return child

        # Mutation - randomly change part of path
        def mutate(path):
            if len(path) < 3 or random.random() > mutation_rate:
                return path

            # Pick a random point in path and regenerate from there
            mutation_point = random.randint(1, len(path) - 1)
            mutated = path[:mutation_point]
            current = mutated[-1]

            # Generate a few random steps
            for _ in range(random.randint(1, 5)):
                neighbors = self.get_neighbors(current)
                if not neighbors:
                    break
                next_node = random.choice(neighbors)
                mutated.append(next_node)
                current = next_node
                if current == self.goal:
                    break

            return mutated

        # Initialize population
        population = [generate_random_path() for _ in range(population_size)]
        best_path = None
        best_fitness = float("inf")

        # Evolution
        for generation in range(generations):
            # Calculate fitness for all individuals
            fitnesses = [fitness(path) for path in population]

            # Track best solution
            gen_best_idx = fitnesses.index(min(fitnesses))
            if fitnesses[gen_best_idx] < best_fitness:
                best_fitness = fitnesses[gen_best_idx]
                best_path = population[gen_best_idx].copy()

                # Record steps for visualization
                for pos in best_path:
                    steps.append({"position": list(pos), "type": "visiting"})

            # Check if goal is reached
            if best_path and best_path[-1] == self.goal:
                break

            # Selection and reproduction
            # Keep elite individuals
            elite_indices = sorted(range(len(fitnesses)), key=lambda i: fitnesses[i])[
                :elite_size
            ]
            new_population = [population[i].copy() for i in elite_indices]

            # Generate rest of population through crossover and mutation
            while len(new_population) < population_size:
                parent1 = select_parent(population, fitnesses)
                parent2 = select_parent(population, fitnesses)

                child = crossover(parent1, parent2)
                child = mutate(child)

                new_population.append(child)

            population = new_population

        # Return best solution found
        if best_path:
            path_found = best_path[-1] == self.goal
            return {
                "path_found": path_found,
                "path": best_path if path_found else None,
                "steps": (
                    steps[-200:] if len(steps) > 200 else steps
                ),  # Limit steps for performance
                "nodes_explored": len(steps),
                "path_cost": len(best_path) - 1 if path_found else 0,
                "generations": generation + 1,
            }

        return {
            "path_found": False,
            "path": None,
            "steps": [],
            "nodes_explored": 0,
            "path_cost": 0,
        }
