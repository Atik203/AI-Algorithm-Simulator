/**
 * Simulator Page - Main page for algorithm visualization
 * Complete Phase 2 implementation
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Grid3x3,
  Wand2,
  Eraser,
  Download,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlgorithmVisualizer } from '@/components/visualizer/AlgorithmVisualizer';
import { VisualizerControls } from '@/components/visualizer/VisualizerControls';
import { AlgorithmStatistics } from '@/components/visualizer/AlgorithmStatistics';
import type {
  GridState,
  AlgorithmStep,
  AlgorithmType,
  HeuristicType,
  GridSize,
  Statistics,
  Position,
} from '@/types/visualizer';
import {
  createEmptyGrid,
  generateRandomMaze,
  addRandomObstacles,
  gridStateToAPI,
  downloadCanvasAsImage,
} from '@/lib/visualizer-utils';
import { GRID_CONFIGS } from '@/types/visualizer';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { apiClient } from '@/api/api';

type DrawMode = 'wall' | 'empty' | 'start' | 'goal';

export default function Simulator() {
  // Grid State
  const [gridSize, setGridSize] = useState<GridSize>('medium');
  const config = GRID_CONFIGS[gridSize];
  
  const [gridState, setGridState] = useState<GridState>(() => ({
    grid: createEmptyGrid(config.rows, config.cols),
    start: { row: 5, col: 5 },
    goal: { row: config.rows - 6, col: config.cols - 6 },
    rows: config.rows,
    cols: config.cols,
  }));

  // Algorithm State
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('astar');
  const [heuristic, setHeuristic] = useState<HeuristicType>('manhattan');
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // UI State
  const [drawMode, setDrawMode] = useState<DrawMode>('wall');
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

  // Update grid when size changes
  useEffect(() => {
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
  }, [gridSize]);

  // Playback animation
  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const delay = 1000 / (speed * 10); // Adjust speed
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
  }, [isPlaying, currentStep, steps.length, speed]);

  // Update statistics
  useEffect(() => {
    const visited = steps
      .slice(0, currentStep)
      .filter((s) => s.type === 'visit').length;
    const frontier = steps
      .slice(0, currentStep)
      .filter((s) => s.type === 'frontier').length;
    const path = steps.filter((s) => s.type === 'path');

    setStatistics((prev) => ({
      ...prev,
      nodesExplored: visited,
      nodesInFrontier: frontier,
      pathLength: path.length,
      currentStep,
      totalSteps: steps.length,
    }));
  }, [currentStep, steps]);

  // Run Algorithm
  const runAlgorithm = async () => {
    setIsLoading(true);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);

    try {
      const response = await apiClient.post('/algorithms/run/', {
        algorithm,
        ...gridStateToAPI(gridState),
        heuristic,
        save_simulation: false,
      });

      // Parse response and create steps
      const newSteps: AlgorithmStep[] = [];

      // Add visited nodes
      if (response.data.visited) {
        response.data.visited.forEach((pos: number[]) => {
          newSteps.push({
            type: 'visit',
            position: { row: pos[0], col: pos[1] },
          });
        });
      }

      // Add path
      if (response.data.path && response.data.path_found) {
        response.data.path.forEach((pos: number[]) => {
          newSteps.push({
            type: 'path',
            position: { row: pos[0], col: pos[1] },
          });
        });
      }

      setSteps(newSteps);
      setStatistics((prev) => ({
        ...prev,
        pathCost: response.data.path_cost || 0,
        executionTime: response.data.execution_time || 0,
        totalSteps: newSteps.length,
      }));

      toast.success(
        response.data.path_found
          ? `Path found! Length: ${response.data.path.length}`
          : 'No path found'
      );
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to run algorithm');
      console.error('Algorithm execution error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cell interaction handlers
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const pos: Position = { row, col };

      if (drawMode === 'start') {
        setGridState((prev) => ({ ...prev, start: pos }));
      } else if (drawMode === 'goal') {
        setGridState((prev) => ({ ...prev, goal: pos }));
      } else if (drawMode === 'wall') {
        setGridState((prev) => {
          const newGrid = prev.grid.map((r) => [...r]);
          newGrid[row][col] = 1;
          return { ...prev, grid: newGrid };
        });
      } else if (drawMode === 'empty') {
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
      if (drawMode === 'wall' || drawMode === 'empty') {
        handleCellClick(row, col);
      }
    },
    [drawMode, handleCellClick]
  );

  // Control handlers
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
    toast.success('Maze generated!');
  };

  const handleRandomObstacles = () => {
    setGridState((prev) => ({
      ...prev,
      grid: addRandomObstacles(createEmptyGrid(prev.rows, prev.cols), 0.3),
    }));
    handleReset();
    toast.success('Random obstacles added!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <motion.header
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Grid3x3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Algorithm Simulator</h1>
                <p className="text-sm text-muted-foreground">
                  Visualize search algorithms in real-time
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
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          {/* Left: Visualizer */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
            {/* Toolbar */}
            <Card className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Draw Mode */}
                <div className="flex gap-2">
                  <Button
                    variant={drawMode === 'wall' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDrawMode('wall')}
                    title="Draw walls"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={drawMode === 'empty' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDrawMode('empty')}
                    title="Erase"
                  >
                    <Eraser className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={drawMode === 'start' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDrawMode('start')}
                    title="Set start"
                    className="text-green-600"
                  >
                    ▶
                  </Button>
                  <Button
                    variant={drawMode === 'goal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDrawMode('goal')}
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
                  {isLoading ? 'Running...' : 'Run Algorithm'}
                </Button>
              </div>
            </Card>

            {/* Visualizer */}
            <motion.div variants={fadeInUp}>
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
            </motion.div>
          </motion.div>

          {/* Right: Controls & Statistics */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className={`space-y-4 ${
              sidebarCollapsed ? 'hidden lg:block' : ''
            }`}
          >
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}
