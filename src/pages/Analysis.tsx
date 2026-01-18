import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Quote, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import FontSizeControls from "@/components/FontSizeControls";
import ToneDisplay from "@/components/ToneDisplay";
import SimplifiedExplanation from "@/components/SimplifiedExplanation";
import AnalysisResult from "@/components/AnalysisResult";
import { useFontSize } from "@/hooks/useFontSize";
import type { Analysis as AnalysisType, ChatHistoryItem } from "@/types/analysis";
import logo from "@/assets/logo.png";

export default function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<{ text: string; analysis: AnalysisType } | null>(null);
  const { fontSize, increase, decrease, reset, canIncrease, canDecrease } = useFontSize();

  useEffect(() => {
    const state = location.state as { historyItem?: ChatHistoryItem } | null;
    
    if (state?.historyItem) {
      setData({
        text: state.historyItem.text,
        analysis: state.historyItem.analysis,
      });
    } else {
      navigate("/");
    }
  }, [location.state, navigate]);

  if (!data) {
    return (
      <div className="min-h-screen gradient-calm flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2 rounded-full hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={logo} alt="Context C?ue" className="w-8 h-8 object-contain" />
              <span className="font-display font-semibold text-foreground hidden sm:inline">
                Context C<span className="text-primary">?</span>ue
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <FontSizeControls
              fontSize={fontSize}
              onIncrease={increase}
              onDecrease={decrease}
              onReset={reset}
              canIncrease={canIncrease}
              canDecrease={canDecrease}
            />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Tone Analysis
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Analysis Results
          </h1>
        </div>

        {/* Original Text Quote */}
        <div className="relative p-6 rounded-2xl bg-card border border-border/50 shadow-soft">
          <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/20" />
          <div className="pl-8">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Analyzed Text
            </p>
            <p className="text-lg text-foreground leading-relaxed italic">
              "{data.text}"
            </p>
          </div>
        </div>

        {/* Simplified Explanation */}
        {data.analysis.simplifiedExplanation && (
          <SimplifiedExplanation explanation={data.analysis.simplifiedExplanation} />
        )}

        {/* Tone Display Section */}
        <ToneDisplay
          tone={data.analysis.overallTone}
          hasSarcasm={data.analysis.hasSarcasm}
          hasMetaphors={data.analysis.hasMetaphors || data.analysis.hasFigurativeLanguage || false}
          sarcasmCount={data.analysis.sarcasmInstances.length}
          metaphorCount={data.analysis.metaphorInstances.length}
        />

        {/* Detailed Analysis */}
        <AnalysisResult analysis={data.analysis} />

        {/* Action Footer */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => navigate("/")}
            className="gap-2 rounded-full px-8"
            size="lg"
          >
            <Sparkles className="w-4 h-4" />
            Analyze Another Text
          </Button>
        </div>
      </main>
    </div>
  );
}
