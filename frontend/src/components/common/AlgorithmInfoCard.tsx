/**
 * AlgorithmInfoCard - Reusable component for displaying algorithm information
 * Provides consistent UI for algorithm description, complexity, and features
 */

import { Card } from "@/components/ui/card";
import { Brain, Clock, Info, Target, Zap } from "lucide-react";
import { ReactNode } from "react";

interface AlgorithmInfoCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  goal?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  features?: string[];
  className?: string;
}

export function AlgorithmInfoCard({
  title,
  description,
  icon,
  goal,
  timeComplexity,
  spaceComplexity,
  features,
  className = "",
}: AlgorithmInfoCardProps) {
  return (
    <Card
      className={`p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-500 dark:bg-blue-600 rounded-lg flex-shrink-0">
          {icon || <Brain className="w-6 h-6 text-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {goal && (
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block">Goal:</strong>
                  <span className="text-muted-foreground">{goal}</span>
                </div>
              </div>
            )}

            {timeComplexity && (
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block">Time:</strong>
                  <span className="text-muted-foreground">
                    {timeComplexity}
                  </span>
                </div>
              </div>
            )}

            {spaceComplexity && (
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block">Space:</strong>
                  <span className="text-muted-foreground">
                    {spaceComplexity}
                  </span>
                </div>
              </div>
            )}

            {features && features.length > 0 && (
              <div className="flex items-start gap-2 col-span-full">
                <Info className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <strong className="block mb-1">Features:</strong>
                  <ul className="text-muted-foreground space-y-1">
                    {features.map((feature, index) => (
                      <li key={index} className="text-xs">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
