import { Button } from "@/components/ui/button";
import { Minus, Plus, RotateCcw } from "lucide-react";

interface FontSizeControlsProps {
  fontSize: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onReset: () => void;
  canIncrease: boolean;
  canDecrease: boolean;
}

export default function FontSizeControls({
  fontSize,
  onIncrease,
  onDecrease,
  onReset,
  canIncrease,
  canDecrease,
}: FontSizeControlsProps) {
  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={onDecrease}
        disabled={!canDecrease}
        className="h-8 w-8 rounded-full"
        aria-label="Decrease font size"
        title="Decrease font size"
      >
        <Minus className="w-3.5 h-3.5" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="h-8 px-2 text-xs font-medium min-w-[40px]"
        aria-label="Reset font size"
        title={`Current: ${fontSize}px (click to reset)`}
      >
        {fontSize}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onIncrease}
        disabled={!canIncrease}
        className="h-8 w-8 rounded-full"
        aria-label="Increase font size"
        title="Increase font size"
      >
        <Plus className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
