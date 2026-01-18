import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ConfidenceMeterProps {
  level: "high" | "medium" | "low";
  label?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

const levelValues = {
  high: 90,
  medium: 60,
  low: 30,
};

const levelColors = {
  high: "stroke-confidence-high",
  medium: "stroke-confidence-medium",
  low: "stroke-confidence-low",
};

const levelBgColors = {
  high: "bg-confidence-high/20",
  medium: "bg-confidence-medium/20",
  low: "bg-confidence-low/20",
};

const sizeConfig = {
  sm: { size: 48, strokeWidth: 4, fontSize: "text-xs" },
  md: { size: 64, strokeWidth: 5, fontSize: "text-sm" },
  lg: { size: 80, strokeWidth: 6, fontSize: "text-base" },
};

export default function ConfidenceMeter({
  level,
  label,
  size = "md",
  showLabel = true,
  animated = true,
}: ConfidenceMeterProps) {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : levelValues[level]);
  const targetValue = levelValues[level];
  const config = sizeConfig[size];
  const radius = (config.size - config.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayValue / 100) * circumference;

  useEffect(() => {
    if (!animated) {
      setDisplayValue(targetValue);
      return;
    }

    const duration = 1000;
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setDisplayValue(targetValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetValue, animated]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("relative rounded-full", levelBgColors[level])}>
        <svg
          width={config.size}
          height={config.size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn(levelColors[level], "transition-all duration-300")}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-semibold text-foreground", config.fontSize)}>
            {displayValue}%
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={cn("font-medium capitalize", config.fontSize, `text-confidence-${level}`)}>
          {label || level}
        </span>
      )}
    </div>
  );
}
