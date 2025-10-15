/**
 * Utility functions for the Algorithm Visualizer
 */

import type { Position, GridState, AlgorithmStep } from '@/types/visualizer';

/**
 * Create an empty grid
 */
export function createEmptyGrid(rows: number, cols: number): number[][] {
  return Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(0));
}

/**
 * Create a random maze using recursive backtracking
 */
export function generateRandomMaze(rows: number, cols: number): number[][] {
  const grid = Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(1)); // Start with all walls

  const directions = [
    [0, 2],
    [2, 0],
    [0, -2],
    [-2, 0],
  ];

  function shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function carve(row: number, col: number) {
    grid[row][col] = 0;

    const shuffledDirs = shuffle(directions);
    for (const [dr, dc] of shuffledDirs) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol] === 1
      ) {
        grid[row + dr / 2][col + dc / 2] = 0;
        carve(newRow, newCol);
      }
    }
  }

  // Start from a random odd position
  const startRow = Math.floor(Math.random() * (rows / 2)) * 2 + 1;
  const startCol = Math.floor(Math.random() * (cols / 2)) * 2 + 1;
  carve(startRow, startCol);

  return grid;
}

/**
 * Add random obstacles to grid
 */
export function addRandomObstacles(
  grid: number[][],
  density: number = 0.3
): number[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = grid.map((row) => [...row]);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (Math.random() < density) {
        newGrid[i][j] = 1;
      }
    }
  }

  return newGrid;
}

/**
 * Check if position is valid
 */
export function isValidPosition(
  pos: Position,
  rows: number,
  cols: number
): boolean {
  return pos.row >= 0 && pos.row < rows && pos.col >= 0 && pos.col < cols;
}

/**
 * Check if two positions are equal
 */
export function positionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

/**
 * Calculate Manhattan distance
 */
export function manhattanDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
}

/**
 * Calculate Euclidean distance
 */
export function euclideanDistance(pos1: Position, pos2: Position): number {
  const dx = pos1.row - pos2.row;
  const dy = pos1.col - pos2.col;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate Chebyshev distance
 */
export function chebyshevDistance(pos1: Position, pos2: Position): number {
  return Math.max(
    Math.abs(pos1.row - pos2.row),
    Math.abs(pos1.col - pos2.col)
  );
}

/**
 * Calculate Octile distance
 */
export function octileDistance(pos1: Position, pos2: Position): number {
  const dx = Math.abs(pos1.row - pos2.row);
  const dy = Math.abs(pos1.col - pos2.col);
  const D = 1;
  const D2 = Math.sqrt(2);
  return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
}

/**
 * Get neighbors of a position (4-directional)
 */
export function getNeighbors(
  pos: Position,
  rows: number,
  cols: number
): Position[] {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const neighbors: Position[] = [];

  for (const [dr, dc] of directions) {
    const newPos = { row: pos.row + dr, col: pos.col + dc };
    if (isValidPosition(newPos, rows, cols)) {
      neighbors.push(newPos);
    }
  }

  return neighbors;
}

/**
 * Get neighbors of a position (8-directional)
 */
export function getNeighbors8(
  pos: Position,
  rows: number,
  cols: number
): Position[] {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  const neighbors: Position[] = [];

  for (const [dr, dc] of directions) {
    const newPos = { row: pos.row + dr, col: pos.col + dc };
    if (isValidPosition(newPos, rows, cols)) {
      neighbors.push(newPos);
    }
  }

  return neighbors;
}

/**
 * Convert grid state to API format
 */
export function gridStateToAPI(state: GridState) {
  return {
    grid: state.grid,
    start: [state.start.row, state.start.col],
    goal: [state.goal.row, state.goal.col],
  };
}

/**
 * Parse API response to algorithm steps
 */
export function parseAPIResponse(response: any): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];

  // Parse visited nodes
  if (response.visited) {
    response.visited.forEach((pos: number[]) => {
      steps.push({
        type: 'visit',
        position: { row: pos[0], col: pos[1] },
      });
    });
  }

  // Parse frontier nodes
  if (response.frontier) {
    response.frontier.forEach((pos: number[]) => {
      steps.push({
        type: 'frontier',
        position: { row: pos[0], col: pos[1] },
      });
    });
  }

  // Parse path
  if (response.path) {
    response.path.forEach((pos: number[]) => {
      steps.push({
        type: 'path',
        position: { row: pos[0], col: pos[1] },
      });
    });
  }

  return steps;
}

/**
 * Interpolate between two colors
 */
export function interpolateColor(
  color1: string,
  color2: string,
  factor: number
): string {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 255;
  const g1 = (c1 >> 8) & 255;
  const b1 = c1 & 255;

  const r2 = (c2 >> 16) & 255;
  const g2 = (c2 >> 8) & 255;
  const b2 = c2 & 255;

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Download grid as image
 */
export function downloadCanvasAsImage(
  canvas: HTMLCanvasElement,
  filename: string = 'algorithm-visualization.png'
) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Format execution time
 */
export function formatExecutionTime(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format memory usage
 */
export function formatMemoryUsage(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}
