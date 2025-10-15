import { apiClient } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useAppSelector } from "@/store/hooks";
import { motion } from "framer-motion";
import {
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Gamepad2,
  Grid3x3,
  Hash,
  Lightbulb,
  Puzzle,
  Trash2,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Simulation {
  id: number;
  algorithm: string;
  algorithm_display?: string;
  simulation_type?: string;
  simulation_type_display?: string;
  path_found: boolean;
  solved?: boolean;
  nodes_explored: number;
  path_cost: number;
  execution_time: number;
  total_moves?: number;
  board_size?: number;
  created_at: string;
}

const algorithmNames: Record<string, string> = {
  astar: "A* Search",
  bfs: "Breadth-First Search",
  dfs: "Depth-First Search",
  dijkstra: "Dijkstra's Algorithm",
  hill_climbing: "Hill Climbing",
  simulated_annealing: "Simulated Annealing",
  genetic: "Genetic Algorithm",
  "8-puzzle-astar": "8-Puzzle A*",
  "8-puzzle-bfs": "8-Puzzle BFS",
  "n-queens": "N-Queens",
  sudoku: "Sudoku",
  "tic-tac-toe-minimax": "Tic-Tac-Toe Minimax",
  "tic-tac-toe-alphabeta": "Tic-Tac-Toe Alpha-Beta",
  "tower-of-hanoi": "Tower of Hanoi",
  connect4: "Connect 4",
};

const simulationTypeNames: Record<string, string> = {
  pathfinding: "Pathfinding",
  "8-puzzle": "8-Puzzle",
  "n-queens": "N-Queens",
  sudoku: "Sudoku",
  "tic-tac-toe": "Tic-Tac-Toe",
  "tower-of-hanoi": "Tower of Hanoi",
  connect4: "Connect 4",
};

const getSimulationTypeIcon = (type: string) => {
  switch (type) {
    case "pathfinding":
      return <Grid3x3 className="h-5 w-5" />;
    case "8-puzzle":
    case "sudoku":
      return <Puzzle className="h-5 w-5" />;
    case "n-queens":
      return <Crown className="h-5 w-5" />;
    case "tic-tac-toe":
    case "connect4":
      return <Gamepad2 className="h-5 w-5" />;
    case "tower-of-hanoi":
      return <Lightbulb className="h-5 w-5" />;
    default:
      return <Grid3x3 className="h-5 w-5" />;
  }
};

export default function History() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchSimulations();
  }, [isAuthenticated, navigate]);

  const fetchSimulations = async () => {
    try {
      const response = await apiClient.get("/simulations/");
      // Ensure response.data is an array
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setSimulations(data);
    } catch (error: any) {
      console.error("Error fetching simulations:", error);
      toast.error("Failed to load simulations", {
        description: error.response?.data?.detail || "Please try again",
      });
      setSimulations([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const deleteSimulation = async (id: number) => {
    try {
      await apiClient.delete(`/simulations/${id}/`);
      setSimulations(simulations.filter((sim) => sim.id !== id));
      toast.success("Simulation deleted");
    } catch (error: any) {
      toast.error("Failed to delete simulation", {
        description: error.response?.data?.detail || "Please try again",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading simulations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Simulation History
            </h1>
            <p className="text-muted-foreground">
              View and manage your algorithm executions
            </p>
          </motion.div>

          {/* Simulations List */}
          {simulations.length === 0 ? (
            <motion.div variants={fadeInUp}>
              <Card className="p-12 text-center">
                <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No simulations yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start by running your first algorithm in the simulator
                </p>
                <Button onClick={() => navigate("/simulator")}>
                  Go to Simulator
                </Button>
              </Card>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {simulations.map((sim, index) => (
                <motion.div
                  key={sim.id}
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{ y: -4 }}
                >
                  <Card className="p-6 h-full flex flex-col">
                    {/* Algorithm Name & Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {getSimulationTypeIcon(
                            sim.simulation_type || "pathfinding"
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">
                            {sim.algorithm_display ||
                              algorithmNames[sim.algorithm] ||
                              sim.algorithm}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-1">
                            {sim.simulation_type_display ||
                              simulationTypeNames[
                                sim.simulation_type || "pathfinding"
                              ]}
                          </p>
                          <div className="flex items-center gap-2">
                            {sim.path_found || sim.solved ? (
                              <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Success</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                                <XCircle className="h-4 w-4" />
                                <span>
                                  {sim.simulation_type === "pathfinding"
                                    ? "No Path"
                                    : "Unsolved"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteSimulation(sim.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Statistics */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Nodes Explored:
                        </span>
                        <span className="font-medium">
                          {sim.nodes_explored}
                        </span>
                      </div>
                      {sim.simulation_type === "pathfinding" && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Path Cost:
                          </span>
                          <span className="font-medium">
                            {sim.path_cost.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {sim.total_moves !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Total Moves:
                          </span>
                          <span className="font-medium">{sim.total_moves}</span>
                        </div>
                      )}
                      {sim.board_size !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          <Grid3x3 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Board Size:
                          </span>
                          <span className="font-medium">
                            {sim.board_size}x{sim.board_size}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Execution:
                        </span>
                        <span className="font-medium">
                          {sim.execution_time < 0.001
                            ? `${(sim.execution_time * 1000000).toFixed(0)} μs`
                            : sim.execution_time < 1
                            ? `${(sim.execution_time * 1000).toFixed(2)} ms`
                            : `${sim.execution_time.toFixed(3)}s`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm pt-2 border-t">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(sim.created_at)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
