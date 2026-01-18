import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Quote, Sparkles, BookOpen, Volume2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import FontSizeControls from "@/components/FontSizeControls";
import ToneDisplay from "@/components/ToneDisplay";
import ToneSpectrum from "@/components/ToneSpectrum";
import SimplifiedExplanation from "@/components/SimplifiedExplanation";
import ComparisonView from "@/components/ComparisonView";
import InlineHighlighter from "@/components/InlineHighlighter";
import ConfidenceMeter from "@/components/ConfidenceMeter";
import AudioPlayback from "@/components/AudioPlayback";
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

  const hasFigurativeContent = data.analysis.hasSarcasm || data.analysis.hasMetaphors || data.analysis.hasFigurativeLanguage;

  // Calculate overall confidence
  const allConfidences = [
    ...data.analysis.sarcasmInstances.map((s) => s.confidence),
    ...data.analysis.metaphorInstances.map((m) => m.confidence),
  ];
  const overallConfidence = allConfidences.length > 0
    ? allConfidences.filter((c) => c === "high").length >= allConfidences.length / 2
      ? "high"
      : allConfidences.filter((c) => c === "low").length >= allConfidences.length / 2
        ? "low"
        : "medium"
    : "high";

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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/examples")}
              className="gap-2 rounded-full hidden sm:flex"
            >
              <BookOpen className="w-4 h-4" />
              Examples
            </Button>
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
        {/* Page Title with Confidence Meter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Tone Analysis
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Analysis Results
            </h1>
          </div>
          
          {hasFigurativeContent && (
            <div className="flex items-center gap-4">
              <ConfidenceMeter 
                level={overallConfidence} 
                label="Overall Confidence"
                size="lg"
              />
            </div>
          )}
        </div>

        {/* Original Text with Inline Highlighting */}
        <div className="relative p-6 rounded-2xl bg-card border border-border/50 shadow-soft space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <Quote className="w-6 h-6 text-primary/40" />
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Analyzed Text
              </p>
            </div>
            <AudioPlayback 
              text={data.text}
              variant="compact"
              label="Listen"
            />
          </div>
          
          {hasFigurativeContent ? (
            <InlineHighlighter
              text={data.text}
              sarcasmInstances={data.analysis.sarcasmInstances}
              figurativeInstances={data.analysis.metaphorInstances}
            />
          ) : (
            <p className="text-lg text-foreground leading-relaxed italic pl-8">
              "{data.text}"
            </p>
          )}
        </div>

        {/* Simplified Explanation with Audio */}
        {data.analysis.simplifiedExplanation && (
          <div className="space-y-3">
            <SimplifiedExplanation explanation={data.analysis.simplifiedExplanation} />
            <AudioPlayback 
              text={`Here's what this means in simple terms: ${data.analysis.simplifiedExplanation}`}
              label="Listen to simplified explanation"
            />
          </div>
        )}

        {/* Tone Spectrum Visualization */}
        <ToneSpectrum tone={data.analysis.overallTone} />

        {/* Tone Display Section */}
        <ToneDisplay
          tone={data.analysis.overallTone}
          hasSarcasm={data.analysis.hasSarcasm}
          hasMetaphors={data.analysis.hasMetaphors || data.analysis.hasFigurativeLanguage || false}
          sarcasmCount={data.analysis.sarcasmInstances.length}
          metaphorCount={data.analysis.metaphorInstances.length}
        />

        {/* Comparison View - Said vs Meant */}
        {hasFigurativeContent && (
          <ComparisonView
            sarcasmInstances={data.analysis.sarcasmInstances}
            figurativeInstances={data.analysis.metaphorInstances}
          />
        )}

        {/* Detailed Analysis */}
        <AnalysisResult analysis={data.analysis} />

        {/* Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            onClick={() => navigate("/")}
            className="gap-2 rounded-full px-8"
            size="lg"
          >
            <Sparkles className="w-4 h-4" />
            Analyze Another Text
          </Button>
          <Button
            onClick={() => navigate("/examples")}
            variant="outline"
            className="gap-2 rounded-full px-8"
            size="lg"
          >
            <BookOpen className="w-4 h-4" />
            View Examples
          </Button>
        </div>
      </main>
    </div>
  );
}
