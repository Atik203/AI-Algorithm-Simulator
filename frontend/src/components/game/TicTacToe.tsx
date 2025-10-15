/**
 * Tic-Tac-Toe Game with Minimax AI
 * Interactive game with AI opponent
 */

import { playGame, type GamePlayResponse } from "@/api/api";
import { AlgorithmInfoCard } from "@/components/common/AlgorithmInfoCard";
import {
  ConfigOption,
  ConfigurationPanel,
} from "@/components/common/ConfigurationPanel";
import { StatisticsPanel } from "@/components/common/StatisticsPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Brain,
  CircleDot,
  Gamepad2,
  RotateCcw,
  Trophy,
  X as XIcon,
} from "lucide-react";
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
  const [moveCount, setMoveCount] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);

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
    const startTime = performance.now();

    try {
      const response: GamePlayResponse = await playGame({
        game_type: "tic-tac-toe",
        action: "find_move",
        board: currentBoard,
        player,
        use_alpha_beta: algorithm === "alpha_beta",
      });

      const endTime = performance.now();
      setExecutionTime(endTime - startTime);

      if (response.best_move) {
        // Type guard to ensure best_move is a tuple
        if (Array.isArray(response.best_move)) {
          const [row, col] = response.best_move as [number, number];
          const newBoard = currentBoard.map((r) => [...r]);
          newBoard[row][col] = player;

          setBoard(newBoard);
          setMoveCount(moveCount + 1);
          setMoveEvaluations(response.evaluations || null);

          const gameWinner = checkWinner(newBoard);
          if (gameWinner) {
            setWinner(gameWinner);
            setGameOver(true);

            if (gameWinner === "draw") {
              toast.info("Game ended in a draw!");
            } else {
              toast.success(`${gameWinner} wins!`, {
                icon: <Trophy className="w-4 h-4" />,
              });
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
    setMoveCount(moveCount + 1);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameOver(true);

      if (gameWinner === "draw") {
        toast.info("Game ended in a draw!");
      } else {
        toast.success(`${gameWinner} wins!`, {
          icon: <Trophy className="w-4 h-4" />,
        });
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
    setMoveCount(0);
    setExecutionTime(0);
    toast.success("Game reset!");
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
          setMoveCount(i + 1);
        }

        setWinner(response.winner || null);
        setGameOver(true);

        if (response.winner === "draw") {
          toast.info("AI vs AI ended in a draw!");
        } else {
          toast.success(`AI (${response.winner}) wins!`, {
            icon: <Trophy className="w-4 h-4" />,
          });
        }
      }
    } catch (error: any) {
      toast.error("AI vs AI failed", {
        description: error.response?.data?.error || "Please try again",
      });
    }
  };

  // Configuration options
  const configOptions: ConfigOption[] = [
    {
      id: "gameMode",
      label: "Game Mode",
      type: "select",
      value: gameMode,
      onChange: (value) => {
        setGameMode(value as "pvai" | "aivai");
        if (value === "pvai") {
          resetGame();
        }
      },
      options: [
        { value: "pvai", label: "Player vs AI" },
        { value: "aivai", label: "AI vs AI" },
      ],
      disabled: !gameOver && moveCount > 0,
      description:
        gameMode === "pvai"
          ? "Play against the AI opponent"
          : "Watch AI play against itself",
    },
    {
      id: "algorithm",
      label: "AI Algorithm",
      type: "select",
      value: algorithm,
      onChange: (value) => setAlgorithm(value as "minimax" | "alpha_beta"),
      options: [
        { value: "minimax", label: "Minimax" },
        { value: "alpha_beta", label: "Alpha-Beta Pruning" },
      ],
      description:
        algorithm === "alpha_beta"
          ? "Uses pruning for faster computation"
          : "Classic Minimax algorithm",
    },
  ];

  // Create statistics
  const statistics = [
    {
      label: "Moves Made",
      value: moveCount,
      icon: CircleDot,
      color: "text-blue-500",
    },
    {
      label: "Current Player",
      value: gameOver ? "Game Over" : currentPlayer,
      icon: currentPlayer === "X" ? XIcon : CircleDot,
      color: currentPlayer === "X" ? "text-blue-500" : "text-red-500",
    },
    {
      label: "AI Evaluations",
      value: moveEvaluations?.length || 0,
      icon: Brain,
      color: "text-purple-500",
    },
    {
      label: "Last AI Time",
      value: executionTime > 0 ? `${executionTime.toFixed(0)}ms` : "-",
      icon: RotateCcw,
      color: "text-green-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Algorithm Info Card */}
      <AlgorithmInfoCard
        title="Tic-Tac-Toe AI"
        description="Classic Tic-Tac-Toe game with perfect-play AI using Minimax algorithm with optional Alpha-Beta pruning. The AI evaluates all possible game states to make optimal moves."
        icon={<Gamepad2 className="w-6 h-6 text-white" />}
        goal="Get three in a row horizontally, vertically, or diagonally"
        timeComplexity="O(b^d) where b=9, d≤9 (Alpha-Beta: O(b^(d/2)))"
        spaceComplexity="O(d) for recursion stack"
        features={[
          "Minimax algorithm for perfect play",
          "Alpha-Beta pruning optimization",
          "Player vs AI and AI vs AI modes",
          "Real-time move evaluation display",
        ]}
      />

      {/* Configuration Panel */}
      <ConfigurationPanel
        title="Game Configuration"
        options={configOptions}
        columns={2}
      />

      {/* Game Board */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Status Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {thinking ? (
                <div className="flex items-center gap-2 text-blue-500">
                  <Brain className="w-5 h-5 animate-pulse" />
                  <span className="font-semibold">AI Thinking...</span>
                </div>
              ) : gameOver ? (
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-lg">
                    {winner === "draw" ? "Game Draw!" : `${winner} Wins!`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {currentPlayer === "X" ? (
                    <XIcon className="w-5 h-5 text-blue-500" />
                  ) : (
                    <CircleDot className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-semibold">
                    {currentPlayer}'s Turn
                    {gameMode === "pvai" && currentPlayer === "X" && " (You)"}
                    {gameMode === "pvai" && currentPlayer === "O" && " (AI)"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetGame}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              {gameMode === "aivai" && (
                <Button
                  size="sm"
                  onClick={startAIvsAI}
                  disabled={!gameOver && moveCount > 0}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {!gameOver && moveCount > 0 ? "Playing..." : "Start AI vs AI"}
                </Button>
              )}
            </div>
          </div>

          {/* Tic-Tac-Toe Board */}
          <div className="aspect-square max-w-md mx-auto">
            <div className="grid grid-cols-3 gap-3 h-full">
              {board.map((row, i) =>
                row.map((cell, j) => (
                  <motion.button
                    key={`${i}-${j}`}
                    className={`flex items-center justify-center text-5xl font-bold rounded-xl border-4 transition-all ${
                      cell === ""
                        ? "bg-secondary/20 border-secondary hover:bg-secondary/40"
                        : cell === "X"
                        ? "bg-blue-500/10 border-blue-500 text-blue-500"
                        : "bg-red-500/10 border-red-500 text-red-500"
                    } ${
                      thinking || gameOver || cell !== ""
                        ? "cursor-not-allowed"
                        : gameMode === "pvai" && currentPlayer === "X"
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    }`}
                    onClick={() => handleCellClick(i, j)}
                    disabled={
                      thinking ||
                      gameOver ||
                      cell !== "" ||
                      gameMode === "aivai"
                    }
                    whileHover={{
                      scale:
                        cell === "" &&
                        !thinking &&
                        !gameOver &&
                        gameMode === "pvai" &&
                        currentPlayer === "X"
                          ? 1.05
                          : 1,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {cell === "X" ? "❌" : cell === "O" ? "⭕" : ""}
                  </motion.button>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Real-time Statistics */}
      <StatisticsPanel title="Game Statistics" statistics={statistics} />

      {/* Move Evaluations */}
      {moveEvaluations && moveEvaluations.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Move Evaluations
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {moveEvaluations.slice(0, 9).map((evaluation: any, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-secondary/50 rounded-lg text-center hover:bg-secondary transition-colors"
              >
                <div className="font-medium text-sm">
                  Position ({evaluation.row}, {evaluation.col})
                </div>
                <div className="text-xs text-muted-foreground mt-1">
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
