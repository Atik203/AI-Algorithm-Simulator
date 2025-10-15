/**
 * 8-Puzzle Visualizer Component
 * Sliding tile puzzle with A* and BFS algorithms
 */

import { solvePuzzle, type PuzzleSolveResponse } from "@/api/api";
import { AlgorithmInfoCard } from "@/components/common/AlgorithmInfoCard";
import {
  ConfigOption,
  ConfigurationPanel,
} from "@/components/common/ConfigurationPanel";
import { ControlPanel } from "@/components/common/ControlPanel";
import {
  StatisticsPanel,
  createPuzzleStats,
} from "@/components/common/StatisticsPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Puzzle, Shuffle, Sparkles } from "lucide-react";
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
  const [speed, setSpeed] = useState(1);
  const [executionTime, setExecutionTime] = useState(0);

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
    const startTime = performance.now();

    try {
      const response = await solvePuzzle({
        puzzle_type: "8-puzzle",
        algorithm,
        initial_state: board,
      });

      const endTime = performance.now();
      setExecutionTime(endTime - startTime);

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
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, solution, speed]);

  // Get current board state
  const getCurrentBoard = () => {
    if (!solution || !solution.path || currentStep === 0) {
      return board;
    }
    return solution.path[currentStep];
  };

  const displayBoard = getCurrentBoard();

  // Configuration options
  const configOptions: ConfigOption[] = [
    {
      id: "algorithm",
      label: "Algorithm",
      type: "select",
      value: algorithm,
      onChange: setAlgorithm,
      options: [
        { value: "astar", label: "A* Search" },
        { value: "bfs", label: "Breadth-First Search" },
      ],
      disabled: solving || isPlaying,
      description:
        algorithm === "astar"
          ? "Uses Manhattan distance heuristic for optimal path finding"
          : "Explores all possible moves systematically",
    },
  ];

  // Create statistics
  const statistics = solution
    ? createPuzzleStats({
        moves: currentStep,
        nodesExplored: solution.nodes_explored,
        solutionLength: solution.moves,
        executionTime,
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Algorithm Info Card */}
      <AlgorithmInfoCard
        title="8-Puzzle Sliding Tile"
        description="Classic sliding tile puzzle where you arrange numbered tiles in order by sliding them into the empty space. Implements A* with Manhattan distance heuristic and BFS for guaranteed optimal solutions."
        icon={<Puzzle className="w-6 h-6 text-white" />}
        goal="Arrange tiles 1-8 in order with blank in bottom-right"
        timeComplexity="O(b^d) where b is branching factor, d is depth"
        spaceComplexity="O(b^d) for storing explored states"
        features={[
          "A* Search with Manhattan distance heuristic",
          "BFS for exhaustive search",
          "Guaranteed optimal solution",
          "Animated step-by-step visualization",
        ]}
      />

      {/* Configuration Panel */}
      <ConfigurationPanel
        title="Configuration"
        options={configOptions}
        columns={1}
      />

      {/* Control Panel */}
      <ControlPanel
        isPlaying={isPlaying}
        isPaused={!isPlaying && currentStep > 0}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReset={() => {
          setCurrentStep(0);
          setIsPlaying(false);
          setSolution(null);
          toast.success("Reset complete");
        }}
        onStepForward={() => {
          if (
            solution &&
            solution.path &&
            currentStep < solution.path.length - 1
          ) {
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
        totalSteps={solution?.path?.length ? solution.path.length - 1 : 0}
        disabled={solving || !solution}
        showStepControls={!!solution && !!solution.path}
        showSpeedControl={!!solution && !!solution.path}
        customActions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={shuffleBoard}
              disabled={solving || isPlaying}
              className="flex-1"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Shuffle
            </Button>
            <Button
              size="sm"
              onClick={solvePuzzleNow}
              disabled={solving || isPlaying}
              className="flex-1"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {solving ? "Solving..." : "Solve"}
            </Button>
          </div>
        }
      />

      {/* Puzzle Board */}
      <Card className="p-8">
        <div className="aspect-square max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-2 h-full">
            {displayBoard.map((row, i) =>
              row.map((tile, j) => (
                <motion.div
                  key={`${i}-${j}`}
                  className={`flex items-center justify-center text-3xl font-bold rounded-lg transition-all ${
                    tile === 0
                      ? "bg-secondary/20"
                      : "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl"
                  }`}
                  layout
                  transition={{ duration: 0.3 }}
                  whileHover={tile !== 0 ? { scale: 1.05 } : {}}
                >
                  {tile !== 0 && tile}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Solution Status */}
        {solution && (
          <div className="mt-6 text-center">
            {solution.solved ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                <span className="text-2xl">✓</span>
                <span className="font-semibold">Solution Found!</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                <span className="text-2xl">⚠</span>
                <span className="font-semibold">No Solution</span>
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
