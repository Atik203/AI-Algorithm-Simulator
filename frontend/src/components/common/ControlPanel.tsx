/**
 * ControlPanel - Reusable component for visualizer controls
 * Provides consistent play/pause/reset controls across all visualizers
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

interface ControlPanelProps {
  isPlaying: boolean;
  isPaused?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onReset: () => void;
  onStepForward?: () => void;
  onStepBackward?: () => void;
  speed?: number;
  onSpeedChange?: (speed: number) => void;
  currentStep?: number;
  totalSteps?: number;
  disabled?: boolean;
  showStepControls?: boolean;
  showSpeedControl?: boolean;
  customActions?: React.ReactNode;
}

export function ControlPanel({
  isPlaying,
  isPaused = false,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  speed = 1,
  onSpeedChange,
  currentStep = 0,
  totalSteps = 0,
  disabled = false,
  showStepControls = true,
  showSpeedControl = true,
  customActions,
}: ControlPanelProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Main Controls */}
        <div className="flex items-center gap-2">
          {onPlay && onPause && (
            <Button
              onClick={isPlaying ? onPause : onPlay}
              disabled={disabled}
              className="flex-1"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {isPaused ? "Resume" : "Play"}
                </>
              )}
            </Button>
          )}

          <Button onClick={onReset} variant="outline" disabled={disabled}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Step Controls */}
        {showStepControls &&
          onStepBackward &&
          onStepForward &&
          totalSteps > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  onClick={onStepBackward}
                  variant="outline"
                  size="sm"
                  disabled={disabled || currentStep === 0}
                  className="flex-1"
                >
                  <SkipBack className="w-4 h-4 mr-2" />
                  Step Back
                </Button>
                <Button
                  onClick={onStepForward}
                  variant="outline"
                  size="sm"
                  disabled={disabled || currentStep >= totalSteps}
                  className="flex-1"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Step Forward
                </Button>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Step {currentStep} / {totalSteps}
              </div>
            </div>
          )}

        {/* Speed Control */}
        {showSpeedControl && onSpeedChange && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Speed</span>
              <span className="font-semibold">{speed}x</span>
            </div>
            <Slider
              value={[speed]}
              onValueChange={([value]) => onSpeedChange(value)}
              min={0.5}
              max={3}
              step={0.5}
              disabled={disabled}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.5x</span>
              <span>3x</span>
            </div>
          </div>
        )}

        {/* Custom Actions */}
        {customActions && (
          <div className="pt-2 border-t border-border">{customActions}</div>
        )}
      </div>
    </Card>
  );
}
