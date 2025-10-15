import { ModeToggle } from "@components/ModeToggle";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            AI Search Algorithm Simulator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Interactive visualization of informed and local search algorithms
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">A* Search</h3>
            <p className="text-sm text-muted-foreground">
              Informed search using heuristics for optimal pathfinding
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">BFS & DFS</h3>
            <p className="text-sm text-muted-foreground">
              Classic uninformed search algorithms for graph traversal
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Hill Climbing</h3>
            <p className="text-sm text-muted-foreground">
              Local search optimization for finding local maxima
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Simulated Annealing</h3>
            <p className="text-sm text-muted-foreground">
              Probabilistic technique for approximating global optimum
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Dijkstra</h3>
            <p className="text-sm text-muted-foreground">
              Shortest path algorithm for weighted graphs
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Genetic Algorithm</h3>
            <p className="text-sm text-muted-foreground">
              Evolutionary optimization inspired by natural selection
            </p>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/login")}>
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Button>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Built with React + TypeScript + Django REST Framework
          </p>
        </div>
      </div>
    </div>
  );
}
