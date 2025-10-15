/**
 * 8-Puzzle Visualizer Component
 * Sliding tile puzzle with A* and BFS algorithms
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
import { Pause, Play, RotateCcw, Shuffle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EightPuzzleVisualizerProps {
  onSave?: (data: any) => void;
}

const GOAL_STATE = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0],
];

export function EightPuzzleVisualizer({ onSave }: EightPuzzleVisualizerProps) {
  const [board, setBoard] = useState<number[][]>([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0],
  ]);
  const [algorithm, setAlgorithm] = useState<"astar" | "bfs">("astar");
  const [solving, setSolving] = useState(false);
  const [solution, setSolution] = useState<PuzzleSolveResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Shuffle the board
  const shuffleBoard = () => {
    const newBoard = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 0],
    ];

    // Perform random moves
    for (let i = 0; i < 50; i++) {
      const moves = getValidMoves(newBoard);
      if (moves.length > 0) {
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        makeMove(newBoard, randomMove);
      }
    }

    setBoard(newBoard);
    setSolution(null);
    setCurrentStep(0);
    setIsPlaying(false);
    toast.success("Board shuffled!");
  };

  // Get valid moves for current board
  const getValidMoves = (currentBoard: number[][]): Array<[number, number]> => {
    const moves: Array<[number, number]> = [];
    let blankRow = 0;
    let blankCol = 0;

    // Find blank tile (0)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i][j] === 0) {
          blankRow = i;
          blankCol = j;
        }
      }
    }

    // Check all 4 directions
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [dr, dc] of directions) {
      const newRow = blankRow + dr;
      const newCol = blankCol + dc;

      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
        moves.push([newRow, newCol]);
      }
    }

    return moves;
  };

  // Make a move by swapping blank with target
  const makeMove = (currentBoard: number[][], [row, col]: [number, number]) => {
    let blankRow = 0;
    let blankCol = 0;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i][j] === 0) {
          blankRow = i;
          blankCol = j;
        }
      }
    }

    // Swap
    const temp = currentBoard[blankRow][blankCol];
    currentBoard[blankRow][blankCol] = currentBoard[row][col];
    currentBoard[row][col] = temp;
  };

  // Solve puzzle
  const solvePuzzleNow = async () => {
    setSolving(true);
    setCurrentStep(0);
    setIsPlaying(false);

    try {
      const response = await solvePuzzle({
        puzzle_type: "8-puzzle",
        algorithm,
        initial_state: board,
      });

      setSolution(response);

      if (response.solved) {
        toast.success("Solution found!", {
          description: `Solved in ${response.moves} moves, explored ${response.nodes_explored} nodes`,
        });
      } else {
        toast.warning("No solution found", {
          description: response.message || "Puzzle may be unsolvable",
        });
      }
    } catch (error: any) {
      toast.error("Failed to solve puzzle", {
        description: error.response?.data?.error || "Please try again",
      });
    } finally {
      setSolving(false);
    }
  };

  // Play animation
  useEffect(() => {
    if (!isPlaying || !solution || !solution.path) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= solution.path!.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, solution]);

  // Get current board state
  const getCurrentBoard = () => {
    if (!solution || !solution.path || currentStep === 0) {
      return board;
    }
    return solution.path[currentStep];
  };

  const displayBoard = getCurrentBoard();

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Algorithm</Label>
              <Select
                value={algorithm}
                onValueChange={(value) =>
                  setAlgorithm(value as "astar" | "bfs")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="astar">A* Search</SelectItem>
                  <SelectItem value="bfs">Breadth-First Search</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={shuffleBoard}
                disabled={solving || isPlaying}
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Shuffle
              </Button>

              <Button
                size="sm"
                onClick={solvePuzzleNow}
                disabled={solving || isPlaying}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {solving ? "Solving..." : "Solve"}
              </Button>
            </div>
          </div>

          {/* Playback Controls */}
          {solution && solution.path && solution.path.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={currentStep >= solution.path!.length - 1}
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
                <div className="text-sm text-muted-foreground">
                  Step: {currentStep} / {solution.path.length - 1}
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        (currentStep / (solution.path.length - 1)) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Puzzle Board */}
      <Card className="p-8">
        <div className="aspect-square max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-2 h-full">
            {displayBoard.map((row, i) =>
              row.map((tile, j) => (
                <motion.div
                  key={`${i}-${j}`}
                  className={`flex items-center justify-center text-3xl font-bold rounded-lg ${
                    tile === 0
                      ? "bg-secondary/20"
                      : "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
                  }`}
                  layout
                  transition={{ duration: 0.3 }}
                >
                  {tile !== 0 && tile}
                </motion.div>
              ))
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
                {solution.solved ? "✓ Solved" : "✗ Unsolvable"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Moves</div>
              <div className="text-lg font-semibold">{solution.moves || 0}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Nodes Explored
              </div>
              <div className="text-lg font-semibold">
                {solution.nodes_explored}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Algorithm</div>
              <div className="text-lg font-semibold">
                {solution.algorithm === "astar" ? "A*" : "BFS"}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
