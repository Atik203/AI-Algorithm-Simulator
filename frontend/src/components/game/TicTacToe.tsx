/**
 * Tic-Tac-Toe Game with Minimax AI
 * Interactive game with AI opponent
 */

import { playGame, type GamePlayResponse } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Brain, CircleDot, RotateCcw, User, X as XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Player = "X" | "O" | "";
type GameBoard = Player[][];

interface TicTacToeProps {
  onSave?: (data: any) => void;
}

export function TicTacToe({ onSave }: TicTacToeProps) {
  const [board, setBoard] = useState<GameBoard>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [gameMode, setGameMode] = useState<"pvai" | "aivai">("pvai");
  const [algorithm, setAlgorithm] = useState<"minimax" | "alpha_beta">(
    "alpha_beta"
  );
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [thinking, setThinking] = useState(false);
  const [moveEvaluations, setMoveEvaluations] = useState<any[] | null>(null);

  // Check winner
  const checkWinner = (currentBoard: GameBoard): Player | "draw" | null => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        currentBoard[i][0] &&
        currentBoard[i][0] === currentBoard[i][1] &&
        currentBoard[i][1] === currentBoard[i][2]
      ) {
        return currentBoard[i][0];
      }
    }

    // Check columns
    for (let j = 0; j < 3; j++) {
      if (
        currentBoard[0][j] &&
        currentBoard[0][j] === currentBoard[1][j] &&
        currentBoard[1][j] === currentBoard[2][j]
      ) {
        return currentBoard[0][j];
      }
    }

    // Check diagonals
    if (
      currentBoard[0][0] &&
      currentBoard[0][0] === currentBoard[1][1] &&
      currentBoard[1][1] === currentBoard[2][2]
    ) {
      return currentBoard[0][0];
    }

    if (
      currentBoard[0][2] &&
      currentBoard[0][2] === currentBoard[1][1] &&
      currentBoard[1][1] === currentBoard[2][0]
    ) {
      return currentBoard[0][2];
    }

    // Check draw
    if (currentBoard.every((row) => row.every((cell) => cell !== ""))) {
      return "draw";
    }

    return null;
  };

  // Make AI move
  const makeAIMove = async (currentBoard: GameBoard, player: "X" | "O") => {
    setThinking(true);

    try {
      const response: GamePlayResponse = await playGame({
        game_type: "tic-tac-toe",
        action: "find_move",
        board: currentBoard,
        player,
        use_alpha_beta: algorithm === "alpha_beta",
      });

      if (response.best_move) {
        // Type guard to ensure best_move is a tuple
        if (Array.isArray(response.best_move)) {
          const [row, col] = response.best_move as [number, number];
          const newBoard = currentBoard.map((r) => [...r]);
          newBoard[row][col] = player;

          setBoard(newBoard);
          setMoveEvaluations(response.evaluations || null);

          const gameWinner = checkWinner(newBoard);
          if (gameWinner) {
            setWinner(gameWinner);
            setGameOver(true);

            if (gameWinner === "draw") {
              toast.info("Game ended in a draw!");
            } else {
              toast.success(`${gameWinner} wins!`);
            }
          } else {
            setCurrentPlayer(player === "X" ? "O" : "X");
          }
        }
      }
    } catch (error: any) {
      toast.error("AI move failed", {
        description: error.response?.data?.error || "Please try again",
      });
    } finally {
      setThinking(false);
    }
  };

  // Handle cell click (player move)
  const handleCellClick = (row: number, col: number) => {
    if (gameOver || thinking || board[row][col] !== "") return;

    // In AI vs AI mode, don't allow manual moves
    if (gameMode === "aivai") return;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameOver(true);

      if (gameWinner === "draw") {
        toast.info("Game ended in a draw!");
      } else {
        toast.success(`${gameWinner} wins!`);
      }
    } else {
      const nextPlayer = currentPlayer === "X" ? "O" : "X";
      setCurrentPlayer(nextPlayer);

      // AI's turn
      setTimeout(() => {
        makeAIMove(newBoard, nextPlayer);
      }, 500);
    }
  };

  // Reset game
  const resetGame = () => {
    setBoard([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setCurrentPlayer("X");
    setGameOver(false);
    setWinner(null);
    setMoveEvaluations(null);
  };

  // Start AI vs AI game
  const startAIvsAI = async () => {
    resetGame();
    setGameMode("aivai");

    try {
      const response: GamePlayResponse = await playGame({
        game_type: "tic-tac-toe",
        action: "play_game",
        first_player: "X",
        use_alpha_beta: algorithm === "alpha_beta",
      });

      // Replay game history with animation
      if (response.game_history) {
        for (let i = 0; i < response.game_history.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          const move = response.game_history[i];
          setBoard(move.board);
          setCurrentPlayer(move.player === "X" ? "O" : "X");
        }

        setWinner(response.winner || null);
        setGameOver(true);

        if (response.winner === "draw") {
          toast.info("AI vs AI ended in a draw!");
        } else {
          toast.success(`AI (${response.winner}) wins!`);
        }
      }
    } catch (error: any) {
      toast.error("AI vs AI failed", {
        description: error.response?.data?.error || "Please try again",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Game Mode</Label>
              <Select
                value={gameMode}
                onValueChange={(value) =>
                  setGameMode(value as "pvai" | "aivai")
                }
                disabled={!gameOver}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pvai">Player vs AI</SelectItem>
                  <SelectItem value="aivai">AI vs AI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Algorithm</Label>
              <Select
                value={algorithm}
                onValueChange={(value) =>
                  setAlgorithm(value as "minimax" | "alpha_beta")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimax">Minimax</SelectItem>
                  <SelectItem value="alpha_beta">Alpha-Beta Pruning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={resetGame} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              {gameMode === "aivai" && (
                <Button
                  onClick={startAIvsAI}
                  disabled={!gameOver}
                  className="flex-1"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Start
                </Button>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between px-2 py-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2">
              {thinking ? (
                <>
                  <Brain className="h-5 w-5 animate-pulse text-blue-500" />
                  <span className="font-medium">AI is thinking...</span>
                </>
              ) : gameOver ? (
                <>
                  <span className="text-2xl">
                    {winner === "draw" ? "🤝" : winner === "X" ? "❌" : "⭕"}
                  </span>
                  <span className="font-medium">
                    {winner === "draw" ? "Draw!" : `${winner} Wins!`}
                  </span>
                </>
              ) : (
                <>
                  {currentPlayer === "X" ? (
                    <XIcon className="h-5 w-5 text-blue-500" />
                  ) : (
                    <CircleDot className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">Current: {currentPlayer}</span>
                  {gameMode === "pvai" && currentPlayer === "X" && (
                    <User className="h-4 w-4 ml-1" />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Game Board */}
      <Card className="p-8">
        <div className="aspect-square max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-3 h-full">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <motion.button
                  key={`${i}-${j}`}
                  className={`flex items-center justify-center text-5xl font-bold rounded-xl border-4 transition-all ${
                    cell === ""
                      ? "bg-secondary/20 border-secondary hover:bg-secondary/40 hover:scale-105"
                      : cell === "X"
                      ? "bg-blue-500/10 border-blue-500 text-blue-500"
                      : "bg-red-500/10 border-red-500 text-red-500"
                  } ${
                    thinking || gameOver
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() => handleCellClick(i, j)}
                  disabled={thinking || gameOver || cell !== ""}
                  whileHover={{
                    scale: cell === "" && !thinking && !gameOver ? 1.05 : 1,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cell === "X" ? "❌" : cell === "O" ? "⭕" : ""}
                </motion.button>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Move Evaluations */}
      {moveEvaluations && moveEvaluations.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">AI Move Evaluations</h3>
          <div className="grid grid-cols-3 gap-2">
            {moveEvaluations.slice(0, 9).map((evaluation: any, idx: number) => (
              <div
                key={idx}
                className="p-2 bg-secondary/50 rounded text-center text-sm"
              >
                <div className="font-medium">
                  ({evaluation.row}, {evaluation.col})
                </div>
                <div className="text-xs text-muted-foreground">
                  Score: {evaluation.score}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
