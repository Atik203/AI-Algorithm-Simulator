/**
 * ConfigurationPanel - Reusable component for algorithm configuration
 * Provides consistent configuration UI across all visualizers
 */

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Settings } from "lucide-react";
import { ReactNode } from "react";

export interface ConfigOption {
  id: string;
  label: string;
  type: "select" | "slider" | "custom";
  value: any;
  onChange: (value: any) => void;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  description?: string;
  customRender?: () => ReactNode;
}

interface ConfigurationPanelProps {
  title?: string;
  options: ConfigOption[];
  className?: string;
  columns?: 1 | 2;
}

export function ConfigurationPanel({
  title = "Configuration",
  options,
  className = "",
  columns = 2,
}: ConfigurationPanelProps) {
  const renderOption = (option: ConfigOption) => {
    switch (option.type) {
      case "select":
        return (
          <div key={option.id} className="space-y-2">
            <Label htmlFor={option.id}>{option.label}</Label>
            {option.description && (
              <p className="text-xs text-muted-foreground">
                {option.description}
              </p>
            )}
            <Select
              value={option.value}
              onValueChange={option.onChange}
              disabled={option.disabled}
            >
              <SelectTrigger id={option.id}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {option.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "slider":
        return (
          <div key={option.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={option.id}>{option.label}</Label>
              <span className="text-sm font-semibold">{option.value}</span>
            </div>
            {option.description && (
              <p className="text-xs text-muted-foreground">
                {option.description}
              </p>
            )}
            <Slider
              id={option.id}
              value={[option.value]}
              onValueChange={([value]) => option.onChange(value)}
              min={option.min || 0}
              max={option.max || 100}
              step={option.step || 1}
              disabled={option.disabled}
            />
            {option.min !== undefined && option.max !== undefined && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{option.min}</span>
                <span>{option.max}</span>
              </div>
            )}
          </div>
        );

      case "custom":
        return (
          <div key={option.id} className="space-y-2">
            {option.customRender?.()}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5" />
        {title}
      </h3>
      <div
        className={`grid gap-4 ${
          columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {options.map((option) => renderOption(option))}
      </div>
    </Card>
  );
}
