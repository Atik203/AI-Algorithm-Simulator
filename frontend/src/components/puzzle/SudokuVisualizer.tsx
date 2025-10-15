/**
 * Sudoku Visualizer Component
 * Interactive 9x9 Sudoku puzzle solver with step-by-step visualization
 */

import { solvePuzzle, type PuzzleSolveResponse } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SudokuVisualizerProps {
  onSave?: (data: any) => void;
}

// Sample Sudoku puzzles (0 represents empty cells)
const SAMPLE_PUZZLES = [
  {
    name: "Easy",
    puzzle: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
  },
  {
    name: "Medium",
    puzzle: [
      [0, 0, 0, 6, 0, 0, 4, 0, 0],
      [7, 0, 0, 0, 0, 3, 6, 0, 0],
      [0, 0, 0, 0, 9, 1, 0, 8, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 5, 0, 1, 8, 0, 0, 0, 3],
      [0, 0, 0, 3, 0, 6, 0, 4, 5],
      [0, 4, 0, 2, 0, 0, 0, 6, 0],
      [9, 0, 3, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 1, 0, 0],
    ],
  },
];

export function SudokuVisualizer({ onSave }: SudokuVisualizerProps) {
  const [board, setBoard] = useState<number[][]>(() =>
    Array(9)
      .fill(0)
      .map(() => Array(9).fill(0))
  );
  const [initialBoard, setInitialBoard] = useState<number[][]>(() =>
    Array(9)
      .fill(0)
      .map(() => Array(9).fill(0))
  );
  const [solving, setSolving] = useState(false);
  const [solution, setSolution] = useState<PuzzleSolveResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [focusedCell, setFocusedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Load sample puzzle
  const loadSamplePuzzle = (puzzleIndex: number) => {
    const puzzle = SAMPLE_PUZZLES[puzzleIndex].puzzle;
    setBoard(puzzle.map((row) => [...row]));
    setInitialBoard(puzzle.map((row) => [...row]));
    setSolution(null);
    setCurrentStep(0);
    setIsPlaying(false);
    toast.success(`${SAMPLE_PUZZLES[puzzleIndex].name} puzzle loaded`);
  };

  // Clear board
  const clearBoard = () => {
    const emptyBoard = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0));
    setBoard(emptyBoard);
    setInitialBoard(emptyBoard);
    setSolution(null);
    setCurrentStep(0);
    setIsPlaying(false);
    toast.info("Board cleared");
  };

  // Handle cell input
  const handleCellChange = (row: number, col: number, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0 || numValue > 9) return;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = numValue;
    setBoard(newBoard);
    setInitialBoard(newBoard.map((r) => [...r]));
  };

  // Solve Sudoku
  const solveSudoku = async () => {
    // Check if board has at least some clues
    const clueCount = board.flat().filter((cell) => cell !== 0).length;
    if (clueCount < 17) {
      toast.error("Invalid puzzle", {
        description: "A valid Sudoku needs at least 17 clues",
      });
      return;
    }

    setSolving(true);
    setCurrentStep(0);
    setIsPlaying(false);

    try {
      const response = await solvePuzzle({
        puzzle_type: "sudoku",
        board: board,
      });

      setSolution(response);

      if (response.solved) {
        toast.success("Sudoku solved!", {
          description: `Explored ${response.nodes_explored} states`,
        });
      } else {
        toast.warning("No solution found", {
          description: "This puzzle may be invalid",
        });
      }
    } catch (error: any) {
      toast.error("Failed to solve Sudoku", {
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
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying, solution]);

  // Get current board state
  const getCurrentBoard = () => {
    if (!solution || !solution.steps || currentStep === 0) {
      return board;
    }
    return solution.steps[currentStep].board || board;
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
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <Label>Sample Puzzles</Label>
              <div className="flex gap-2 mt-2">
                {SAMPLE_PUZZLES.map((puzzle, idx) => (
                  <Button
                    key={idx}
                    size="sm"
                    variant="outline"
                    onClick={() => loadSamplePuzzle(idx)}
                    disabled={solving || isPlaying}
                  >
                    {puzzle.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 items-end ml-auto">
              <Button
                size="sm"
                onClick={solveSudoku}
                disabled={solving || isPlaying}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {solving ? "Solving..." : "Solve"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearBoard}
                disabled={solving || isPlaying}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Playback Controls */}
          {solution && solution.steps && solution.steps.length > 0 && (
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
                      {stepInfo.type === "placing" &&
                        `Placing ${stepInfo.value}`}
                      {stepInfo.type === "backtracking" && "Backtracking"}
                      {stepInfo.type === "trying" && `Trying ${stepInfo.value}`}
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
            </div>
          )}

          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Tip:</strong> Click on cells to enter numbers (1-9), or
              load a sample puzzle. Click Solve to see the backtracking
              algorithm in action!
            </p>
          </div>
        </div>
      </Card>

      {/* Sudoku Grid */}
      <Card className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-9 gap-0 border-4 border-gray-800 dark:border-gray-200">
            {displayBoard.map((row: number[], i: number) =>
              row.map((cell: number, j: number) => {
                const isInitial = initialBoard[i][j] !== 0;
                const isHighlighted =
                  stepInfo && stepInfo.row === i && stepInfo.col === j;
                const isThickTop = i % 3 === 0;
                const isThickLeft = j % 3 === 0;

                return (
                  <motion.div
                    key={`${i}-${j}`}
                    className={`
                      aspect-square flex items-center justify-center relative
                      ${
                        isThickTop && i !== 0
                          ? "border-t-2 border-t-gray-800 dark:border-t-gray-200"
                          : "border-t border-t-gray-300"
                      }
                      ${
                        isThickLeft && j !== 0
                          ? "border-l-2 border-l-gray-800 dark:border-l-gray-200"
                          : "border-l border-l-gray-300"
                      }
                      ${i === 8 ? "" : ""}
                      ${j === 8 ? "" : ""}
                      ${
                        isHighlighted
                          ? "bg-blue-200 dark:bg-blue-900"
                          : "bg-white dark:bg-gray-900"
                      }
                      ${
                        !isInitial && !solution
                          ? "hover:bg-gray-100 dark:hover:bg-gray-800"
                          : ""
                      }
                    `}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (i * 9 + j) * 0.005 }}
                  >
                    {cell !== 0 ? (
                      <span
                        className={`text-xl md:text-2xl font-semibold ${
                          isInitial
                            ? "text-gray-900 dark:text-gray-100"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {cell}
                      </span>
                    ) : (
                      !solution && (
                        <Input
                          type="text"
                          maxLength={1}
                          className="w-full h-full text-center text-xl border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          value=""
                          onChange={(e) =>
                            handleCellChange(i, j, e.target.value)
                          }
                          onFocus={() => setFocusedCell({ row: i, col: j })}
                          onBlur={() => setFocusedCell(null)}
                        />
                      )
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
                States Explored
              </div>
              <div className="text-lg font-semibold">
                {solution.nodes_explored}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Algorithm</div>
              <div className="text-lg font-semibold">Backtracking</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Initial Clues</div>
              <div className="text-lg font-semibold">
                {initialBoard.flat().filter((cell) => cell !== 0).length}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
