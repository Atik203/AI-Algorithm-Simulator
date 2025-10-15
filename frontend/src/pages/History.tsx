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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Pagination calculations
  const totalPages = Math.ceil(simulations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSimulations = simulations.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            <>
              <div className="space-y-4">
                {currentSimulations.map((sim, index) => (
                  <motion.div
                    key={sim.id}
                    variants={fadeInUp}
                    custom={index}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex items-center gap-6">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800">
                            {getSimulationTypeIcon(
                              sim.simulation_type || "pathfinding"
                            )}
                          </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          {/* Algorithm & Type */}
                          <div className="col-span-1">
                            <h3 className="font-semibold text-base mb-1">
                              {sim.algorithm_display ||
                                algorithmNames[sim.algorithm] ||
                                sim.algorithm}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {sim.simulation_type_display ||
                                simulationTypeNames[
                                  sim.simulation_type || "pathfinding"
                                ]}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {sim.path_found || sim.solved ? (
                                <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>Success</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                                  <XCircle className="h-3 w-3" />
                                  <span>
                                    {sim.simulation_type === "pathfinding"
                                      ? "No Path"
                                      : "Unsolved"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Statistics Grid */}
                          <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                <Hash className="h-3 w-3" />
                                <span>Nodes</span>
                              </div>
                              <div className="text-sm font-semibold">
                                {sim.nodes_explored}
                              </div>
                            </div>

                            {sim.simulation_type === "pathfinding" && (
                              <div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                  <TrendingUp className="h-3 w-3" />
                                  <span>Path Cost</span>
                                </div>
                                <div className="text-sm font-semibold">
                                  {sim.path_cost.toFixed(2)}
                                </div>
                              </div>
                            )}

                            {sim.total_moves !== undefined && (
                              <div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                  <TrendingUp className="h-3 w-3" />
                                  <span>Moves</span>
                                </div>
                                <div className="text-sm font-semibold">
                                  {sim.total_moves}
                                </div>
                              </div>
                            )}

                            {sim.board_size !== undefined && (
                              <div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                  <Grid3x3 className="h-3 w-3" />
                                  <span>Board</span>
                                </div>
                                <div className="text-sm font-semibold">
                                  {sim.board_size}x{sim.board_size}
                                </div>
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                <Clock className="h-3 w-3" />
                                <span>Time</span>
                              </div>
                              <div className="text-sm font-semibold">
                                {sim.execution_time < 0.001
                                  ? `${(sim.execution_time * 1000000).toFixed(
                                      0
                                    )} μs`
                                  : sim.execution_time < 1
                                  ? `${(sim.execution_time * 1000).toFixed(
                                      2
                                    )} ms`
                                  : `${sim.execution_time.toFixed(3)}s`}
                              </div>
                            </div>
                          </div>

                          {/* Date & Actions */}
                          <div className="col-span-1 flex items-center justify-between md:justify-end gap-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(sim.created_at)}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteSimulation(sim.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <motion.div
                  variants={fadeInUp}
                  className="flex items-center justify-center gap-2 mt-8"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page)}
                          className={
                            currentPage === page
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              : ""
                          }
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
