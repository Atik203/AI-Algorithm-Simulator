"""
Game AI algorithms - Minimax, Alpha-Beta Pruning, etc.
Includes: Tic-Tac-Toe, Connect 4, etc.
"""

import math
from typing import Any, Dict, List, Optional, Tuple


class TicTacToeAI:
    """Tic-Tac-Toe AI using Minimax algorithm"""

    def __init__(self, board: Optional[List[List[str]]] = None):
        # Board: 3x3 grid with 'X', 'O', or '' (empty)
        self.board = board or [["" for _ in range(3)] for _ in range(3)]
        self.steps = []
        self.evaluations = []

    def get_empty_cells(self, board: List[List[str]]) -> List[Tuple[int, int]]:
        """Get list of empty cells"""
        empty = []
        for i in range(3):
            for j in range(3):
                if board[i][j] == "":
                    empty.append((i, j))
        return empty

    def check_winner(self, board: List[List[str]]) -> Optional[str]:
        """Check if there's a winner. Returns 'X', 'O', 'draw', or None"""
        # Check rows
        for row in board:
            if row[0] == row[1] == row[2] and row[0] != "":
                return row[0]

        # Check columns
        for col in range(3):
            if board[0][col] == board[1][col] == board[2][col] and board[0][col] != "":
                return board[0][col]

        # Check diagonals
        if board[0][0] == board[1][1] == board[2][2] and board[0][0] != "":
            return board[0][0]
        if board[0][2] == board[1][1] == board[2][0] and board[0][2] != "":
            return board[0][2]

        # Check for draw
        if all(board[i][j] != "" for i in range(3) for j in range(3)):
            return "draw"

        return None

    def evaluate(self, board: List[List[str]]) -> int:
        """Evaluate board state. +10 for X win, -10 for O win, 0 otherwise"""
        winner = self.check_winner(board)
        if winner == "X":
            return 10
        elif winner == "O":
            return -10
        else:
            return 0

    def minimax(
        self,
        board: List[List[str]],
        depth: int,
        is_maximizing: bool,
        alpha: float = -math.inf,
        beta: float = math.inf,
        use_alpha_beta: bool = False,
    ) -> int:
        """
        Minimax algorithm with optional Alpha-Beta pruning
        Returns best score for current player
        """
        score = self.evaluate(board)

        # Terminal states
        if score == 10:
            return score - depth  # Prefer faster wins
        if score == -10:
            return score + depth  # Prefer slower losses
        if not self.get_empty_cells(board):
            return 0  # Draw

        if is_maximizing:
            best_score = -math.inf
            for i, j in self.get_empty_cells(board):
                board[i][j] = "X"
                score = self.minimax(
                    board, depth + 1, False, alpha, beta, use_alpha_beta
                )
                board[i][j] = ""
                best_score = max(best_score, score)

                if use_alpha_beta:
                    alpha = max(alpha, best_score)
                    if beta <= alpha:
                        break  # Beta cutoff

            return best_score
        else:
            best_score = math.inf
            for i, j in self.get_empty_cells(board):
                board[i][j] = "O"
                score = self.minimax(
                    board, depth + 1, True, alpha, beta, use_alpha_beta
                )
                board[i][j] = ""
                best_score = min(best_score, score)

                if use_alpha_beta:
                    beta = min(beta, best_score)
                    if beta <= alpha:
                        break  # Alpha cutoff

            return best_score

    def find_best_move(
        self, player: str = "X", use_alpha_beta: bool = False
    ) -> Dict[str, Any]:
        """
        Find best move for given player using Minimax
        Returns move coordinates and evaluation details
        """
        best_score = -math.inf if player == "X" else math.inf
        best_move = None
        move_evaluations = []

        for i, j in self.get_empty_cells(self.board):
            # Try move
            self.board[i][j] = player
            is_maximizing = player == "O"

            # Evaluate using minimax
            score = self.minimax(
                self.board, 0, is_maximizing, -math.inf, math.inf, use_alpha_beta
            )

            # Undo move
            self.board[i][j] = ""

            # Store evaluation
            move_evaluations.append(
                {
                    "row": i,
                    "col": j,
                    "score": score,
                    "board": [row[:] for row in self.board],
                }
            )

            # Update best move
            if player == "X":
                if score > best_score:
                    best_score = score
                    best_move = (i, j)
            else:
                if score < best_score:
                    best_score = score
                    best_move = (i, j)

        return {
            "best_move": best_move,
            "best_score": best_score,
            "evaluations": move_evaluations,
            "algorithm": "alpha_beta" if use_alpha_beta else "minimax",
            "moves_evaluated": len(move_evaluations),
        }

    def play_game(
        self,
        first_player: str = "X",
        ai_player: str = "O",
        use_alpha_beta: bool = False,
    ) -> Dict[str, Any]:
        """
        Simulate a game where AI plays against itself or a fixed strategy
        Returns game history and result
        """
        board = [["" for _ in range(3)] for _ in range(3)]
        game_history = []
        current_player = first_player

        move_count = 0
        max_moves = 9

        while move_count < max_moves:
            winner = self.check_winner(board)
            if winner:
                break

            # Find best move for current player
            self.board = [row[:] for row in board]
            result = self.find_best_move(current_player, use_alpha_beta)

            if result["best_move"] is None:
                break

            row, col = result["best_move"]
            board[row][col] = current_player

            game_history.append(
                {
                    "player": current_player,
                    "move": {"row": row, "col": col},
                    "board": [row[:] for row in board],
                    "score": result["best_score"],
                    "evaluations": result["evaluations"],
                }
            )

            # Switch player
            current_player = "O" if current_player == "X" else "X"
            move_count += 1

        final_winner = self.check_winner(board)

        return {
            "winner": final_winner,
            "game_history": game_history,
            "total_moves": move_count,
            "algorithm": "alpha_beta" if use_alpha_beta else "minimax",
        }


class TowerOfHanoi:
    """Tower of Hanoi solver using recursion"""

    def __init__(self, n_disks: int = 3):
        self.n_disks = n_disks
        self.steps = []
        self.move_count = 0

    def solve(self, n: int, source: str, destination: str, auxiliary: str) -> None:
        """Recursive solution for Tower of Hanoi"""
        if n == 1:
            self.move_count += 1
            self.steps.append(
                {
                    "move": self.move_count,
                    "disk": n,
                    "from": source,
                    "to": destination,
                    "description": f"Move disk {n} from {source} to {destination}",
                }
            )
            return

        # Move n-1 disks from source to auxiliary
        self.solve(n - 1, source, auxiliary, destination)

        # Move largest disk from source to destination
        self.move_count += 1
        self.steps.append(
            {
                "move": self.move_count,
                "disk": n,
                "from": source,
                "to": destination,
                "description": f"Move disk {n} from {source} to {destination}",
            }
        )

        # Move n-1 disks from auxiliary to destination
        self.solve(n - 1, auxiliary, destination, source)

    def get_solution(self) -> Dict[str, Any]:
        """Get complete solution for Tower of Hanoi"""
        self.steps = []
        self.move_count = 0

        self.solve(self.n_disks, "A", "C", "B")

        return {
            "n_disks": self.n_disks,
            "total_moves": self.move_count,
            "steps": self.steps,
            "optimal_moves": 2**self.n_disks - 1,
            "is_optimal": self.move_count == 2**self.n_disks - 1,
        }


class Connect4AI:
    """Connect 4 AI using Minimax with Alpha-Beta pruning"""

    def __init__(self, rows: int = 6, cols: int = 7):
        self.rows = rows
        self.cols = cols
        self.board = [[" " for _ in range(cols)] for _ in range(rows)]

    def drop_piece(self, board: List[List[str]], col: int, piece: str) -> Optional[int]:
        """Drop piece in column, return row where it landed"""
        for row in range(self.rows - 1, -1, -1):
            if board[row][col] == " ":
                board[row][col] = piece
                return row
        return None

    def get_valid_columns(self, board: List[List[str]]) -> List[int]:
        """Get list of columns that aren't full"""
        return [col for col in range(self.cols) if board[0][col] == " "]

    def check_winner(self, board: List[List[str]], piece: str) -> bool:
        """Check if piece has won"""
        # Check horizontal
        for row in range(self.rows):
            for col in range(self.cols - 3):
                if all(board[row][col + i] == piece for i in range(4)):
                    return True

        # Check vertical
        for row in range(self.rows - 3):
            for col in range(self.cols):
                if all(board[row + i][col] == piece for i in range(4)):
                    return True

        # Check diagonal (down-right)
        for row in range(self.rows - 3):
            for col in range(self.cols - 3):
                if all(board[row + i][col + i] == piece for i in range(4)):
                    return True

        # Check diagonal (down-left)
        for row in range(self.rows - 3):
            for col in range(3, self.cols):
                if all(board[row + i][col - i] == piece for i in range(4)):
                    return True

        return False

    def evaluate_window(self, window: List[str], piece: str) -> int:
        """Evaluate a window of 4 positions"""
        score = 0
        opp_piece = "O" if piece == "X" else "X"

        if window.count(piece) == 4:
            score += 100
        elif window.count(piece) == 3 and window.count(" ") == 1:
            score += 5
        elif window.count(piece) == 2 and window.count(" ") == 2:
            score += 2

        if window.count(opp_piece) == 3 and window.count(" ") == 1:
            score -= 4

        return score

    def evaluate_position(self, board: List[List[str]], piece: str) -> int:
        """Evaluate board position for piece"""
        score = 0

        # Score center column
        center_col = self.cols // 2
        center_count = sum(
            1 for row in range(self.rows) if board[row][center_col] == piece
        )
        score += center_count * 3

        # Score horizontal
        for row in range(self.rows):
            for col in range(self.cols - 3):
                window = [board[row][col + i] for i in range(4)]
                score += self.evaluate_window(window, piece)

        # Score vertical
        for col in range(self.cols):
            for row in range(self.rows - 3):
                window = [board[row + i][col] for i in range(4)]
                score += self.evaluate_window(window, piece)

        # Score diagonal (down-right)
        for row in range(self.rows - 3):
            for col in range(self.cols - 3):
                window = [board[row + i][col + i] for i in range(4)]
                score += self.evaluate_window(window, piece)

        # Score diagonal (down-left)
        for row in range(self.rows - 3):
            for col in range(3, self.cols):
                window = [board[row + i][col - i] for i in range(4)]
                score += self.evaluate_window(window, piece)

        return score

    def minimax(
        self,
        board: List[List[str]],
        depth: int,
        alpha: float,
        beta: float,
        maximizing: bool,
        piece: str,
    ) -> Tuple[Optional[int], int]:
        """Minimax with alpha-beta pruning"""
        valid_cols = self.get_valid_columns(board)
        is_terminal = (
            self.check_winner(board, "X")
            or self.check_winner(board, "O")
            or len(valid_cols) == 0
        )

        if depth == 0 or is_terminal:
            if is_terminal:
                if self.check_winner(board, piece):
                    return (None, 100000000)
                elif self.check_winner(board, "O" if piece == "X" else "X"):
                    return (None, -100000000)
                else:
                    return (None, 0)
            else:
                return (None, self.evaluate_position(board, piece))

        if maximizing:
            value = -math.inf
            column = valid_cols[0]
            for col in valid_cols:
                temp_board = [row[:] for row in board]
                self.drop_piece(temp_board, col, piece)
                new_score = self.minimax(
                    temp_board, depth - 1, alpha, beta, False, piece
                )[1]
                if new_score > value:
                    value = new_score
                    column = col
                alpha = max(alpha, value)
                if alpha >= beta:
                    break
            return column, value
        else:
            value = math.inf
            column = valid_cols[0]
            opp_piece = "O" if piece == "X" else "X"
            for col in valid_cols:
                temp_board = [row[:] for row in board]
                self.drop_piece(temp_board, col, opp_piece)
                new_score = self.minimax(
                    temp_board, depth - 1, alpha, beta, True, piece
                )[1]
                if new_score < value:
                    value = new_score
                    column = col
                beta = min(beta, value)
                if alpha >= beta:
                    break
            return column, value

    def find_best_move(self, piece: str = "X", depth: int = 4) -> Dict[str, Any]:
        """Find best move using minimax"""
        col, score = self.minimax(self.board, depth, -math.inf, math.inf, True, piece)

        return {
            "best_column": col,
            "score": score,
            "depth": depth,
            "algorithm": "minimax_alpha_beta",
        }
