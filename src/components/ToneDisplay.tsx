import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sparkles, TrendingUp, Volume2 } from "lucide-react";

interface ToneDisplayProps {
  tone: string;
  hasSarcasm: boolean;
  hasMetaphors: boolean;
  sarcasmCount: number;
  metaphorCount: number;
}

const toneColors: Record<string, { bg: string; text: string; icon: string }> = {
  neutral: { bg: "bg-muted", text: "text-muted-foreground", icon: "🎯" },
  positive: { bg: "bg-clarity/10", text: "text-clarity", icon: "😊" },
  negative: { bg: "bg-destructive/10", text: "text-destructive", icon: "😟" },
  sarcastic: { bg: "bg-sarcasm/10", text: "text-sarcasm", icon: "😏" },
  humorous: { bg: "bg-metaphor/10", text: "text-metaphor", icon: "😄" },
  frustrated: { bg: "bg-sarcasm/10", text: "text-sarcasm", icon: "😤" },
  excited: { bg: "bg-clarity/10", text: "text-clarity", icon: "🎉" },
  default: { bg: "bg-primary/10", text: "text-primary", icon: "💬" },
};

function getToneStyle(tone: string) {
  const lowerTone = tone.toLowerCase();
  for (const [key, value] of Object.entries(toneColors)) {
    if (lowerTone.includes(key)) {
      return value;
    }
  }
  return toneColors.default;
}

export default function ToneDisplay({ 
  tone, 
  hasSarcasm, 
  hasMetaphors, 
  sarcasmCount, 
  metaphorCount 
}: ToneDisplayProps) {
  const toneStyle = getToneStyle(tone);
  
  return (
    <Card className="p-6 bg-gradient-to-br from-card via-card to-accent/20 border-0 shadow-calm overflow-hidden relative">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-metaphor/10 blur-2xl" />
      
      <div className="relative space-y-6">
        {/* Main Tone Section */}
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl ${toneStyle.bg} flex items-center justify-center text-3xl animate-breathe`}>
            {toneStyle.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              Detected Tone
            </p>
            <h3 className={`text-2xl font-display font-bold ${toneStyle.text}`}>
              {tone}
            </h3>
          </div>
        </div>

        {/* Detected Elements Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-4 rounded-xl transition-all duration-300 ${
            hasSarcasm 
              ? "bg-sarcasm/10 border border-sarcasm/20" 
              : "bg-muted/50 border border-transparent"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Sarcasm
              </span>
              {hasSarcasm && (
                <Badge className="bg-sarcasm text-white text-xs px-2 py-0">
                  {sarcasmCount}
                </Badge>
              )}
            </div>
            <p className={`text-lg font-display font-semibold ${
              hasSarcasm ? "text-sarcasm" : "text-muted-foreground"
            }`}>
              {hasSarcasm ? "Detected" : "None"}
            </p>
          </div>

          <div className={`p-4 rounded-xl transition-all duration-300 ${
            hasMetaphors 
              ? "bg-metaphor/10 border border-metaphor/20" 
              : "bg-muted/50 border border-transparent"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Metaphors
              </span>
              {hasMetaphors && (
                <Badge className="bg-metaphor text-white text-xs px-2 py-0">
                  {metaphorCount}
                </Badge>
              )}
            </div>
            <p className={`text-lg font-display font-semibold ${
              hasMetaphors ? "text-metaphor" : "text-muted-foreground"
            }`}>
              {hasMetaphors ? "Detected" : "None"}
            </p>
          </div>
        </div>

        {/* Quick insights */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span>
            {!hasSarcasm && !hasMetaphors 
              ? "Clear and direct communication" 
              : `${sarcasmCount + metaphorCount} figurative elements found`}
          </span>
        </div>
      </div>
    </Card>
  );
}
