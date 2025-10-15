/**
 * N-Queens Visualizer Component
 * Place N queens on an NxN chessboard without conflicts
 */

import { solvePuzzle, type PuzzleSolveResponse } from "@/api/api";
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
import { motion } from "framer-motion";
import {
  Crown,
  Hand,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface NQueensVisualizerProps {
  onSave?: (data: any) => void;
}

export function NQueensVisualizer({ onSave }: NQueensVisualizerProps) {
  const [boardSize, setBoardSize] = useState(8);
  const [solving, setSolving] = useState(false);
  const [solution, setSolution] = useState<PuzzleSolveResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300); // milliseconds per step
  const [manualMode, setManualMode] = useState(false);
  const [manualBoard, setManualBoard] = useState<number[][]>(() =>
    Array(8)
      .fill(0)
      .map(() => Array(8).fill(0))
  );

  // Reset manual board when board size changes
  useEffect(() => {
    setManualBoard(
      Array(boardSize)
        .fill(0)
        .map(() => Array(boardSize).fill(0))
    );
  }, [boardSize]);

  // Check if a position is under attack
  const isUnderAttack = (
    board: number[][],
    row: number,
    col: number
  ): boolean => {
    // Check row
    for (let j = 0; j < boardSize; j++) {
      if (j !== col && board[row][j] === 1) return true;
    }

    // Check column
    for (let i = 0; i < boardSize; i++) {
      if (i !== row && board[i][col] === 1) return true;
    }

    // Check diagonals
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (i !== row && j !== col && board[i][j] === 1) {
          if (Math.abs(i - row) === Math.abs(j - col)) return true;
        }
      }
    }

    return false;
  };

  // Handle manual queen placement
  const handleCellClick = (row: number, col: number) => {
    if (!manualMode) return;

    const newBoard = manualBoard.map((r) => [...r]);

    if (newBoard[row][col] === 1) {
      // Remove queen
      newBoard[row][col] = 0;
      setManualBoard(newBoard);
      toast.info("Queen removed");
    } else {
      // Check if placement is valid
      if (isUnderAttack(newBoard, row, col)) {
        toast.error("Invalid placement!", {
          description: "This queen would be under attack",
        });
        return;
      }

      // Place queen
      newBoard[row][col] = 1;
      setManualBoard(newBoard);

      // Check if solved
      const queensCount = newBoard.flat().filter((cell) => cell === 1).length;
      if (queensCount === boardSize) {
        toast.success("Congratulations!", {
          description: `You've successfully placed all ${boardSize} queens!`,
        });
      } else {
        toast.success("Queen placed!");
      }
    }
  };

  // Clear manual board
  const clearManualBoard = () => {
    setManualBoard(
      Array(boardSize)
        .fill(0)
        .map(() => Array(boardSize).fill(0))
    );
    toast.info("Board cleared");
  };

  // Toggle mode
  const toggleMode = () => {
    setManualMode(!manualMode);
    setSolution(null);
    setCurrentStep(0);
    setIsPlaying(false);
    if (manualMode) {
      clearManualBoard();
    }
  };

  // Solve N-Queens
  const solveNQueens = async () => {
    setSolving(true);
    setCurrentStep(0);
    setIsPlaying(false);

    try {
      const response = await solvePuzzle({
        puzzle_type: "n-queens",
        board_size: boardSize,
        find_all: false, // Just find one solution
      });

      setSolution(response);

      if (response.solved) {
        toast.success("Solution found!", {
          description: `Found ${response.solution_count} solution(s), explored ${response.nodes_explored} states`,
        });
      } else {
        toast.warning("No solution found");
      }
    } catch (error: any) {
      toast.error("Failed to solve N-Queens", {
        description: error.response?.data?.error || "Please try again",
      });
    } finally {
      setSolving(false);
    }
  };

  // Play animation
  useEffect(() => {
    if (!isPlaying || !solution || !solution.steps) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= solution.steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, solution, speed]);

  // Get current board state
  const getCurrentBoard = () => {
    if (manualMode) {
      return manualBoard;
    }

    if (!solution || !solution.steps || currentStep === 0) {
      // Empty board
      return Array(boardSize)
        .fill(0)
        .map(() => Array(boardSize).fill(0));
    }
    return (
      solution.steps[currentStep].state || solution.steps[currentStep].board
    );
  };

  // Get current step info
  const getCurrentStepInfo = () => {
    if (!solution || !solution.steps || currentStep === 0) {
      return null;
    }
    return solution.steps[currentStep];
  };

  const displayBoard = getCurrentBoard();
  const stepInfo = getCurrentStepInfo();

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Board Size (N x N)</Label>
              <Select
                value={boardSize.toString()}
                onValueChange={(value) => setBoardSize(parseInt(value))}
                disabled={solving || isPlaying}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4x4</SelectItem>
                  <SelectItem value="5">5x5</SelectItem>
                  <SelectItem value="6">6x6</SelectItem>
                  <SelectItem value="7">7x7</SelectItem>
                  <SelectItem value="8">8x8</SelectItem>
                  <SelectItem value="9">9x9</SelectItem>
                  <SelectItem value="10">10x10</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 items-end">
              <Button
                size="sm"
                variant={manualMode ? "default" : "outline"}
                onClick={toggleMode}
                disabled={solving || isPlaying}
              >
                <Hand className="h-4 w-4 mr-2" />
                {manualMode ? "Manual Mode" : "Auto Solve"}
              </Button>

              {!manualMode && (
                <Button
                  size="sm"
                  onClick={solveNQueens}
                  disabled={solving || isPlaying}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {solving ? "Solving..." : "Solve"}
                </Button>
              )}

              {manualMode && (
                <Button size="sm" variant="outline" onClick={clearManualBoard}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {manualMode && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Manual Mode:</strong> Click on squares to place or
                remove queens. Invalid placements will be blocked.
              </p>
            </div>
          )}

          {/* Playback Controls */}
          {!manualMode &&
            solution &&
            solution.steps &&
            solution.steps.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={currentStep >= solution.steps.length - 1}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setCurrentStep(0);
                    setIsPlaying(false);
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

                <div className="flex-1">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Step: </span>
                    {currentStep} / {solution.steps.length - 1}
                    {stepInfo && (
                      <span className="ml-2 text-xs px-2 py-1 rounded-full bg-secondary">
                        {stepInfo.type === "placing" && "Placing Queen"}
                        {stepInfo.type === "backtracking" && "Backtracking"}
                        {stepInfo.type === "trying" && "Trying Position"}
                        {stepInfo.type === "solution" && "✓ Solution Found"}
                      </span>
                    )}
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden mt-1">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (currentStep / (solution.steps.length - 1)) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="w-48">
                  <Label className="text-xs mb-2 block">Speed</Label>
                  <Slider
                    value={[speed]}
                    onValueChange={(value) => setSpeed(value[0])}
                    min={50}
                    max={1000}
                    step={50}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Fast</span>
                    <span>Slow</span>
                  </div>
                </div>
              </div>
            )}
        </div>
      </Card>

      {/* Chessboard */}
      <Card className="p-8">
        <div className="aspect-square max-w-2xl mx-auto">
          <div
            className="grid gap-1 h-full"
            style={{
              gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
            }}
          >
            {displayBoard.map((row: number[], i: number) =>
              row.map((cell: number, j: number) => {
                const isLight = (i + j) % 2 === 0;
                const hasQueen = cell === 1;
                const isCurrentPosition =
                  stepInfo && stepInfo.row === i && stepInfo.col === j;

                return (
                  <motion.div
                    key={`${i}-${j}`}
                    className={`flex items-center justify-center relative ${
                      isLight
                        ? "bg-amber-100 dark:bg-amber-900/30"
                        : "bg-amber-800 dark:bg-amber-950"
                    } ${
                      isCurrentPosition
                        ? "ring-4 ring-blue-500 ring-opacity-50"
                        : ""
                    } ${
                      manualMode
                        ? "cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                        : ""
                    }`}
                    onClick={() => handleCellClick(i, j)}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (i * boardSize + j) * 0.01 }}
                    whileHover={manualMode ? { scale: 1.05 } : {}}
                  >
                    {hasQueen && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-xl md:text-2xl"
                      >
                        <Crown
                          className={`w-6 h-6 md:w-8 md:h-8 ${
                            isLight ? "text-purple-600" : "text-yellow-400"
                          }`}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </Card>

      {/* Statistics */}
      {solution && (
        <Card className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="text-lg font-semibold">
                {solution.solved ? "✓ Solved" : "✗ No Solution"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Solutions Found
              </div>
              <div className="text-lg font-semibold">
                {solution.solution_count || 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                States Explored
              </div>
              <div className="text-lg font-semibold">
                {solution.nodes_explored}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Board Size</div>
              <div className="text-lg font-semibold">
                {boardSize}x{boardSize}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
