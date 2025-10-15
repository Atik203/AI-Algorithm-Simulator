/**
 * N-Queens Visualizer Component
 * Place N queens on an NxN chessboard without conflicts
 */

import { solvePuzzle, type PuzzleSolveResponse } from "@/api/api";
import { AlgorithmInfoCard } from "@/components/common/AlgorithmInfoCard";
import {
  ConfigOption,
  ConfigurationPanel,
} from "@/components/common/ConfigurationPanel";
import { ControlPanel } from "@/components/common/ControlPanel";
import { StatisticsPanel } from "@/components/common/StatisticsPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  Crown,
  Hand,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
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
  const [speed, setSpeed] = useState(1);
  const [manualMode, setManualMode] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
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
    const startTime = performance.now();

    try {
      const response = await solvePuzzle({
        puzzle_type: "n-queens",
        board_size: boardSize,
        find_all: false, // Just find one solution
      });

      const endTime = performance.now();
      setExecutionTime(endTime - startTime);

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
    }, 1000 / speed);

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

  // Configuration options
  const configOptions: ConfigOption[] = [
    {
      id: "boardSize",
      label: "Board Size (N x N)",
      type: "slider",
      value: boardSize,
      onChange: (value: number) => {
        setBoardSize(value);
        setSolution(null);
        setCurrentStep(0);
      },
      min: 4,
      max: 12,
      step: 1,
      disabled: solving || isPlaying,
      description: `${boardSize}x${boardSize} chessboard with ${boardSize} queens`,
    },
  ];

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
          label: "Solutions Found",
          value: solution.solution_count || 0,
          icon: Crown,
          color: "text-yellow-500",
        },
        {
          label: "States Explored",
          value: solution.nodes_explored.toLocaleString(),
          icon: Activity,
          color: "text-blue-500",
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
        {
          label: "Current Step",
          value: `${currentStep} / ${solution.steps?.length || 0}`,
          icon: TrendingUp,
          color: "text-purple-500",
        },
        {
          label: "Board Size",
          value: `${boardSize}x${boardSize}`,
          icon: Target,
          color: "text-orange-500",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Algorithm Info Card */}
      <AlgorithmInfoCard
        title="N-Queens Problem"
        description="Classic constraint satisfaction problem where N chess queens must be placed on an N×N chessboard so that no two queens threaten each other. Uses backtracking algorithm to systematically explore all possible configurations."
        icon={<Crown className="w-6 h-6 text-white" />}
        goal="Place N queens on N×N board with no conflicts (same row, column, or diagonal)"
        timeComplexity="O(N!) - factorial time for backtracking"
        spaceComplexity="O(N) - recursion stack and board state"
        features={[
          "Backtracking algorithm with constraint checking",
          "Real-time visualization of queen placement",
          "Manual mode for interactive puzzle solving",
          "Step-by-step solution animation",
          "Detects conflicts automatically",
        ]}
      />

      {/* Configuration Panel */}
      <ConfigurationPanel
        title="Configuration"
        options={configOptions}
        columns={1}
      />

      {/* Mode Toggle and Actions */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={manualMode ? "default" : "outline"}
              onClick={toggleMode}
              disabled={solving || isPlaying}
              className="flex-1"
            >
              <Hand className="h-4 w-4 mr-2" />
              {manualMode ? "Manual Mode Active" : "Switch to Manual"}
            </Button>

            {!manualMode && (
              <Button
                size="sm"
                onClick={solveNQueens}
                disabled={solving || isPlaying}
                className="flex-1"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {solving ? "Solving..." : "Solve Puzzle"}
              </Button>
            )}

            {manualMode && (
              <Button
                size="sm"
                variant="outline"
                onClick={clearManualBoard}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Board
              </Button>
            )}
          </div>

          {manualMode && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Manual Mode:</strong> Click squares to place/remove
                queens. Invalid placements are automatically blocked. Place all{" "}
                {boardSize} queens without conflicts to solve!
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Control Panel */}
      {!manualMode &&
        solution &&
        solution.steps &&
        solution.steps.length > 0 && (
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
      {!manualMode && stepInfo && (
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-semibold">Current Action:</span>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-sm font-medium">
              {stepInfo.type === "placing" && "🔹 Placing Queen"}
              {stepInfo.type === "backtracking" && "🔙 Backtracking"}
              {stepInfo.type === "trying" && "🔍 Trying Position"}
              {stepInfo.type === "solution" && "✅ Solution Found!"}
            </span>
            {stepInfo.row !== undefined && stepInfo.col !== undefined && (
              <span className="text-sm text-muted-foreground">
                at ({stepInfo.row + 1}, {stepInfo.col + 1})
              </span>
            )}
          </div>
        </Card>
      )}

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

        {/* Manual Mode Stats */}
        {manualMode && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
              <Crown className="w-5 h-5" />
              <span className="font-semibold">
                Queens Placed:{" "}
                {manualBoard.flat().filter((c) => c === 1).length} / {boardSize}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Real-time Statistics */}
      {!manualMode && solution && statistics.length > 0 && (
        <StatisticsPanel title="Real-time Statistics" statistics={statistics} />
      )}
    </div>
  );
}
