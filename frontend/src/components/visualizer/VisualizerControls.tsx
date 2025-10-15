/**
 * VisualizerControls - Playback and configuration controls
 */

import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
  RotateCcw,
  Download,
  Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { AlgorithmType, HeuristicType, GridSize } from '@/types/visualizer';
import { fadeInUp } from '@/lib/animations';

interface VisualizerControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  algorithm: AlgorithmType;
  heuristic: HeuristicType;
  gridSize: GridSize;
  showGrid: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  onHeuristicChange: (heuristic: HeuristicType) => void;
  onGridSizeChange: (size: GridSize) => void;
  onShowGridToggle: () => void;
  onDownload?: () => void;
}

export function VisualizerControls({
  isPlaying,
  isPaused,
  currentStep,
  totalSteps,
  speed,
  algorithm,
  heuristic,
  gridSize,
  showGrid,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  onAlgorithmChange,
  onHeuristicChange,
  onGridSizeChange,
  onShowGridToggle,
  onDownload,
}: VisualizerControlsProps) {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <motion.div variants={fadeInUp} className="space-y-4">
      {/* Main Controls Card */}
      <Card className="p-4">
        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            disabled={isPlaying}
            title="Reset to beginning"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onStepBackward}
            disabled={isPlaying || currentStep === 0}
            title="Step backward"
          >
            <StepBack className="h-4 w-4" />
          </Button>

          {isPlaying ? (
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12"
              onClick={onPause}
              title="Pause"
            >
              <Pause className="h-6 w-6" />
            </Button>
          ) : (
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12"
              onClick={onPlay}
              disabled={currentStep >= totalSteps && totalSteps > 0}
              title="Play"
            >
              <Play className="h-6 w-6" />
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={onStepForward}
            disabled={isPlaying || currentStep >= totalSteps}
            title="Step forward"
          >
            <StepForward className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            disabled={isPlaying}
            title="Reset"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Step: {currentStep} / {totalSteps}
            </span>
            <span className="text-muted-foreground">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm">Speed: {speed}x</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSpeedChange(1)}
              className="h-6 text-xs"
            >
              Reset
            </Button>
          </div>
          <Slider
            value={[speed]}
            onValueChange={([value]) => onSpeedChange(value)}
            min={0.1}
            max={10}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.1x</span>
            <span>1x</span>
            <span>10x</span>
          </div>
        </div>
      </Card>

      {/* Configuration Card */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="h-4 w-4" />
          <h3 className="font-semibold">Configuration</h3>
        </div>

        <div className="space-y-4">
          {/* Algorithm Selection */}
          <div className="space-y-2">
            <Label>Algorithm</Label>
            <Select
              value={algorithm}
              onValueChange={(value) => onAlgorithmChange(value as AlgorithmType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="astar">A* Search</SelectItem>
                <SelectItem value="bfs">Breadth-First Search</SelectItem>
                <SelectItem value="dfs">Depth-First Search</SelectItem>
                <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
                <SelectItem value="hill_climbing">Hill Climbing</SelectItem>
                <SelectItem value="simulated_annealing">
                  Simulated Annealing
                </SelectItem>
                <SelectItem value="genetic">Genetic Algorithm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Heuristic Selection (for A*) */}
          {(algorithm === 'astar' || algorithm === 'hill_climbing') && (
            <div className="space-y-2">
              <Label>Heuristic Function</Label>
              <Select
                value={heuristic}
                onValueChange={(value) => onHeuristicChange(value as HeuristicType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manhattan">Manhattan Distance</SelectItem>
                  <SelectItem value="euclidean">Euclidean Distance</SelectItem>
                  <SelectItem value="chebyshev">Chebyshev Distance</SelectItem>
                  <SelectItem value="octile">Octile Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Grid Size */}
          <div className="space-y-2">
            <Label>Grid Size</Label>
            <Select
              value={gridSize}
              onValueChange={(value) => onGridSizeChange(value as GridSize)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (15×15)</SelectItem>
                <SelectItem value="medium">Medium (30×30)</SelectItem>
                <SelectItem value="large">Large (50×50)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Options */}
          <div className="flex items-center justify-between">
            <Label>Show Grid Lines</Label>
            <Button
              variant={showGrid ? 'default' : 'outline'}
              size="sm"
              onClick={onShowGridToggle}
            >
              {showGrid ? 'On' : 'Off'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear All
        </Button>
        {onDownload && (
          <Button variant="outline" className="flex-1" onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </div>
    </motion.div>
  );
}
