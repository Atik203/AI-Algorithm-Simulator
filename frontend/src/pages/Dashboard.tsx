import { apiClient } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useAppSelector } from "@/store/hooks";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Calendar,
  Clock,
  PlayCircle,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SimulationData {
  id: number;
  algorithm: string;
  created_at: string;
  path_found: boolean;
  nodes_explored: number;
  path_cost: number;
  execution_time: number;
}

interface DashboardStats {
  totalSimulations: number;
  successfulSimulations: number;
  favoriteAlgorithm: string;
  avgExecutionTime: number;
  totalNodesExplored: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  const [simulations, setSimulations] = useState<SimulationData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSimulations: 0,
    successfulSimulations: 0,
    favoriteAlgorithm: "N/A",
    avgExecutionTime: 0,
    totalNodesExplored: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get("/simulations/");
      const sims: SimulationData[] = response.data.results || response.data;

      setSimulations(sims.slice(0, 10)); // Latest 10 simulations

      // Calculate stats
      if (sims.length > 0) {
        const successful = sims.filter((s) => s.path_found).length;
        const totalNodes = sims.reduce((sum, s) => sum + s.nodes_explored, 0);
        const totalTime = sims.reduce((sum, s) => sum + s.execution_time, 0);

        // Find favorite algorithm
        const algorithmCount: Record<string, number> = {};
        sims.forEach((s) => {
          algorithmCount[s.algorithm] = (algorithmCount[s.algorithm] || 0) + 1;
        });
        const favorite = Object.entries(algorithmCount).reduce(
          (a, b) => (b[1] > a[1] ? b : a),
          ["N/A", 0]
        )[0];

        setStats({
          totalSimulations: sims.length,
          successfulSimulations: successful,
          favoriteAlgorithm: favorite.toUpperCase(),
          avgExecutionTime: totalTime / sims.length,
          totalNodesExplored: totalNodes,
        });
      }
    } catch (error: any) {
      toast.error("Failed to load dashboard data", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const algorithmNameMap: Record<string, string> = {
    astar: "A* Search",
    bfs: "Breadth-First Search",
    dfs: "Depth-First Search",
    dijkstra: "Dijkstra",
    hill_climbing: "Hill Climbing",
    simulated_annealing: "Simulated Annealing",
    genetic: "Genetic Algorithm",
  };

  const formatTime = (seconds: number) => {
    if (seconds < 0.001) return `${(seconds * 1000000).toFixed(0)} μs`;
    if (seconds < 1) return `${(seconds * 1000).toFixed(2)} ms`;
    return `${seconds.toFixed(3)} s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's your algorithm simulation overview
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => navigate("/simulator")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Start Simulation
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Simulations
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalSimulations}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.successfulSimulations} successful
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Success Rate
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalSimulations > 0
                    ? Math.round(
                        (stats.successfulSimulations / stats.totalSimulations) *
                          100
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Path found rate</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Favorite Algorithm
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.favoriteAlgorithm}
                </div>
                <p className="text-xs text-muted-foreground">Most used</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Execution Time
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatTime(stats.avgExecutionTime)}
                </div>
                <p className="text-xs text-muted-foreground">Per simulation</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Recent Simulations */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recent Simulations
              </CardTitle>
              <CardDescription>
                Your latest algorithm executions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {simulations.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No simulations yet
                  </p>
                  <Button onClick={() => navigate("/simulator")}>
                    Start Your First Simulation
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {simulations.map((sim) => (
                    <div
                      key={sim.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            sim.path_found ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">
                            {algorithmNameMap[sim.algorithm] || sim.algorithm}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(sim.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {sim.nodes_explored} nodes explored
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(sim.execution_time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
