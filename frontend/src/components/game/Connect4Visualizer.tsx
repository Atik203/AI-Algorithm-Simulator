/**
 * Connect4 Visualizer Component
 * Classic Connect 4 game with AI opponent using Minimax + Alpha-Beta Pruning
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
import { Slider } from "@/components/ui/slider";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  CircleDot,
  Clock,
  Info,
  RotateCcw,
  Target,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Player = "X" | "O" | " ";
type GameBoard = Player[][];

interface Connect4VisualizerProps {
  onSave?: (data: any) => void;
}

const ROWS = 6;
const COLS = 7;

export function Connect4Visualizer({ onSave }: Connect4VisualizerProps) {
  // Game State
  const [board, setBoard] = useState<GameBoard>(
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(" "))
  );
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [gameMode, setGameMode] = useState<"pvai" | "aivai">("pvai");
  const [aiDepth, setAiDepth] = useState(4);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [thinking, setThinking] = useState(false);
  const [humanPlayer, setHumanPlayer] = useState<"X" | "O">("X");

  // Statistics
  const [moveHistory, setMoveHistory] = useState<
    Array<{ player: Player; col: number; timestamp: number }>
  >([]);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [nodesExplored, setNodesExplored] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);

  // Animation
  const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(
    null
  );
  const [winningCells, setWinningCells] = useState<
    Array<{ row: number; col: number }>
  >([]);

  // Check for winner
  const checkWinner = (
    currentBoard: GameBoard
  ): {
    winner: Player | "draw" | null;
    cells: Array<{ row: number; col: number }>;
  } => {
    // Check horizontal
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        if (
          currentBoard[row][col] !== " " &&
          currentBoard[row][col] === currentBoard[row][col + 1] &&
          currentBoard[row][col] === currentBoard[row][col + 2] &&
          currentBoard[row][col] === currentBoard[row][col + 3]
        ) {
          return {
            winner: currentBoard[row][col],
            cells: [
              { row, col },
              { row, col: col + 1 },
              { row, col: col + 2 },
              { row, col: col + 3 },
            ],
          };
        }
      }
    }

    // Check vertical
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 0; col < COLS; col++) {
        if (
          currentBoard[row][col] !== " " &&
          currentBoard[row][col] === currentBoard[row + 1][col] &&
          currentBoard[row][col] === currentBoard[row + 2][col] &&
          currentBoard[row][col] === currentBoard[row + 3][col]
        ) {
          return {
            winner: currentBoard[row][col],
            cells: [
              { row, col },
              { row: row + 1, col },
              { row: row + 2, col },
              { row: row + 3, col },
            ],
          };
        }
      }
    }

    // Check diagonal (down-right)
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        if (
          currentBoard[row][col] !== " " &&
          currentBoard[row][col] === currentBoard[row + 1][col + 1] &&
          currentBoard[row][col] === currentBoard[row + 2][col + 2] &&
          currentBoard[row][col] === currentBoard[row + 3][col + 3]
        ) {
          return {
            winner: currentBoard[row][col],
            cells: [
              { row, col },
              { row: row + 1, col: col + 1 },
              { row: row + 2, col: col + 2 },
              { row: row + 3, col: col + 3 },
            ],
          };
        }
      }
    }

    // Check diagonal (down-left)
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 3; col < COLS; col++) {
        if (
          currentBoard[row][col] !== " " &&
          currentBoard[row][col] === currentBoard[row + 1][col - 1] &&
          currentBoard[row][col] === currentBoard[row + 2][col - 2] &&
          currentBoard[row][col] === currentBoard[row + 3][col - 3]
        ) {
          return {
            winner: currentBoard[row][col],
            cells: [
              { row, col },
              { row: row + 1, col: col - 1 },
              { row: row + 2, col: col - 2 },
              { row: row + 3, col: col - 3 },
            ],
          };
        }
      }
    }

    // Check for draw
    if (currentBoard.every((row) => row.every((cell) => cell !== " "))) {
      return { winner: "draw", cells: [] };
    }

    return { winner: null, cells: [] };
  };

  // Drop piece in column
  const dropPiece = (
    currentBoard: GameBoard,
    col: number,
    player: Player
  ): number | null => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (currentBoard[row][col] === " ") {
        return row;
      }
    }
    return null;
  };

  // Make AI move
  const makeAIMove = async (currentBoard: GameBoard, player: "X" | "O") => {
    setThinking(true);
    const startTime = performance.now();

    try {
      const response: GamePlayResponse = await playGame({
        game_type: "connect4",
        board: currentBoard,
        piece: player,
        depth: aiDepth,
      });

      const endTime = performance.now();
      setExecutionTime(endTime - startTime);

      if (response.best_column !== undefined) {
        const col = response.best_column;
        const row = dropPiece(currentBoard, col, player);

        if (row !== null) {
          const newBoard = currentBoard.map((r) => [...r]);
          newBoard[row][col] = player;

          setBoard(newBoard);
          setLastMove({ row, col });
          setAiScore(response.score || null);
          setNodesExplored((prev) => prev + Math.pow(7, aiDepth)); // Approximation

          // Add to move history
          setMoveHistory((prev) => [
            ...prev,
            { player, col, timestamp: Date.now() },
          ]);

          const result = checkWinner(newBoard);
          if (result.winner) {
            setWinner(result.winner);
            setGameOver(true);
            setWinningCells(result.cells);

            if (result.winner === "draw") {
              toast.info("Game ended in a draw!", {
                description: "No more moves available",
              });
            } else {
              toast.success(`${result.winner} wins!`, {
                description: "Four in a row!",
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

  // Handle column click
  const handleColumnClick = (col: number) => {
    if (gameOver || thinking) return;

    // In AI vs AI mode, don't allow manual moves
    if (gameMode === "aivai") return;

    // In PvAI mode, only allow moves when it's human's turn
    if (gameMode === "pvai" && currentPlayer !== humanPlayer) return;

    const row = dropPiece(board, col, currentPlayer);
    if (row === null) {
      toast.warning("Column is full", {
        description: "Choose another column",
      });
      return;
    }

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    setLastMove({ row, col });

    // Add to move history
    setMoveHistory((prev) => [
      ...prev,
      { player: currentPlayer, col, timestamp: Date.now() },
    ]);

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setGameOver(true);
      setWinningCells(result.cells);

      if (result.winner === "draw") {
        toast.info("Game ended in a draw!");
      } else {
        toast.success(`${result.winner} wins!`, {
          icon: <Trophy className="w-4 h-4" />,
        });
      }
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  // Auto-play AI moves
  useEffect(() => {
    if (gameOver || thinking) return;

    const aiPlayer =
      gameMode === "pvai" ? (humanPlayer === "X" ? "O" : "X") : currentPlayer;

    if (
      (gameMode === "pvai" && currentPlayer !== humanPlayer) ||
      gameMode === "aivai"
    ) {
      const timer = setTimeout(() => {
        makeAIMove(board, aiPlayer);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameOver, gameMode, humanPlayer, thinking]);

  // Reset game
  const resetGame = () => {
    setBoard(
      Array(ROWS)
        .fill(null)
        .map(() => Array(COLS).fill(" "))
    );
    setCurrentPlayer("X");
    setGameOver(false);
    setWinner(null);
    setThinking(false);
    setLastMove(null);
    setWinningCells([]);
    setMoveHistory([]);
    setAiScore(null);
    setNodesExplored(0);
    setExecutionTime(0);
    toast.success("Game reset!");
  };

  // Check if cell is winning
  const isWinningCell = (row: number, col: number) => {
    return winningCells.some((cell) => cell.row === row && cell.col === col);
  };

  return (
    <div className="space-y-6">
      {/* Algorithm Info Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500 dark:bg-blue-600 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Connect 4 AI</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Classic strategy game using Minimax algorithm with Alpha-Beta
              pruning for optimal move selection. The AI evaluates positions by
              checking horizontal, vertical, and diagonal patterns.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span>
                  <strong>Goal:</strong> Connect 4 pieces in a row
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>
                  <strong>Complexity:</strong> O(b^d) where b=7, d=depth
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Configuration Panel */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Game Mode</Label>
            <Select
              value={gameMode}
              onValueChange={(value: "pvai" | "aivai") => {
                setGameMode(value);
                resetGame();
              }}
              disabled={!gameOver && moveHistory.length > 0}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pvai">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Player vs AI
                  </div>
                </SelectItem>
                <SelectItem value="aivai">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI vs AI
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {gameMode === "pvai" && (
            <div className="space-y-2">
              <Label>You Play As</Label>
              <Select
                value={humanPlayer}
                onValueChange={(value: "X" | "O") => {
                  setHumanPlayer(value);
                  resetGame();
                }}
                disabled={!gameOver && moveHistory.length > 0}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="X">Red (X) - Goes First</SelectItem>
                  <SelectItem value="O">Yellow (O) - Goes Second</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>AI Difficulty (Search Depth: {aiDepth})</Label>
            <Slider
              value={[aiDepth]}
              onValueChange={([value]) => setAiDepth(value)}
              min={1}
              max={6}
              step={1}
              className="w-full"
              disabled={!gameOver && moveHistory.length > 0}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Easy</span>
              <span>Medium</span>
              <span>Hard</span>
            </div>
          </div>
        </div>
      </Card>

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
                  <span className="font-semibold">
                    {winner === "draw" ? "Game Draw!" : `${winner} Wins!`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CircleDot
                    className={`w-5 h-5 ${
                      currentPlayer === "X" ? "text-red-500" : "text-yellow-500"
                    }`}
                  />
                  <span className="font-semibold">
                    {currentPlayer}'s Turn
                    {gameMode === "pvai" &&
                      currentPlayer === humanPlayer &&
                      " (You)"}
                    {gameMode === "pvai" &&
                      currentPlayer !== humanPlayer &&
                      " (AI)"}
                  </span>
                </div>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={resetGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Connect 4 Board */}
          <div className="inline-block bg-blue-600 p-4 rounded-lg shadow-2xl">
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: COLS }).map((_, col) => (
                <div key={col} className="flex flex-col gap-2">
                  {Array.from({ length: ROWS }).map((_, row) => {
                    const piece = board[row][col];
                    const isLastMoveCell =
                      lastMove?.row === row && lastMove?.col === col;
                    const isWinning = isWinningCell(row, col);

                    return (
                      <motion.button
                        key={`${row}-${col}`}
                        onClick={() => handleColumnClick(col)}
                        disabled={gameOver || thinking || piece !== " "}
                        className={`
                          w-12 h-12 rounded-full relative
                          ${
                            piece === " "
                              ? "bg-blue-800 hover:bg-blue-700"
                              : piece === "X"
                              ? "bg-red-500"
                              : "bg-yellow-400"
                          }
                          ${
                            gameMode === "pvai" &&
                            !gameOver &&
                            currentPlayer === humanPlayer &&
                            piece === " "
                              ? "cursor-pointer hover:scale-105"
                              : "cursor-not-allowed"
                          }
                          ${isWinning ? "ring-4 ring-white animate-pulse" : ""}
                          transition-all duration-200 shadow-inner
                        `}
                        whileHover={
                          !gameOver &&
                          gameMode === "pvai" &&
                          currentPlayer === humanPlayer &&
                          piece === " "
                            ? { scale: 1.1 }
                            : {}
                        }
                        whileTap={
                          !gameOver &&
                          gameMode === "pvai" &&
                          currentPlayer === humanPlayer &&
                          piece === " "
                            ? { scale: 0.95 }
                            : {}
                        }
                        initial={false}
                        animate={
                          isLastMoveCell
                            ? {
                                scale: [1, 1.2, 1],
                                transition: { duration: 0.3 },
                              }
                            : {}
                        }
                      >
                        <AnimatePresence>
                          {piece !== " " && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="absolute inset-0 rounded-full"
                            />
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Real-time Statistics */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Real-time Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Moves</p>
            <p className="text-2xl font-bold">{moveHistory.length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">AI Score</p>
            <p className="text-2xl font-bold">
              {aiScore !== null ? aiScore : "-"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Nodes Explored (Est.)
            </p>
            <p className="text-2xl font-bold">
              {nodesExplored.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Last AI Time</p>
            <p className="text-2xl font-bold">
              {executionTime > 0 ? `${executionTime.toFixed(0)}ms` : "-"}
            </p>
          </div>
        </div>
      </Card>

      {/* Move History */}
      {moveHistory.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Move History
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {moveHistory.map((move, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm p-2 bg-secondary/50 rounded"
              >
                <span className="font-mono">
                  Move {index + 1}: {move.player}
                </span>
                <span className="text-muted-foreground">
                  Column {move.col + 1}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
