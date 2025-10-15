/**
 * Sudoku Visualizer Component
 * Interactive 9x9 Sudoku puzzle solver with step-by-step visualization
 */

import { solvePuzzle, type PuzzleSolveResponse } from "@/api/api";
import { AlgorithmInfoCard } from "@/components/common/AlgorithmInfoCard";
import { ControlPanel } from "@/components/common/ControlPanel";
import { StatisticsPanel } from "@/components/common/StatisticsPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  Grid3x3,
  Hash,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
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
  const [speed, setSpeed] = useState(1);
  const [executionTime, setExecutionTime] = useState(0);
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
    const startTime = performance.now();

    try {
      const response = await solvePuzzle({
        puzzle_type: "sudoku",
        board: board,
      });

      const endTime = performance.now();
      setExecutionTime(endTime - startTime);

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
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, solution, speed]);

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

  // Create statistics
  const statistics = solution
    ? [
        {
          label: "Status",
          value: solution.solved ? "✓ Solved" : "✗ No Solution",
          icon: Target,
          color: solution.solved ? "text-green-500" : "text-red-500",
        },
        {
          label: "States Explored",
          value: solution.nodes_explored.toLocaleString(),
          icon: Activity,
          color: "text-blue-500",
        },
        {
          label: "Initial Clues",
          value: initialBoard.flat().filter((cell) => cell !== 0).length,
          icon: Hash,
          color: "text-purple-500",
        },
        {
          label: "Execution Time",
          value:
            executionTime > 1000
              ? `${(executionTime / 1000).toFixed(2)}s`
              : `${executionTime.toFixed(0)}ms`,
          icon: Clock,
          color: "text-green-500",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Algorithm Info Card */}
      <AlgorithmInfoCard
        title="Sudoku Solver"
        description="Classic 9x9 Sudoku puzzle solver using backtracking algorithm with constraint propagation. Each row, column, and 3x3 box must contain digits 1-9 without repetition. The algorithm systematically tries values and backtracks when conflicts are detected."
        icon={<Grid3x3 className="w-6 h-6 text-white" />}
        goal="Fill 9x9 grid so each row, column, and 3x3 box contains 1-9"
        timeComplexity="O(9^(n*n)) worst case, much faster with pruning"
        spaceComplexity="O(n*n) for the board and recursion stack"
        features={[
          "Backtracking with constraint propagation",
          "Instant conflict detection",
          "Step-by-step solution visualization",
          "Sample puzzles (Easy & Medium)",
          "Manual input support",
        ]}
      />

      {/* Sample Puzzles and Actions */}
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Sample Puzzles
            </h4>
            <div className="flex gap-2">
              {SAMPLE_PUZZLES.map((puzzle, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant="outline"
                  onClick={() => loadSamplePuzzle(idx)}
                  disabled={solving || isPlaying}
                  className="flex-1"
                >
                  {puzzle.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={solveSudoku}
              disabled={solving || isPlaying}
              className="flex-1"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {solving ? "Solving..." : "Solve Puzzle"}
            </Button>
            <Button
              variant="outline"
              onClick={clearBoard}
              disabled={solving || isPlaying}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Board
            </Button>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Tip:</strong> Click cells to enter numbers (1-9) or load a
              sample puzzle. Click Solve to watch the backtracking algorithm
              find the solution!
            </p>
          </div>
        </div>
      </Card>

      {/* Control Panel */}
      {solution && solution.steps && solution.steps.length > 0 && (
        <ControlPanel
          isPlaying={isPlaying}
          isPaused={!isPlaying && currentStep > 0}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onReset={() => {
            setCurrentStep(0);
            setIsPlaying(false);
            toast.success("Reset to start");
          }}
          onStepForward={() => {
            if (currentStep < solution.steps.length - 1) {
              setCurrentStep(currentStep + 1);
            }
          }}
          onStepBackward={() => {
            if (currentStep > 0) {
              setCurrentStep(currentStep - 1);
            }
          }}
          speed={speed}
          onSpeedChange={setSpeed}
          currentStep={currentStep}
          totalSteps={solution.steps.length - 1}
          disabled={solving}
          showStepControls={true}
          showSpeedControl={true}
        />
      )}

      {/* Step Info Badge */}
      {stepInfo && (
        <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">Current Action:</span>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-sm font-medium">
              {stepInfo.type === "placing" && `🔹 Placing ${stepInfo.value}`}
              {stepInfo.type === "backtracking" && "🔙 Backtracking"}
              {stepInfo.type === "trying" && `🔍 Trying ${stepInfo.value}`}
              {stepInfo.type === "solution" && "✅ Solution Found!"}
            </span>
            {stepInfo.row !== undefined && stepInfo.col !== undefined && (
              <span className="text-sm text-muted-foreground">
                at Cell ({stepInfo.row + 1}, {stepInfo.col + 1})
              </span>
            )}
          </div>
        </Card>
      )}

      {/* Sudoku Grid */}
      <Card className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-9 gap-0 border-4 border-gray-800 dark:border-gray-200 rounded-lg overflow-hidden">
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
                          : "border-t border-t-gray-300 dark:border-t-gray-700"
                      }
                      ${
                        isThickLeft && j !== 0
                          ? "border-l-2 border-l-gray-800 dark:border-l-gray-200"
                          : "border-l border-l-gray-300 dark:border-l-gray-700"
                      }
                      ${
                        isHighlighted
                          ? "bg-blue-200 dark:bg-blue-900 animate-pulse"
                          : "bg-white dark:bg-gray-900"
                      }
                      ${
                        !isInitial && !solution
                          ? "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                          : ""
                      }
                    `}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (i * 9 + j) * 0.005 }}
                    whileHover={!isInitial && !solution ? { scale: 1.05 } : {}}
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
                          className="w-full h-full text-center text-xl border-0 bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-blue-500"
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

        {/* Solution Status */}
        {solution && (
          <div className="mt-6 text-center">
            {solution.solved ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                <span className="text-2xl">✓</span>
                <span className="font-semibold">Sudoku Solved!</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                <span className="text-2xl">⚠</span>
                <span className="font-semibold">No Solution Found</span>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Real-time Statistics */}
      {solution && statistics.length > 0 && (
        <StatisticsPanel title="Real-time Statistics" statistics={statistics} />
      )}
    </div>
  );
}
