import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Volume2, Lightbulb, ArrowRight } from "lucide-react";
import type { SarcasmInstance, MetaphorInstance } from "@/types/analysis";
import AudioPlayback from "./AudioPlayback";

interface InlineHighlighterProps {
  text: string;
  sarcasmInstances: SarcasmInstance[];
  figurativeInstances: MetaphorInstance[];
}

interface HighlightedPhrase {
  phrase: string;
  type: "sarcasm" | "figurative";
  literalMeaning: string;
  intendedMeaning: string;
  explanation: string;
  start: number;
  end: number;
}

export default function InlineHighlighter({
  text,
  sarcasmInstances,
  figurativeInstances,
}: InlineHighlighterProps) {
  const [activePhrase, setActivePhrase] = useState<string | null>(null);

  // Find all phrase positions in the text
  const findPhrasePositions = (): HighlightedPhrase[] => {
    const positions: HighlightedPhrase[] = [];

    sarcasmInstances.forEach((instance) => {
      const lowerText = text.toLowerCase();
      const lowerPhrase = instance.phrase.toLowerCase();
      const start = lowerText.indexOf(lowerPhrase);
      if (start !== -1) {
        positions.push({
          phrase: text.substring(start, start + instance.phrase.length),
          type: "sarcasm",
          literalMeaning: instance.literalMeaning,
          intendedMeaning: instance.intendedMeaning,
          explanation: instance.explanation,
          start,
          end: start + instance.phrase.length,
        });
      }
    });

    figurativeInstances.forEach((instance) => {
      const lowerText = text.toLowerCase();
      const lowerPhrase = instance.phrase.toLowerCase();
      const start = lowerText.indexOf(lowerPhrase);
      if (start !== -1) {
        positions.push({
          phrase: text.substring(start, start + instance.phrase.length),
          type: "figurative",
          literalMeaning: instance.literalMeaning,
          intendedMeaning: instance.intendedMeaning,
          explanation: instance.explanation,
          start,
          end: start + instance.phrase.length,
        });
      }
    });

    // Sort by position
    return positions.sort((a, b) => a.start - b.start);
  };

  const renderHighlightedText = () => {
    const positions = findPhrasePositions();
    
    if (positions.length === 0) {
      return <span>{text}</span>;
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    positions.forEach((pos, idx) => {
      // Add text before this phrase
      if (pos.start > lastIndex) {
        elements.push(
          <span key={`text-${idx}`}>{text.substring(lastIndex, pos.start)}</span>
        );
      }

      // Add highlighted phrase
      const isSarcasm = pos.type === "sarcasm";
      elements.push(
        <Popover key={`phrase-${idx}`}>
          <PopoverTrigger asChild>
            <button
              className={`inline px-1 py-0.5 rounded cursor-pointer transition-all duration-200 
                ${isSarcasm 
                  ? "bg-sarcasm/20 border-b-2 border-sarcasm hover:bg-sarcasm/30" 
                  : "bg-metaphor/20 border-b-2 border-metaphor hover:bg-metaphor/30"
                }
                ${activePhrase === pos.phrase ? "ring-2 ring-offset-2 ring-primary" : ""}
              `}
              onClick={() => setActivePhrase(pos.phrase)}
            >
              {pos.phrase}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 space-y-3" align="start">
            <div className="flex items-center gap-2">
              <Badge className={isSarcasm ? "bg-sarcasm text-white" : "bg-metaphor text-white"}>
                {isSarcasm ? "Sarcasm" : "Figurative"}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Says: </span>
                <span className="text-foreground">{pos.literalMeaning}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <ArrowRight className="w-3 h-3" />
              </div>
              <div className="text-sm">
                <span className={isSarcasm ? "text-sarcasm" : "text-metaphor"}>Means: </span>
                <span className="font-medium">{pos.intendedMeaning}</span>
              </div>
            </div>
            
            <div className="pt-2 border-t border-border">
              <div className="flex items-start gap-2 text-sm">
                <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{pos.explanation}</span>
              </div>
            </div>
            
            <AudioPlayback 
              text={`${pos.phrase}. This literally says: ${pos.literalMeaning}. But it actually means: ${pos.intendedMeaning}`}
              variant="compact"
              label="Listen"
            />
          </PopoverContent>
        </Popover>
      );

      lastIndex = pos.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(
        <span key="text-end">{text.substring(lastIndex)}</span>
      );
    }

    return elements;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Click highlighted phrases for explanations</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 rounded bg-sarcasm"></span>
          <span className="text-xs">Sarcasm</span>
          <span className="w-3 h-1 rounded bg-metaphor ml-2"></span>
          <span className="text-xs">Figurative</span>
        </div>
      </div>
      <p className="text-lg leading-relaxed text-foreground">
        {renderHighlightedText()}
      </p>
    </div>
  );
}
