/**
 * StatisticsPanel - Reusable component for displaying real-time statistics
 * Provides consistent statistics display across all visualizers
 */

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Clock,
  LucideIcon,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

interface Statistic {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  color?: string;
}

interface StatisticsPanelProps {
  title?: string;
  statistics: Statistic[];
  className?: string;
}

export function StatisticsPanel({
  title = "Real-time Statistics",
  statistics,
  className = "",
}: StatisticsPanelProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {statistics.map((stat, index) => {
          const Icon = stat.icon || Activity;
          const color = stat.color || "text-blue-500";

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className={color}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">
                  {stat.label}
                </p>
                <p className="text-lg font-semibold truncate">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

// Predefined statistic configurations for common use cases
export const createPathfindingStats = (data: {
  nodesExplored: number;
  pathLength: number;
  pathCost: number;
  executionTime: number;
}): Statistic[] => [
  {
    label: "Nodes Explored",
    value: data.nodesExplored.toLocaleString(),
    icon: Activity,
    color: "text-blue-500",
  },
  {
    label: "Path Length",
    value: data.pathLength > 0 ? data.pathLength.toLocaleString() : "N/A",
    icon: Target,
    color: "text-orange-500",
  },
  {
    label: "Path Cost",
    value: data.pathCost > 0 ? data.pathCost.toFixed(2) : "N/A",
    icon: TrendingUp,
    color: "text-purple-500",
  },
  {
    label: "Execution Time",
    value:
      data.executionTime > 1000
        ? `${(data.executionTime / 1000).toFixed(2)}s`
        : `${data.executionTime.toFixed(0)}ms`,
    icon: Clock,
    color: "text-green-500",
  },
];

export const createPuzzleStats = (data: {
  moves: number;
  nodesExplored: number;
  solutionLength?: number;
  executionTime: number;
}): Statistic[] => [
  {
    label: "Moves Made",
    value: data.moves.toLocaleString(),
    icon: Zap,
    color: "text-yellow-500",
  },
  {
    label: "Nodes Explored",
    value: data.nodesExplored.toLocaleString(),
    icon: Activity,
    color: "text-blue-500",
  },
  {
    label: "Solution Length",
    value:
      data.solutionLength !== undefined
        ? data.solutionLength.toLocaleString()
        : "N/A",
    icon: Target,
    color: "text-orange-500",
  },
  {
    label: "Execution Time",
    value:
      data.executionTime > 1000
        ? `${(data.executionTime / 1000).toFixed(2)}s`
        : `${data.executionTime.toFixed(0)}ms`,
    icon: Clock,
    color: "text-green-500",
  },
];
