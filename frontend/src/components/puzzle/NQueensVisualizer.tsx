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
import { motion } from "framer-motion";
import { Crown, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
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
    }, 300);

    return () => clearInterval(interval);
  }, [isPlaying, solution]);

  // Get current board state
  const getCurrentBoard = () => {
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
                onClick={solveNQueens}
                disabled={solving || isPlaying}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {solving ? "Solving..." : "Solve"}
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
                    }`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (i * boardSize + j) * 0.01 }}
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
