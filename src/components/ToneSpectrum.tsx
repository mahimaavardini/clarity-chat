import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Frown, Meh, Smile, Sparkles } from "lucide-react";

interface ToneSpectrumProps {
  tone: string;
  animated?: boolean;
}

function analyzeTone(tone: string): { emotional: number; formality: number } {
  const lowerTone = tone.toLowerCase();
  
  // Emotional spectrum: -1 (negative) to 1 (positive)
  let emotional = 0;
  if (lowerTone.includes("positive") || lowerTone.includes("friendly") || lowerTone.includes("happy") || lowerTone.includes("cheerful") || lowerTone.includes("enthusiastic")) {
    emotional = 0.7;
  } else if (lowerTone.includes("encouraging") || lowerTone.includes("warm") || lowerTone.includes("supportive")) {
    emotional = 0.5;
  } else if (lowerTone.includes("neutral") || lowerTone.includes("matter-of-fact") || lowerTone.includes("objective")) {
    emotional = 0;
  } else if (lowerTone.includes("serious") || lowerTone.includes("concerned") || lowerTone.includes("cautious")) {
    emotional = -0.3;
  } else if (lowerTone.includes("negative") || lowerTone.includes("critical") || lowerTone.includes("frustrated") || lowerTone.includes("angry")) {
    emotional = -0.7;
  } else if (lowerTone.includes("sarcastic") || lowerTone.includes("ironic")) {
    emotional = -0.4;
  }

  // Formality spectrum: -1 (casual) to 1 (formal)
  let formality = 0;
  if (lowerTone.includes("formal") || lowerTone.includes("professional") || lowerTone.includes("academic")) {
    formality = 0.7;
  } else if (lowerTone.includes("polite") || lowerTone.includes("respectful")) {
    formality = 0.4;
  } else if (lowerTone.includes("casual") || lowerTone.includes("informal") || lowerTone.includes("conversational")) {
    formality = -0.5;
  } else if (lowerTone.includes("playful") || lowerTone.includes("humorous") || lowerTone.includes("slangy")) {
    formality = -0.7;
  }

  return { emotional, formality };
}

export default function ToneSpectrum({ tone, animated = true }: ToneSpectrumProps) {
  const [displayValues, setDisplayValues] = useState({ emotional: 0, formality: 0 });
  const targetValues = analyzeTone(tone);

  useEffect(() => {
    if (!animated) {
      setDisplayValues(targetValues);
      return;
    }

    const duration = 800;
    const steps = 40;
    const emotionalIncrement = targetValues.emotional / steps;
    const formalityIncrement = targetValues.formality / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        setDisplayValues(targetValues);
        clearInterval(timer);
      } else {
        setDisplayValues({
          emotional: emotionalIncrement * step,
          formality: formalityIncrement * step,
        });
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [tone, animated]);

  const emotionalPercent = ((displayValues.emotional + 1) / 2) * 100;
  const formalityPercent = ((displayValues.formality + 1) / 2) * 100;

  return (
    <div className="space-y-6 p-4 rounded-xl bg-card border border-border/50">
      <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        Tone Spectrum
      </h3>

      {/* Emotional Scale */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Frown className="w-4 h-4 text-destructive" />
            Negative
          </span>
          <span className="flex items-center gap-1">
            <Meh className="w-4 h-4 text-muted-foreground" />
            Neutral
          </span>
          <span className="flex items-center gap-1">
            Positive
            <Smile className="w-4 h-4 text-clarity" />
          </span>
        </div>
        <div className="relative h-3 rounded-full bg-gradient-to-r from-destructive/30 via-muted to-clarity/30 overflow-hidden">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-foreground border-2 border-background shadow-lg transition-all duration-300"
            style={{ left: `calc(${emotionalPercent}% - 8px)` }}
          />
        </div>
      </div>

      {/* Formality Scale */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Casual</span>
          <span>Neutral</span>
          <span>Formal</span>
        </div>
        <div className="relative h-3 rounded-full bg-gradient-to-r from-metaphor/30 via-muted to-primary/30 overflow-hidden">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-foreground border-2 border-background shadow-lg transition-all duration-300"
            style={{ left: `calc(${formalityPercent}% - 8px)` }}
          />
        </div>
      </div>

      {/* Current Tone Label */}
      <div className="text-center pt-2 border-t border-border/50">
        <span className="text-sm text-muted-foreground">Detected tone: </span>
        <span className="font-medium text-foreground">{tone}</span>
      </div>
    </div>
  );
}
