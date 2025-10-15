/**
 * Updated Simulator Page - Supports Multiple Simulation Types
 * Pathfinding, 8-Puzzle, N-Queens, Tic-Tac-Toe, etc.
 */

import {
  apiClient,
  getSimulationTypes,
  type SimulationType as APISimulationType,
} from "@/api/api";
import { TicTacToe } from "@/components/game/TicTacToe";
import { TowerOfHanoiVisualizer } from "@/components/game/TowerOfHanoiVisualizer";
import { EightPuzzleVisualizer } from "@/components/puzzle/EightPuzzleVisualizer";
import { NQueensVisualizer } from "@/components/puzzle/NQueensVisualizer";
import { SudokuVisualizer } from "@/components/puzzle/SudokuVisualizer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlgorithmStatistics } from "@/components/visualizer/AlgorithmStatistics";
import { AlgorithmVisualizer } from "@/components/visualizer/AlgorithmVisualizer";
import { VisualizerControls } from "@/components/visualizer/VisualizerControls";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/animations";
import {
  addRandomObstacles,
  createEmptyGrid,
  generateRandomMaze,
} from "@/lib/visualizer-utils";
import { useAppSelector } from "@/store/hooks";
import type {
  AlgorithmStep,
  AlgorithmType,
  GridSize,
  GridState,
  HeuristicType,
  Position,
  SimulationType,
  Statistics,
} from "@/types/visualizer";
import { GRID_CONFIGS } from "@/types/visualizer";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Eraser,
  Gamepad2,
  Grid3x3,
  Lightbulb,
  Puzzle,
  Wand2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type DrawMode = "wall" | "empty" | "start" | "goal";

export default function Simulator() {
  // Redux state
  const { isAuthenticated } = useAppSelector((state) => state.user);

  // Simulation Type State
  const [simulationType, setSimulationType] =
    useState<SimulationType>("pathfinding");
  const [simulationTypes, setSimulationTypes] = useState<APISimulationType[]>(
    []
  );

  // Grid State (for pathfinding)
  const [gridSize, setGridSize] = useState<GridSize>("medium");
  const config = GRID_CONFIGS[gridSize];

  const [gridState, setGridState] = useState<GridState>(() => ({
    grid: createEmptyGrid(config.rows, config.cols),
    start: { row: 5, col: 5 },
    goal: { row: config.rows - 6, col: config.cols - 6 },
    rows: config.rows,
    cols: config.cols,
  }));

  // Algorithm State
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("astar");
  const [heuristic, setHeuristic] = useState<HeuristicType>("manhattan");
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // UI State
  const [drawMode, setDrawMode] = useState<DrawMode>("wall");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Statistics
  const [statistics, setStatistics] = useState<Statistics>({
    nodesExplored: 0,
    nodesInFrontier: 0,
    pathLength: 0,
    pathCost: 0,
    executionTime: 0,
    currentStep: 0,
    totalSteps: 0,
    memoryUsage: 0,
  });

  // Load simulation types on mount
  useEffect(() => {
    const loadSimulationTypes = async () => {
      try {
        const types = await getSimulationTypes();
        setSimulationTypes(types);
      } catch (error) {
        console.error("Failed to load simulation types:", error);
        toast.error("Failed to load simulation types");
      }
    };
    loadSimulationTypes();
  }, []);

  // Update grid when size changes (pathfinding only)
  useEffect(() => {
    if (simulationType === "pathfinding") {
      const newConfig = GRID_CONFIGS[gridSize];
      setGridState({
        grid: createEmptyGrid(newConfig.rows, newConfig.cols),
        start: { row: 5, col: 5 },
        goal: { row: newConfig.rows - 6, col: newConfig.cols - 6 },
        rows: newConfig.rows,
        cols: newConfig.cols,
      });
      setSteps([]);
      setCurrentStep(0);
    }
  }, [gridSize, simulationType]);

  // Playback animation (pathfinding only)
  useEffect(() => {
    if (
      isPlaying &&
      currentStep < steps.length &&
      simulationType === "pathfinding"
    ) {
      const delay = 1000 / (speed * 10);
      intervalRef.current = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, delay);
    } else if (currentStep >= steps.length) {
      setIsPlaying(false);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isPlaying, currentStep, steps.length, speed, simulationType]);

  // Update statistics (pathfinding only)
  useEffect(() => {
    if (simulationType === "pathfinding") {
      const visited = steps
        .slice(0, currentStep)
        .filter((s) => s.type === "visit").length;
      const frontier = steps
        .slice(0, currentStep)
        .filter((s) => s.type === "frontier").length;
      const path = steps.filter((s) => s.type === "path");

      setStatistics((prev) => ({
        ...prev,
        nodesExplored: visited,
        nodesInFrontier: frontier,
        pathLength: path.length,
        currentStep,
        totalSteps: steps.length,
      }));
    }
  }, [currentStep, steps, simulationType]);

  // Run Pathfinding Algorithm
  const runAlgorithm = async () => {
    setIsLoading(true);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);

    try {
      const response = await apiClient.post("/run-algorithm/", {
        algorithm,
        grid: gridState.grid,
        start: [gridState.start.row, gridState.start.col],
        goal: [gridState.goal.row, gridState.goal.col],
        heuristic,
        save_simulation: isAuthenticated,
      });

      const data = response.data;

      // Convert backend steps to frontend format
      const newSteps: AlgorithmStep[] = [];

      if (data.steps && Array.isArray(data.steps)) {
        data.steps.forEach((step: any) => {
          newSteps.push({
            type:
              step.type === "visiting"
                ? "visit"
                : step.type === "exploring"
                ? "frontier"
                : "visit",
            position: { row: step.position[0], col: step.position[1] },
          });
        });
      }

      // Add path as separate steps if found
      if (data.path_found && data.path && Array.isArray(data.path)) {
        data.path.forEach((pos: number[]) => {
          newSteps.push({
            type: "path",
            position: { row: pos[0], col: pos[1] },
          });
        });
      }

      setSteps(newSteps);
      setStatistics({
        nodesExplored: data.nodes_explored || 0,
        nodesInFrontier: 0,
        pathLength: data.path ? data.path.length : 0,
        pathCost: data.path_cost || 0,
        executionTime: data.execution_time || 0,
        currentStep: 0,
        totalSteps: newSteps.length,
        memoryUsage: 0,
      });

      if (data.path_found) {
        toast.success("Path found!", {
          description: `Explored ${data.nodes_explored} nodes. Path length: ${data.path.length}`,
        });
      } else {
        toast.warning("No path found", {
          description: "Try adjusting the grid or obstacles",
        });
      }
    } catch (error: any) {
      toast.error("Algorithm execution failed", {
        description:
          error.response?.data?.error || error.message || "Please try again",
      });
      console.error("Algorithm execution error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cell interaction handlers (pathfinding only)
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const pos: Position = { row, col };

      if (drawMode === "start") {
        setGridState((prev) => ({ ...prev, start: pos }));
      } else if (drawMode === "goal") {
        setGridState((prev) => ({ ...prev, goal: pos }));
      } else if (drawMode === "wall") {
        setGridState((prev) => {
          const newGrid = prev.grid.map((r) => [...r]);
          newGrid[row][col] = 1;
          return { ...prev, grid: newGrid };
        });
      } else if (drawMode === "empty") {
        setGridState((prev) => {
          const newGrid = prev.grid.map((r) => [...r]);
          newGrid[row][col] = 0;
          return { ...prev, grid: newGrid };
        });
      }
    },
    [drawMode]
  );

  const handleCellDrag = useCallback(
    (row: number, col: number) => {
      if (drawMode === "wall" || drawMode === "empty") {
        handleCellClick(row, col);
      }
    },
    [drawMode, handleCellClick]
  );

  // Control handlers (pathfinding only)
  const handlePlay = () => {
    if (steps.length === 0) {
      runAlgorithm();
    } else {
      setIsPlaying(true);
    }
  };

  const handlePause = () => setIsPlaying(false);

  const handleStepForward = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps([]);
    setStatistics({
      nodesExplored: 0,
      nodesInFrontier: 0,
      pathLength: 0,
      pathCost: 0,
      executionTime: 0,
      currentStep: 0,
      totalSteps: 0,
      memoryUsage: 0,
    });
  };

  const handleClearGrid = () => {
    setGridState((prev) => ({
      ...prev,
      grid: createEmptyGrid(prev.rows, prev.cols),
    }));
    handleReset();
  };

  const handleGenerateMaze = () => {
    setGridState((prev) => ({
      ...prev,
      grid: generateRandomMaze(prev.rows, prev.cols),
    }));
    handleReset();
    toast.success("Maze generated!");
  };

  const handleRandomObstacles = () => {
    setGridState((prev) => ({
      ...prev,
      grid: addRandomObstacles(createEmptyGrid(prev.rows, prev.cols), 0.3),
    }));
    handleReset();
    toast.success("Random obstacles added!");
  };

  // Get icon for simulation type
  const getSimulationIcon = (type: SimulationType) => {
    switch (type) {
      case "pathfinding":
        return <Grid3x3 className="h-5 w-5" />;
      case "8-puzzle":
      case "n-queens":
      case "sudoku":
        return <Puzzle className="h-5 w-5" />;
      case "tic-tac-toe":
        return <Gamepad2 className="h-5 w-5" />;
      case "tower-of-hanoi":
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <Grid3x3 className="h-5 w-5" />;
    }
  };

  // Render appropriate visualizer based on simulation type
  const renderVisualizer = () => {
    switch (simulationType) {
      case "pathfinding":
        return (
          <div className="space-y-4">
            {/* Pathfinding Toolbar */}
            <Card className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Draw Mode */}
                <div className="flex gap-2">
                  <Button
                    variant={drawMode === "wall" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDrawMode("wall")}
                    title="Draw walls"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={drawMode === "empty" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDrawMode("empty")}
                    title="Erase"
                  >
                    <Eraser className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={drawMode === "start" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDrawMode("start")}
                    title="Set start"
                    className="text-green-600"
                  >
                    ▶
                  </Button>
                  <Button
                    variant={drawMode === "goal" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDrawMode("goal")}
                    title="Set goal"
                    className="text-red-600"
                  >
                    ★
                  </Button>
                </div>

                <div className="h-6 w-px bg-border" />

                {/* Actions */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateMaze}
                  disabled={isPlaying}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Maze
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRandomObstacles}
                  disabled={isPlaying}
                >
                  Random
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearGrid}
                  disabled={isPlaying}
                >
                  Clear
                </Button>

                <div className="flex-1" />

                <Button
                  variant="default"
                  onClick={runAlgorithm}
                  disabled={isPlaying || isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? "Running..." : "Run Algorithm"}
                </Button>
              </div>
            </Card>

            {/* Visualizer */}
            <Card className="p-4">
              <div className="aspect-square max-h-[calc(100vh-300px)]">
                <AlgorithmVisualizer
                  gridState={gridState}
                  steps={steps}
                  currentStep={currentStep}
                  isPlaying={isPlaying}
                  onCellClick={handleCellClick}
                  onCellDrag={handleCellDrag}
                  gridSize={gridSize}
                  showGrid={showGrid}
                />
              </div>
            </Card>
          </div>
        );

      case "8-puzzle":
        return <EightPuzzleVisualizer />;

      case "n-queens":
        return <NQueensVisualizer />;

      case "tic-tac-toe":
        return <TicTacToe />;

      case "sudoku":
        return <SudokuVisualizer />;

      case "tower-of-hanoi":
        return <TowerOfHanoiVisualizer />;

      default:
        return (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              Select a simulation type to begin
            </p>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <motion.header
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {getSimulationIcon(simulationType)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">Algorithm Simulator</h1>
                <p className="text-sm text-muted-foreground">
                  Visualize algorithms in real-time
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden"
            >
              {sidebarCollapsed ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </div>

          {/* Simulation Type Selector */}
          <div className="mt-4 flex flex-wrap gap-2">
            {simulationTypes.map((type) => (
              <Button
                key={type.id}
                variant={simulationType === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSimulationType(type.id as SimulationType);
                  handleReset();
                }}
                className="flex items-center gap-2"
              >
                {getSimulationIcon(type.id as SimulationType)}
                <span className="hidden sm:inline">{type.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          {/* Left: Visualizer */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {renderVisualizer()}
          </motion.div>

          {/* Right: Controls & Statistics */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className={`space-y-4 ${sidebarCollapsed ? "hidden lg:block" : ""}`}
          >
            {simulationType === "pathfinding" && (
              <>
                <VisualizerControls
                  isPlaying={isPlaying}
                  isPaused={!isPlaying && currentStep > 0}
                  currentStep={currentStep}
                  totalSteps={steps.length}
                  speed={speed}
                  algorithm={algorithm}
                  heuristic={heuristic}
                  gridSize={gridSize}
                  showGrid={showGrid}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onStepForward={handleStepForward}
                  onStepBackward={handleStepBackward}
                  onReset={handleReset}
                  onSpeedChange={setSpeed}
                  onAlgorithmChange={setAlgorithm}
                  onHeuristicChange={setHeuristic}
                  onGridSizeChange={setGridSize}
                  onShowGridToggle={() => setShowGrid(!showGrid)}
                />

                <AlgorithmStatistics
                  statistics={statistics}
                  algorithm={algorithm}
                  isComplete={currentStep === steps.length && steps.length > 0}
                />
              </>
            )}

            {simulationType !== "pathfinding" && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  {getSimulationIcon(simulationType)}
                  {simulationTypes.find((t) => t.id === simulationType)?.name ||
                    "Simulation"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {simulationTypes.find((t) => t.id === simulationType)
                    ?.description || "Interactive algorithm visualization"}
                </p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Algorithms:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {simulationTypes
                        .find((t) => t.id === simulationType)
                        ?.algorithms.map((alg: string) => (
                          <span
                            key={alg}
                            className="px-2 py-1 bg-secondary text-xs rounded"
                          >
                            {alg}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
