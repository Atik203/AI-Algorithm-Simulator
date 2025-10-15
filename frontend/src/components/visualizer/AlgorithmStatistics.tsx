/**
 * AlgorithmStatistics - Real-time metrics and performance dashboard
 */

import { motion } from 'framer-motion';
import {
  Activity,
  Clock,
  TrendingUp,
  Layers,
  Target,
  Zap,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Statistics } from '@/types/visualizer';
import { ALGORITHM_INFO } from '@/types/visualizer';
import type { AlgorithmType } from '@/types/visualizer';
import { formatExecutionTime } from '@/lib/visualizer-utils';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface AlgorithmStatisticsProps {
  statistics: Statistics;
  algorithm: AlgorithmType;
  isComplete: boolean;
}

export function AlgorithmStatistics({
  statistics,
  algorithm,
  isComplete,
}: AlgorithmStatisticsProps) {
  const algorithmInfo = ALGORITHM_INFO[algorithm];

  const stats = [
    {
      icon: Activity,
      label: 'Nodes Explored',
      value: statistics.nodesExplored.toLocaleString(),
      color: 'text-blue-500',
    },
    {
      icon: Layers,
      label: 'Nodes in Frontier',
      value: statistics.nodesInFrontier.toLocaleString(),
      color: 'text-cyan-500',
    },
    {
      icon: Target,
      label: 'Path Length',
      value: statistics.pathLength > 0 ? statistics.pathLength.toLocaleString() : 'N/A',
      color: 'text-orange-500',
    },
    {
      icon: TrendingUp,
      label: 'Path Cost',
      value: statistics.pathCost > 0 ? statistics.pathCost.toFixed(2) : 'N/A',
      color: 'text-purple-500',
    },
    {
      icon: Clock,
      label: 'Execution Time',
      value: formatExecutionTime(statistics.executionTime),
      color: 'text-green-500',
    },
    {
      icon: Zap,
      label: 'Progress',
      value: `${((statistics.currentStep / statistics.totalSteps) * 100).toFixed(1)}%`,
      color: 'text-yellow-500',
    },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
      {/* Real-time Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Real-time Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className={`${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                  <p className="text-lg font-semibold truncate">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Algorithm: {algorithmInfo.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Description</p>
            <p className="text-sm">{algorithmInfo.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Time Complexity</p>
              <p className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                {algorithmInfo.timeComplexity}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Space Complexity</p>
              <p className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                {algorithmInfo.spaceComplexity}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  algorithmInfo.guaranteesOptimal ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm">
                {algorithmInfo.guaranteesOptimal ? 'Optimal' : 'Non-optimal'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  algorithmInfo.complete ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm">
                {algorithmInfo.complete ? 'Complete' : 'Incomplete'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    Algorithm Complete!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {statistics.pathLength > 0
                      ? `Path found with ${statistics.pathLength} steps`
                      : 'No path found'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
