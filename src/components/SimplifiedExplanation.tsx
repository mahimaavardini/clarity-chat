import { Card } from "@/components/ui/card";
import { Lightbulb, BookOpen } from "lucide-react";

interface SimplifiedExplanationProps {
  explanation: string;
}

export default function SimplifiedExplanation({ explanation }: SimplifiedExplanationProps) {
  if (!explanation) return null;

  return (
    <Card className="p-6 bg-accent/30 border-accent/50 animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-accent">
          <Lightbulb className="w-6 h-6 text-accent-foreground" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent-foreground" />
            <h3 className="font-display font-semibold text-accent-foreground">
              Simplified Explanation
            </h3>
          </div>
          <p className="text-base text-foreground leading-relaxed">
            {explanation}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            This is a plain-language version of the text, with figurative language explained directly.
          </p>
        </div>
      </div>
    </Card>
  );
}
