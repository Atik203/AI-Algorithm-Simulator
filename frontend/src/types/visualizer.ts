/**
 * Types and interfaces for the Algorithm Visualizer
 */

// Simulation Types
export type SimulationType =
  | "pathfinding"
  | "8-puzzle"
  | "n-queens"
  | "tic-tac-toe"
  | "connect4"
  | "sudoku"
  | "tower-of-hanoi";

export interface SimulationTypeInfo {
  id: SimulationType;
  name: string;
  description: string;
  algorithms: string[];
  icon: string;
}

// Pathfinding Types
export type CellType =
  | "empty"
  | "wall"
  | "start"
  | "goal"
  | "visited"
  | "current"
  | "path"
  | "frontier";

export type AlgorithmType =
  | "astar"
  | "bfs"
  | "dfs"
  | "dijkstra"
  | "hill_climbing"
  | "simulated_annealing"
  | "genetic"
  | "minimax"
  | "alpha_beta"
  | "backtracking"
  | "recursive";

export type HeuristicType = "manhattan" | "euclidean" | "chebyshev" | "octile";

export type GridSize = "small" | "medium" | "large" | "custom";

export interface Cell {
  row: number;
  col: number;
  type: CellType;
}

export interface Position {
  row: number;
  col: number;
}

export interface GridState {
  grid: number[][];
  start: Position;
  goal: Position;
  rows: number;
  cols: number;
}

export interface AlgorithmStep {
  type: "visit" | "current" | "path" | "frontier";
  position: Position;
  cost?: number;
  heuristic?: number;
}

export interface AlgorithmResult {
  path: Position[];
  steps: AlgorithmStep[];
  nodesExplored: number;
  pathLength: number;
  pathCost: number;
  executionTime: number;
  pathFound: boolean;
}

export interface VisualizerState {
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number; // 0.1x to 10x
  algorithm: AlgorithmType;
  heuristic: HeuristicType;
  gridSize: GridSize;
  showGrid: boolean;
  showStats: boolean;
}

export interface Statistics {
  nodesExplored: number;
  nodesInFrontier: number;
  pathLength: number;
  pathCost: number;
  executionTime: number;
  currentStep: number;
  totalSteps: number;
  memoryUsage: number;
}

// Color scheme for visualization
export const CELL_COLORS = {
  empty: "#ffffff",
  wall: "#1e293b",
  start: "#10b981",
  goal: "#ef4444",
  visited: "#3b82f6",
  current: "#fbbf24",
  path: "#f97316",
  frontier: "#60a5fa",
} as const;

export const CELL_COLORS_DARK = {
  empty: "#0f172a",
  wall: "#475569",
  start: "#059669",
  goal: "#dc2626",
  visited: "#2563eb",
  current: "#f59e0b",
  path: "#ea580c",
  frontier: "#3b82f6",
} as const;

// Grid size configurations
export const GRID_CONFIGS = {
  small: { rows: 15, cols: 15, cellSize: 30 },
  medium: { rows: 30, cols: 30, cellSize: 20 },
  large: { rows: 50, cols: 50, cellSize: 12 },
  custom: { rows: 20, cols: 20, cellSize: 25 },
} as const;

// Algorithm information
export const ALGORITHM_INFO: Record<
  AlgorithmType,
  {
    name: string;
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
    guaranteesOptimal: boolean;
    complete: boolean;
  }
> = {
  astar: {
    name: "A* Search",
    description: "Best-first search using heuristic + actual cost",
    timeComplexity: "O(b^d)",
    spaceComplexity: "O(b^d)",
    guaranteesOptimal: true,
    complete: true,
  },
  bfs: {
    name: "Breadth-First Search",
    description: "Explores level by level using a queue",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    guaranteesOptimal: true,
    complete: true,
  },
  dfs: {
    name: "Depth-First Search",
    description: "Explores as far as possible using a stack",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(h)",
    guaranteesOptimal: false,
    complete: false,
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    description: "Finds shortest path using actual costs only",
    timeComplexity: "O((V + E) log V)",
    spaceComplexity: "O(V)",
    guaranteesOptimal: true,
    complete: true,
  },
  hill_climbing: {
    name: "Hill Climbing",
    description: "Greedy local search algorithm",
    timeComplexity: "O(∞)",
    spaceComplexity: "O(1)",
    guaranteesOptimal: false,
    complete: false,
  },
  simulated_annealing: {
    name: "Simulated Annealing",
    description: "Probabilistic optimization algorithm",
    timeComplexity: "O(∞)",
    spaceComplexity: "O(1)",
    guaranteesOptimal: false,
    complete: false,
  },
  genetic: {
    name: "Genetic Algorithm",
    description: "Evolution-based optimization algorithm",
    timeComplexity: "O(g × n × f)",
    spaceComplexity: "O(n)",
    guaranteesOptimal: false,
    complete: false,
  },
  minimax: {
    name: "Minimax",
    description: "Game tree search for optimal moves",
    timeComplexity: "O(b^m)",
    spaceComplexity: "O(bm)",
    guaranteesOptimal: true,
    complete: true,
  },
  alpha_beta: {
    name: "Alpha-Beta Pruning",
    description: "Optimized Minimax with pruning",
    timeComplexity: "O(b^(m/2))",
    spaceComplexity: "O(bm)",
    guaranteesOptimal: true,
    complete: true,
  },
  backtracking: {
    name: "Backtracking",
    description: "Systematic search with constraint checking",
    timeComplexity: "O(n!)",
    spaceComplexity: "O(n)",
    guaranteesOptimal: true,
    complete: true,
  },
  recursive: {
    name: "Recursive",
    description: "Recursive divide-and-conquer approach",
    timeComplexity: "O(2^n)",
    spaceComplexity: "O(n)",
    guaranteesOptimal: true,
    complete: true,
  },
};

// Puzzle Types
export interface PuzzleState {
  state: number[][];
  type: "trying" | "visiting" | "placing" | "backtracking" | "solution";
  row?: number;
  col?: number;
  value?: number;
}

export interface PuzzleResult {
  solved: boolean;
  steps: PuzzleState[];
  solution?: number[][];
  nodes_explored: number;
  moves?: number;
  algorithm: string;
  message?: string;
}

// Game Types
export type Player = "X" | "O" | "";
export type GameBoard = Player[][];

export interface GameMove {
  row: number;
  col: number;
  player: Player;
  score: number;
}

export interface GameResult {
  best_move?: [number, number];
  best_score?: number;
  winner?: Player | "draw";
  game_history?: Array<{
    player: Player;
    move: { row: number; col: number };
    board: GameBoard;
    score: number;
  }>;
  evaluations?: Array<{
    row: number;
    col: number;
    score: number;
    board: GameBoard;
  }>;
  total_moves?: number;
  algorithm: string;
}

// Tower of Hanoi Types
export interface HanoiMove {
  move: number;
  disk: number;
  from: string;
  to: string;
  description: string;
}

export interface HanoiResult {
  n_disks: number;
  total_moves: number;
  steps: HanoiMove[];
  optimal_moves: number;
  is_optimal: boolean;
}
