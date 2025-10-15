import { useAppSelector } from "@/store/hooks";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { fadeInUp, scaleIn, staggerContainer } from "@lib/animations";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  Code2,
  Flame,
  GitBranch,
  Layers,
  Network,
  Repeat,
  Route,
  Shuffle,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Algorithm data with icons and categories
const algorithms = {
  classic: [
    {
      name: "A* Search",
      icon: Target,
      description: "Informed search using heuristics for optimal pathfinding",
      color: "from-blue-500 to-cyan-500",
      timeComplexity: "O(b^d)",
      spaceComplexity: "O(b^d)",
      useCases: "GPS navigation, game AI, robotics",
      optimal: "Yes (with admissible heuristic)",
    },
    {
      name: "Breadth-First Search",
      icon: GitBranch,
      description: "Level-order traversal exploring all neighbors first",
      color: "from-green-500 to-emerald-500",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      useCases: "Shortest path in unweighted graphs, web crawling",
      optimal: "Yes (unweighted graphs)",
    },
    {
      name: "Depth-First Search",
      icon: Layers,
      description: "Explores as far as possible before backtracking",
      color: "from-orange-500 to-red-500",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(h)",
      useCases: "Maze solving, topological sorting, cycle detection",
      optimal: "No",
    },
    {
      name: "Dijkstra's Algorithm",
      icon: Route,
      description: "Shortest path algorithm for weighted graphs",
      color: "from-amber-500 to-orange-500",
      timeComplexity: "O((V + E) log V)",
      spaceComplexity: "O(V)",
      useCases: "Network routing, transportation systems",
      optimal: "Yes (non-negative weights)",
    },
  ],
  heuristic: [
    {
      name: "Hill Climbing",
      icon: TrendingUp,
      description: "Greedy local search climbing to peak",
      color: "from-green-500 to-teal-500",
      timeComplexity: "O(∞)",
      spaceComplexity: "O(1)",
      useCases: "Optimization problems, AI game playing",
      optimal: "No (local optima)",
    },
    {
      name: "Simulated Annealing",
      icon: Flame,
      description: "Probabilistic technique accepting occasional worse moves",
      color: "from-red-500 to-orange-500",
      timeComplexity: "O(∞)",
      spaceComplexity: "O(1)",
      useCases: "VLSI design, scheduling, neural networks",
      optimal: "Probabilistically complete",
    },
    {
      name: "Genetic Algorithm",
      icon: Brain,
      description: "Evolutionary optimization inspired by natural selection",
      color: "from-purple-500 to-indigo-500",
      timeComplexity: "O(g × n × f)",
      spaceComplexity: "O(n)",
      useCases: "Machine learning, scheduling, design optimization",
      optimal: "Probabilistically complete",
    },
  ],
};

// Upcoming algorithms that are planned but not yet implemented
const upcomingAlgorithms = [
  {
    name: "Bidirectional BFS",
    icon: Repeat,
    description: "Simultaneous search from start and goal nodes",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Depth-Limited DFS",
    icon: Layers,
    description: "DFS with maximum depth constraint",
    color: "from-red-500 to-rose-500",
  },
  {
    name: "Iterative Deepening DFS",
    icon: Route,
    description: "Combines benefits of BFS and DFS with depth limits",
    color: "from-indigo-500 to-purple-500",
  },
  {
    name: "Uniform Cost Search",
    icon: Network,
    description: "Optimal search expanding least-cost nodes first",
    color: "from-teal-500 to-cyan-500",
  },
  {
    name: "Stochastic Hill Climbing",
    icon: Shuffle,
    description: "Random selection among uphill moves",
    color: "from-blue-500 to-purple-500",
  },
  {
    name: "Random Restart Hill Climbing",
    icon: Repeat,
    description: "Multiple hill climbing attempts from random starts",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "First-Choice Hill Climbing",
    icon: Zap,
    description: "Selects first better neighbor found",
    color: "from-yellow-500 to-orange-500",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.user);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10 flex-1">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-16"
        >
          {/* Welcome message for authenticated users */}
          {isAuthenticated && user && (
            <motion.div
              variants={fadeInUp}
              className="mb-6 inline-block px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full"
            >
              <p className="text-sm font-medium">
                Welcome back,{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {user.username}
                </span>
                ! 👋
              </p>
            </motion.div>
          )}

          <motion.div variants={scaleIn} className="flex justify-center mb-6">
            <div className="relative">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-30"
              />
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-full">
                <Activity className="h-12 w-12 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
          >
            AI Search Algorithm Simulator
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
          >
            Interactive visualization and real-time execution of 7 powerful
            search algorithms, with 7 more coming soon
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={() => navigate("/simulator")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg cursor-pointer text-lg px-8"
              >
                {isAuthenticated ? "Go to Simulator" : "Try Simulator"}
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            {!isAuthenticated && (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={() => navigate("/login")}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg cursor-pointer text-lg px-8"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/register")}
                    className="cursor-pointer border-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-lg px-8"
                  >
                    Sign Up Free
                  </Button>
                </motion.div>
              </>
            )}

            {isAuthenticated && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="cursor-pointer border-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-lg px-8"
                >
                  View Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />7 Algorithms
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />7 More Coming
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Real-time Visualization
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Step-by-step Execution
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Free & Open Source
            </span>
          </motion.div>
        </motion.div>

        {/* Classic Algorithms Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-3 mb-4 justify-center"
          >
            <Code2 className="h-8 w-8 text-blue-500" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Classic Search Algorithms
            </h2>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Foundational algorithms for graph traversal and pathfinding problems
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {algorithms.classic.map((algo, index) => (
              <motion.div
                key={algo.name}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="cursor-pointer"
              >
                <Card className="p-6 h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
                  <div
                    className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${algo.color} mb-4 w-fit`}
                  >
                    <algo.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{algo.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {algo.description}
                  </p>

                  <div className="mt-auto space-y-2 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        Time:
                      </span>
                      <code className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded">
                        {algo.timeComplexity}
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        Space:
                      </span>
                      <code className="px-2 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded">
                        {algo.spaceComplexity}
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        Optimal:
                      </span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {algo.optimal}
                      </span>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground italic">
                        {algo.useCases}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Heuristic Algorithms Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-3 mb-4 justify-center"
          >
            <Brain className="h-8 w-8 text-purple-500" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Heuristic & Optimization Algorithms
            </h2>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Advanced algorithms for optimization and probabilistic
            problem-solving
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {algorithms.heuristic.map((algo, index) => (
              <motion.div
                key={algo.name}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="cursor-pointer"
              >
                <Card className="p-6 h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
                  <div
                    className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${algo.color} mb-4 w-fit`}
                  >
                    <algo.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{algo.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {algo.description}
                  </p>

                  <div className="mt-auto space-y-2 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        Time:
                      </span>
                      <code className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded">
                        {algo.timeComplexity}
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        Space:
                      </span>
                      <code className="px-2 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded">
                        {algo.spaceComplexity}
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        Optimal:
                      </span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {algo.optimal}
                      </span>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground italic">
                        {algo.useCases}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Algorithms Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-3 mb-4 justify-center"
          >
            <Clock className="h-8 w-8 text-amber-500" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
              Upcoming Algorithms
            </h2>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            These algorithms are planned for future releases. Stay tuned for
            updates!
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {upcomingAlgorithms.map((algo, index) => (
              <motion.div
                key={algo.name}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="p-6 h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-2 border-dashed border-amber-500/30 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  {/* "Coming Soon" Badge */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      Soon
                    </span>
                  </div>

                  <div
                    className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${algo.color} opacity-60 mb-4`}
                  >
                    <algo.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-muted-foreground">
                    {algo.name}
                  </h3>
                  <p className="text-sm text-muted-foreground/70">
                    {algo.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="relative inline-block mb-4"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30"
            />
            <Sparkles className="relative h-12 w-12 text-purple-500" />
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            {isAuthenticated ? "Continue Learning!" : "Ready to explore?"}
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            {isAuthenticated
              ? "Access your dashboard to view simulation history and track your progress"
              : "Join thousands of developers learning and visualizing AI search algorithms in real-time"}
          </motion.p>

          <motion.div variants={fadeInUp} className="flex justify-center gap-4">
            {isAuthenticated ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={() => navigate("/simulator")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg cursor-pointer"
                  >
                    Open Simulator
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    className="cursor-pointer"
                  >
                    View Dashboard
                  </Button>
                </motion.div>
              </>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => navigate("/register")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg cursor-pointer"
                >
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
