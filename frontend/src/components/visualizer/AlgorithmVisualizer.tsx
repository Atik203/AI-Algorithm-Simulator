/**
 * AlgorithmVisualizer - Canvas-based grid visualizer with 60fps rendering
 * The heart of the AI Algorithm Simulator
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import type { Position, GridState, AlgorithmStep, CellType } from '@/types/visualizer';
import { CELL_COLORS, CELL_COLORS_DARK, GRID_CONFIGS } from '@/types/visualizer';
import { positionsEqual } from '@/lib/visualizer-utils';

interface AlgorithmVisualizerProps {
  gridState: GridState;
  steps: AlgorithmStep[];
  currentStep: number;
  isPlaying: boolean;
  onCellClick?: (row: number, col: number) => void;
  onCellDrag?: (row: number, col: number) => void;
  gridSize?: 'small' | 'medium' | 'large';
  showGrid?: boolean;
}

export function AlgorithmVisualizer({
  gridState,
  steps,
  currentStep,
  isPlaying,
  onCellClick,
  onCellDrag,
  gridSize = 'medium',
  showGrid = true,
}: AlgorithmVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const config = GRID_CONFIGS[gridSize];
  const colors = theme === 'dark' ? CELL_COLORS_DARK : CELL_COLORS;

  // Calculate cell size based on container
  const calculateDimensions = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      const maxCellWidth = Math.floor(containerWidth / gridState.cols);
      const maxCellHeight = Math.floor(containerHeight / gridState.rows);
      const cellSize = Math.min(maxCellWidth, maxCellHeight, config.cellSize);
      
      setDimensions({
        width: cellSize * gridState.cols,
        height: cellSize * gridState.rows,
      });
    }
  }, [gridState.rows, gridState.cols, config.cellSize]);

  // Resize observer
  useEffect(() => {
    calculateDimensions();
    
    const resizeObserver = new ResizeObserver(calculateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, [calculateDimensions]);

  // Get cell type at current step
  const getCellType = useCallback(
    (row: number, col: number): CellType => {
      const pos = { row, col };

      // Check special positions
      if (positionsEqual(pos, gridState.start)) return 'start';
      if (positionsEqual(pos, gridState.goal)) return 'goal';
      if (gridState.grid[row][col] === 1) return 'wall';

      // Check algorithm steps up to current step
      let cellType: CellType = 'empty';
      for (let i = 0; i <= Math.min(currentStep, steps.length - 1); i++) {
        const step = steps[i];
        if (positionsEqual(step.position, pos)) {
          if (step.type === 'visit') cellType = 'visited';
          else if (step.type === 'frontier') cellType = 'frontier';
          else if (step.type === 'current') cellType = 'current';
          else if (step.type === 'path') cellType = 'path';
        }
      }

      return cellType;
    },
    [gridState, steps, currentStep]
  );

  // Main render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = dimensions.width / gridState.cols;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Draw cells
    for (let row = 0; row < gridState.rows; row++) {
      for (let col = 0; col < gridState.cols; col++) {
        const x = col * cellSize;
        const y = row * cellSize;
        const cellType = getCellType(row, col);

        // Fill cell
        ctx.fillStyle = colors[cellType];
        ctx.fillRect(x, y, cellSize, cellSize);

        // Draw grid lines
        if (showGrid) {
          ctx.strokeStyle = theme === 'dark' ? '#1e293b' : '#e2e8f0';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }

        // Add glow effect for current cell
        if (cellType === 'current' && isPlaying) {
          ctx.shadowColor = colors.current;
          ctx.shadowBlur = 15;
          ctx.fillStyle = colors.current;
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.shadowBlur = 0;
        }

        // Add icons for start and goal
        if (cellType === 'start' || cellType === 'goal') {
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.floor(cellSize * 0.5)}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const icon = cellType === 'start' ? '▶' : '★';
          ctx.fillText(icon, x + cellSize / 2, y + cellSize / 2);
        }
      }
    }
  }, [dimensions, gridState, getCellType, colors, showGrid, theme, isPlaying]);

  // Render on changes
  useEffect(() => {
    render();
  }, [render]);

  // Animation loop for smooth rendering
  useEffect(() => {
    if (!isPlaying) return;

    let animationFrameId: number;
    const animate = () => {
      render();
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, render]);

  // Handle mouse interactions
  const getGridPosition = useCallback(
    (clientX: number, clientY: number): Position | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const cellSize = dimensions.width / gridState.cols;
      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);

      if (row >= 0 && row < gridState.rows && col >= 0 && col < gridState.cols) {
        return { row, col };
      }
      return null;
    },
    [dimensions, gridState]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const pos = getGridPosition(e.clientX, e.clientY);
    if (pos && onCellClick) {
      onCellClick(pos.row, pos.col);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !onCellDrag) return;
    const pos = getGridPosition(e.clientX, e.clientY);
    if (pos) {
      onCellDrag(pos.row, pos.col);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    const pos = getGridPosition(touch.clientX, touch.clientY);
    if (pos && onCellClick) {
      onCellClick(pos.row, pos.col);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !onCellDrag) return;
    const touch = e.touches[0];
    const pos = getGridPosition(touch.clientX, touch.clientY);
    if (pos) {
      onCellDrag(pos.row, pos.col);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-background/50 rounded-lg border border-border overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          imageRendering: 'crisp-edges',
        }}
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <div className="text-xs font-semibold mb-2">Legend</div>
        <div className="space-y-1">
          {[
            { type: 'start', label: 'Start' },
            { type: 'goal', label: 'Goal' },
            { type: 'wall', label: 'Wall' },
            { type: 'visited', label: 'Visited' },
            { type: 'frontier', label: 'Frontier' },
            { type: 'path', label: 'Path' },
          ].map(({ type, label }) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border border-border"
                style={{ backgroundColor: colors[type as CellType] }}
              />
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
