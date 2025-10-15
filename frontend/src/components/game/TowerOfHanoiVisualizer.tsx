/**
 * Tower of Hanoi Visualizer Component
 * Classic puzzle with disk movement animation
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
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, Sparkles } from "lucide-react";
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
  const [towers, setTowers] = useState<number[][]>([[], [], []]);

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

    try {
      const response = await playGame({
        game_type: "tower-of-hanoi",
        n_disks: numDisks,
      });

      setSolution(response);

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
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying, solution]);

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

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Number of Disks</Label>
              <Select
                value={numDisks.toString()}
                onValueChange={(value) => setNumDisks(parseInt(value))}
                disabled={solving || isPlaying}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Disks</SelectItem>
                  <SelectItem value="4">4 Disks</SelectItem>
                  <SelectItem value="5">5 Disks</SelectItem>
                  <SelectItem value="6">6 Disks</SelectItem>
                  <SelectItem value="7">7 Disks</SelectItem>
                  <SelectItem value="8">8 Disks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 items-end">
              <Button
                size="sm"
                onClick={solveTowerOfHanoi}
                disabled={solving || isPlaying}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {solving ? "Solving..." : "Solve"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={initializeTowers}
                disabled={solving || isPlaying}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
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
                  <span className="text-muted-foreground">Move: </span>
                  {currentStep} / {solution.steps.length}
                  {moveInfo && (
                    <span className="ml-2 text-xs px-2 py-1 rounded-full bg-secondary">
                      Tower {moveInfo.from} → Tower {moveInfo.to}
                      {moveInfo.disk && ` (Disk ${moveInfo.disk})`}
                    </span>
                  )}
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden mt-1">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(currentStep / solution.steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Tower of Hanoi:</strong> Move all disks from Tower 1 to
              Tower 3. Only one disk can be moved at a time, and no larger disk
              can be on top of a smaller one.
            </p>
          </div>
        </div>
      </Card>

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

      {/* Statistics */}
      {solution && (
        <Card className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="text-lg font-semibold">
                {solution.steps && solution.steps.length > 0
                  ? "✓ Complete"
                  : "In Progress"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Moves</div>
              <div className="text-lg font-semibold">
                {solution.total_moves}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Optimal Moves</div>
              <div className="text-lg font-semibold">
                {Math.pow(2, numDisks) - 1}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Number of Disks
              </div>
              <div className="text-lg font-semibold">{numDisks}</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
