/**
 * Tower of Hanoi Visualizer Component
 * Classic puzzle with disk movement animation
 */

import { playGame, type GamePlayResponse } from "@/api/api";
import { AlgorithmInfoCard } from "@/components/common/AlgorithmInfoCard";
import {
  ConfigurationPanel,
  type ConfigOption,
} from "@/components/common/ConfigurationPanel";
import { ControlPanel } from "@/components/common/ControlPanel";
import { StatisticsPanel } from "@/components/common/StatisticsPanel";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Clock, Layers } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TowerOfHanoiVisualizerProps {
  onSave?: (data: any) => void;
}

export function TowerOfHanoiVisualizer({
  onSave,
}: TowerOfHanoiVisualizerProps) {
  const [numDisks, setNumDisks] = useState(3);
  const [solving, setSolving] = useState(false);
  const [solution, setSolution] = useState<GamePlayResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [towers, setTowers] = useState<number[][]>([[], [], []]);
  const [executionTime, setExecutionTime] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  // Initialize towers
  useEffect(() => {
    initializeTowers();
  }, [numDisks]);

  const initializeTowers = () => {
    const tower1 = Array.from({ length: numDisks }, (_, i) => numDisks - i);
    setTowers([tower1, [], []]);
    setSolution(null);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Solve Tower of Hanoi
  const solveTowerOfHanoi = async () => {
    setSolving(true);
    setCurrentStep(0);
    setIsPlaying(false);

    const startTime = performance.now();
    try {
      const response = await playGame({
        game_type: "tower-of-hanoi",
        n_disks: numDisks,
      });

      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      setSolution(response);
      setMoveCount(response.total_moves || 0);

      if (response.steps && response.steps.length > 0) {
        toast.success("Solution found!", {
          description: `${response.total_moves} moves (optimal solution)`,
        });
      } else {
        toast.warning("Failed to solve");
      }
    } catch (error: any) {
      toast.error("Failed to solve Tower of Hanoi", {
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
        if (prev >= solution.steps!.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, solution, speed]);

  // Get current tower state
  const getCurrentTowers = () => {
    if (!solution || !solution.steps || currentStep === 0) {
      return towers;
    }

    // Reconstruct towers based on steps
    const tower1 = Array.from({ length: numDisks }, (_, i) => numDisks - i);
    const currentTowers: number[][] = [tower1, [], []];

    for (let i = 0; i <= currentStep; i++) {
      const step = solution.steps[i];
      if (step) {
        // Tower names are "A", "B", "C" - convert to indices 0, 1, 2
        const fromIndex = step.from === "A" ? 0 : step.from === "B" ? 1 : 2;
        const toIndex = step.to === "A" ? 0 : step.to === "B" ? 1 : 2;

        const disk = currentTowers[fromIndex].pop();
        if (disk !== undefined) {
          currentTowers[toIndex].push(disk);
        }
      }
    }

    return currentTowers;
  };

  // Get current move info
  const getCurrentMoveInfo = () => {
    if (!solution || !solution.steps || currentStep === 0) {
      return null;
    }
    return solution.steps[currentStep];
  };

  const displayTowers = getCurrentTowers();
  const moveInfo = getCurrentMoveInfo();

  // Get disk color
  const getDiskColor = (size: number) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
    ];
    return colors[size - 1] || "bg-gray-500";
  };

  // Configuration options
  const configOptions: ConfigOption[] = [
    {
      id: "numDisks",
      label: "Number of Disks",
      type: "select",
      value: numDisks.toString(),
      options: [
        { label: "3 Disks", value: "3" },
        { label: "4 Disks", value: "4" },
        { label: "5 Disks", value: "5" },
        { label: "6 Disks", value: "6" },
        { label: "7 Disks", value: "7" },
        { label: "8 Disks", value: "8" },
      ],
      onChange: (value) => setNumDisks(parseInt(value)),
      disabled: solving || isPlaying,
      description: "Select the number of disks to solve",
    },
  ];

  // Statistics
  const statistics: {
    icon: any;
    label: string;
    value: string | number;
    color: string;
  }[] = [
    {
      icon: CheckCircle2,
      label: "Status",
      value:
        solution?.steps && solution.steps.length > 0
          ? "Complete"
          : "In Progress",
      color:
        solution?.steps && solution.steps.length > 0
          ? "text-green-600"
          : "text-yellow-600",
    },
    {
      icon: Layers,
      label: "Total Moves",
      value: moveCount || 0,
      color: "text-blue-600",
    },
    {
      icon: BookOpen,
      label: "Optimal Moves",
      value: Math.pow(2, numDisks) - 1,
      color: "text-purple-600",
    },
    {
      icon: Clock,
      label: "Execution Time",
      value: `${executionTime.toFixed(2)} ms`,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Algorithm Information */}
      <AlgorithmInfoCard
        title="Tower of Hanoi"
        description="A classic mathematical puzzle consisting of three rods and a number of disks of different sizes, which can slide onto any rod. The puzzle starts with disks neatly stacked in ascending order of size on one rod, the smallest at the top."
        goal="Move all disks from the first rod to the third rod, following these rules: (1) Only one disk can be moved at a time, (2) Each move consists of taking the top disk from one stack and placing it on top of another stack, (3) No larger disk may be placed on top of a smaller disk."
        timeComplexity="O(2^n)"
        spaceComplexity="O(n)"
        features={[
          "Recursive solution demonstrates exponential growth",
          "Optimal solution guaranteed with 2^n - 1 moves",
          "Classic example of divide-and-conquer algorithms",
          "Visualization shows the recursive nature of the solution",
        ]}
      />

      {/* Configuration Panel */}
      <ConfigurationPanel options={configOptions} />

      {/* Control Panel */}
      <ControlPanel
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReset={() => {
          initializeTowers();
          setMoveCount(0);
          setExecutionTime(0);
        }}
        isPlaying={isPlaying}
        disabled={!solution || !solution.steps || solving}
        speed={speed}
        onSpeedChange={setSpeed}
        showStepControls={false}
        customActions={
          <>
            <button
              onClick={solveTowerOfHanoi}
              disabled={solving || isPlaying}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
            >
              {solving ? "Solving..." : "Solve Puzzle"}
            </button>
          </>
        }
      />

      {/* Progress Info */}
      {solution && solution.steps && solution.steps.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Move: </span>
              <span className="font-semibold">
                {currentStep} / {solution.steps.length}
              </span>
              {moveInfo && (
                <span className="ml-2 text-xs px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600">
                  Tower {moveInfo.from} → Tower {moveInfo.to}
                  {moveInfo.disk && ` (Disk ${moveInfo.disk})`}
                </span>
              )}
            </div>
            <div className="h-2 w-64 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${(currentStep / solution.steps.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Statistics */}
      <StatisticsPanel statistics={statistics} />

      {/* Tower Visualization */}
      <Card className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {displayTowers.map((tower, towerIndex) => (
              <div key={towerIndex} className="flex flex-col items-center">
                {/* Tower Label */}
                <div className="text-lg font-semibold mb-4">
                  Tower {towerIndex + 1}
                </div>

                {/* Tower Structure */}
                <div className="relative w-full h-96 flex flex-col-reverse items-center">
                  {/* Base */}
                  <div className="w-full h-3 bg-amber-900 dark:bg-amber-800 rounded-t-lg"></div>

                  {/* Pole */}
                  <div className="absolute bottom-3 w-2 h-80 bg-amber-700 dark:bg-amber-600"></div>

                  {/* Disks */}
                  <div className="absolute bottom-3 w-full flex flex-col-reverse items-center gap-1 pt-3">
                    {tower.map((diskSize, diskIndex) => {
                      const width = (diskSize / numDisks) * 100;
                      return (
                        <motion.div
                          key={`${towerIndex}-${diskIndex}`}
                          className={`h-6 rounded ${getDiskColor(
                            diskSize
                          )} flex items-center justify-center text-white text-xs font-bold shadow-lg`}
                          style={{ width: `${width}%` }}
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          {diskSize}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
