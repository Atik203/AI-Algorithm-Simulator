"""
Puzzle-solving algorithms for various classic puzzles
Includes: 8-Puzzle, N-Queens, Sudoku, etc.
"""

import copy
import heapq
from typing import Any, Dict, List, Optional, Tuple


class PuzzleSolver:
    """Base class for puzzle-solving algorithms"""

    def __init__(self, puzzle_type: str, initial_state: Any, goal_state: Any = None):
        self.puzzle_type = puzzle_type
        self.initial_state = initial_state
        self.goal_state = goal_state


class EightPuzzleSolver(PuzzleSolver):
    """Solver for 8-Puzzle (sliding puzzle) using A* and BFS"""

    def __init__(self, initial_state: List[List[int]]):
        # Goal state for 8-puzzle: [[1,2,3], [4,5,6], [7,8,0]]
        goal_state = [[1, 2, 3], [4, 5, 6], [7, 8, 0]]
        super().__init__("8-puzzle", initial_state, goal_state)

    def get_blank_position(self, state: List[List[int]]) -> Tuple[int, int]:
        """Find position of blank tile (0)"""
        for i in range(3):
            for j in range(3):
                if state[i][j] == 0:
                    return i, j
        return 0, 0

    def get_neighbors(self, state: List[List[int]]) -> List[List[List[int]]]:
        """Get all valid neighbor states by moving blank tile"""
        neighbors = []
        i, j = self.get_blank_position(state)
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # Right, Down, Left, Up

        for di, dj in directions:
            ni, nj = i + di, j + dj
            if 0 <= ni < 3 and 0 <= nj < 3:
                # Create new state by swapping blank with adjacent tile
                new_state = [row[:] for row in state]
                new_state[i][j], new_state[ni][nj] = new_state[ni][nj], new_state[i][j]
                neighbors.append(new_state)

        return neighbors

    def manhattan_distance(self, state: List[List[int]]) -> int:
        """Calculate Manhattan distance heuristic"""
        distance = 0
        for i in range(3):
            for j in range(3):
                if state[i][j] != 0:
                    value = state[i][j]
                    target_i = (value - 1) // 3
                    target_j = (value - 1) % 3
                    distance += abs(i - target_i) + abs(j - target_j)
        return distance

    def misplaced_tiles(self, state: List[List[int]]) -> int:
        """Calculate misplaced tiles heuristic"""
        count = 0
        for i in range(3):
            for j in range(3):
                if state[i][j] != 0 and state[i][j] != self.goal_state[i][j]:
                    count += 1
        return count

    def state_to_tuple(self, state: List[List[int]]) -> Tuple:
        """Convert state to hashable tuple for visited tracking"""
        return tuple(tuple(row) for row in state)

    def solve_astar(self) -> Dict[str, Any]:
        """Solve 8-puzzle using A* algorithm"""
        open_set = []
        heapq.heappush(
            open_set,
            (self.manhattan_distance(self.initial_state), 0, self.initial_state, []),
        )

        visited = set()
        visited.add(self.state_to_tuple(self.initial_state))
        steps = []
        nodes_explored = 0

        while open_set:
            f_score, g_score, current_state, path = heapq.heappop(open_set)
            nodes_explored += 1

            steps.append(
                {"state": [row[:] for row in current_state], "type": "visiting"}
            )

            # Check if goal reached
            if current_state == self.goal_state:
                return {
                    "solved": True,
                    "steps": steps,
                    "path": path + [current_state],
                    "nodes_explored": nodes_explored,
                    "moves": len(path),
                    "algorithm": "astar",
                }

            # Explore neighbors
            for neighbor in self.get_neighbors(current_state):
                neighbor_tuple = self.state_to_tuple(neighbor)
                if neighbor_tuple not in visited:
                    visited.add(neighbor_tuple)
                    new_g = g_score + 1
                    h = self.manhattan_distance(neighbor)
                    f = new_g + h
                    heapq.heappush(
                        open_set, (f, new_g, neighbor, path + [current_state])
                    )

            # Limit to prevent infinite loops
            if nodes_explored > 10000:
                break

        return {
            "solved": False,
            "steps": steps,
            "path": [],
            "nodes_explored": nodes_explored,
            "moves": 0,
            "algorithm": "astar",
            "message": "No solution found or puzzle is unsolvable",
        }

    def solve_bfs(self) -> Dict[str, Any]:
        """Solve 8-puzzle using BFS algorithm"""
        from collections import deque

        queue = deque([(self.initial_state, [])])
        visited = set()
        visited.add(self.state_to_tuple(self.initial_state))
        steps = []
        nodes_explored = 0

        while queue:
            current_state, path = queue.popleft()
            nodes_explored += 1

            steps.append(
                {"state": [row[:] for row in current_state], "type": "visiting"}
            )

            # Check if goal reached
            if current_state == self.goal_state:
                return {
                    "solved": True,
                    "steps": steps,
                    "path": path + [current_state],
                    "nodes_explored": nodes_explored,
                    "moves": len(path),
                    "algorithm": "bfs",
                }

            # Explore neighbors
            for neighbor in self.get_neighbors(current_state):
                neighbor_tuple = self.state_to_tuple(neighbor)
                if neighbor_tuple not in visited:
                    visited.add(neighbor_tuple)
                    queue.append((neighbor, path + [current_state]))

            # Limit to prevent excessive memory usage
            if nodes_explored > 5000:
                break

        return {
            "solved": False,
            "steps": steps,
            "path": [],
            "nodes_explored": nodes_explored,
            "moves": 0,
            "algorithm": "bfs",
            "message": "No solution found or search space too large",
        }


class NQueensSolver:
    """Solver for N-Queens problem using backtracking"""

    def __init__(self, n: int = 8):
        self.n = n
        self.solutions = []
        self.steps = []

    def is_safe(self, board: List[List[int]], row: int, col: int) -> bool:
        """Check if queen can be placed at board[row][col]"""
        # Check column
        for i in range(row):
            if board[i][col] == 1:
                return False

        # Check upper left diagonal
        i, j = row - 1, col - 1
        while i >= 0 and j >= 0:
            if board[i][j] == 1:
                return False
            i -= 1
            j -= 1

        # Check upper right diagonal
        i, j = row - 1, col + 1
        while i >= 0 and j < self.n:
            if board[i][j] == 1:
                return False
            i -= 1
            j += 1

        return True

    def solve_backtracking(
        self, board: List[List[int]], row: int, find_all: bool = False
    ) -> bool:
        """Solve N-Queens using backtracking"""
        # Base case: all queens placed
        if row >= self.n:
            self.solutions.append([row[:] for row in board])
            self.steps.append(
                {
                    "board": [row[:] for row in board],
                    "type": "solution",
                    "row": row - 1,
                    "col": -1,
                }
            )
            return True

        found_solution = False

        # Try placing queen in each column of current row
        for col in range(self.n):
            self.steps.append(
                {
                    "board": [row[:] for row in board],
                    "type": "trying",
                    "row": row,
                    "col": col,
                }
            )

            if self.is_safe(board, row, col):
                # Place queen
                board[row][col] = 1
                self.steps.append(
                    {
                        "board": [row[:] for row in board],
                        "type": "placing",
                        "row": row,
                        "col": col,
                    }
                )

                # Recurse to place rest of queens
                if self.solve_backtracking(board, row + 1, find_all):
                    found_solution = True
                    if not find_all:
                        return True

                # Backtrack
                board[row][col] = 0
                self.steps.append(
                    {
                        "board": [row[:] for row in board],
                        "type": "backtracking",
                        "row": row,
                        "col": col,
                    }
                )

        return found_solution

    def solve(self, find_all: bool = False) -> Dict[str, Any]:
        """Solve N-Queens problem"""
        board = [[0 for _ in range(self.n)] for _ in range(self.n)]
        self.solutions = []
        self.steps = []

        found = self.solve_backtracking(board, 0, find_all)

        return {
            "solved": found,
            "solutions": self.solutions,
            "solution_count": len(self.solutions),
            "steps": self.steps,
            "nodes_explored": len(self.steps),
            "board_size": self.n,
        }


class SudokuSolver:
    """Solver for Sudoku using backtracking"""

    def __init__(self, board: List[List[int]]):
        self.board = [row[:] for row in board]
        self.steps = []

    def is_valid(self, board: List[List[int]], row: int, col: int, num: int) -> bool:
        """Check if number can be placed at board[row][col]"""
        # Check row
        if num in board[row]:
            return False

        # Check column
        if num in [board[i][col] for i in range(9)]:
            return False

        # Check 3x3 box
        box_row, box_col = 3 * (row // 3), 3 * (col // 3)
        for i in range(box_row, box_row + 3):
            for j in range(box_col, box_col + 3):
                if board[i][j] == num:
                    return False

        return True

    def find_empty(self, board: List[List[int]]) -> Optional[Tuple[int, int]]:
        """Find empty cell (0)"""
        for i in range(9):
            for j in range(9):
                if board[i][j] == 0:
                    return i, j
        return None

    def solve_backtracking(self, board: List[List[int]]) -> bool:
        """Solve Sudoku using backtracking"""
        empty = self.find_empty(board)

        if empty is None:
            # Puzzle solved
            self.steps.append({"board": [row[:] for row in board], "type": "solution"})
            return True

        row, col = empty

        for num in range(1, 10):
            self.steps.append(
                {
                    "board": [row[:] for row in board],
                    "type": "trying",
                    "row": row,
                    "col": col,
                    "value": num,
                }
            )

            if self.is_valid(board, row, col, num):
                board[row][col] = num
                self.steps.append(
                    {
                        "board": [row[:] for row in board],
                        "type": "placing",
                        "row": row,
                        "col": col,
                        "value": num,
                    }
                )

                if self.solve_backtracking(board):
                    return True

                # Backtrack
                board[row][col] = 0
                self.steps.append(
                    {
                        "board": [row[:] for row in board],
                        "type": "backtracking",
                        "row": row,
                        "col": col,
                    }
                )

        return False

    def solve(self) -> Dict[str, Any]:
        """Solve Sudoku puzzle"""
        board = [row[:] for row in self.board]
        self.steps = []

        solved = self.solve_backtracking(board)

        return {
            "solved": solved,
            "solution": board if solved else None,
            "steps": self.steps,
            "nodes_explored": len(self.steps),
        }
