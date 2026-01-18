import { Card } from "@/components/ui/card";
import { ArrowRight, MessageSquare, Lightbulb } from "lucide-react";
import type { SarcasmInstance, MetaphorInstance } from "@/types/analysis";

interface ComparisonViewProps {
  sarcasmInstances: SarcasmInstance[];
  figurativeInstances: MetaphorInstance[];
}

interface ComparisonCardProps {
  phrase: string;
  literalMeaning: string;
  intendedMeaning: string;
  type: "sarcasm" | "figurative";
  index: number;
}

function ComparisonCard({ phrase, literalMeaning, intendedMeaning, type, index }: ComparisonCardProps) {
  const isSarcasm = type === "sarcasm";
  
  return (
    <Card 
      className="overflow-hidden animate-slide-up border-0 shadow-calm"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header with original phrase */}
      <div className={`p-4 ${isSarcasm ? 'bg-sarcasm/10' : 'bg-metaphor/10'}`}>
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {isSarcasm ? 'Sarcastic Statement' : 'Figurative Expression'}
        </p>
        <p className="text-foreground font-medium italic">"{phrase}"</p>
      </div>
      
      {/* Comparison columns */}
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* What they said */}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">What They Said</span>
          </div>
          <p className="text-sm text-foreground/80">{literalMeaning}</p>
        </div>
        
        {/* Arrow for desktop */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className={`p-2 rounded-full ${isSarcasm ? 'bg-sarcasm' : 'bg-metaphor'}`}>
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>
        
        {/* What they meant */}
        <div className={`p-4 space-y-2 ${isSarcasm ? 'bg-sarcasm-light' : 'bg-metaphor-light'}`}>
          <div className={`flex items-center gap-2 ${isSarcasm ? 'text-sarcasm' : 'text-metaphor'}`}>
            <Lightbulb className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">What They Meant</span>
          </div>
          <p className={`text-sm font-medium ${isSarcasm ? 'text-sarcasm-foreground' : 'text-metaphor-foreground'}`}>
            {intendedMeaning}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function ComparisonView({ sarcasmInstances, figurativeInstances }: ComparisonViewProps) {
  const allInstances = [
    ...sarcasmInstances.map((s, i) => ({ ...s, type: "sarcasm" as const, originalIndex: i })),
    ...figurativeInstances.map((f, i) => ({ ...f, type: "figurative" as const, originalIndex: i })),
  ];

  if (allInstances.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
        <div className="flex -space-x-1">
          <MessageSquare className="w-5 h-5 text-muted-foreground" />
          <ArrowRight className="w-4 h-4 text-primary" />
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        Said vs. Meant Comparison
      </h3>
      
      <div className="space-y-4">
        {allInstances.map((instance, index) => (
          <ComparisonCard
            key={`${instance.type}-${instance.originalIndex}`}
            phrase={instance.phrase}
            literalMeaning={instance.literalMeaning}
            intendedMeaning={instance.intendedMeaning}
            type={instance.type}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
