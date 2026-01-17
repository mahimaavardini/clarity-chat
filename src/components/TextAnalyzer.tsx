import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Type, Mic, MicOff, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AnalysisResult from "./AnalysisResult";

export interface SarcasmInstance {
  phrase: string;
  literalMeaning: string;
  intendedMeaning: string;
  explanation: string;
  confidence: "high" | "medium" | "low";
}

export interface MetaphorInstance {
  phrase: string;
  literalMeaning: string;
  intendedMeaning: string;
  explanation: string;
  confidence: "high" | "medium" | "low";
}

export interface Analysis {
  overallTone: string;
  hasSarcasm: boolean;
  hasMetaphors: boolean;
  sarcasmInstances: SarcasmInstance[];
  metaphorInstances: MetaphorInstance[];
  summary: string;
}

type InputMode = "text" | "speech";

export default function TextAnalyzer() {
  const [text, setText] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: "No text to analyze",
        description: "Please enter or record some text first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-text", {
        body: { text: text.trim() },
      });

      if (error) {
        throw new Error(error.message || "Failed to analyze text");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setAnalysis(data.analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleRecording = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition. Please try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
      toast({
        title: "Listening...",
        description: "Speak clearly into your microphone.",
      });
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }
      if (finalTranscript) {
        setText((prev) => prev + (prev ? " " : "") + finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      toast({
        title: "Recording error",
        description: "There was an issue with speech recognition. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();

    // Store recognition instance for stopping
    (window as any).__speechRecognition = recognition;
  };

  const stopRecording = () => {
    if ((window as any).__speechRecognition) {
      (window as any).__speechRecognition.stop();
    }
    setIsRecording(false);
  };

  const clearAll = () => {
    setText("");
    setAnalysis(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Mode Toggle */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant={inputMode === "text" ? "default" : "outline"}
          onClick={() => setInputMode("text")}
          className="gap-2 rounded-full px-6"
          aria-pressed={inputMode === "text"}
        >
          <Type className="w-4 h-4" />
          Type Text
        </Button>
        <Button
          variant={inputMode === "speech" ? "default" : "outline"}
          onClick={() => setInputMode("speech")}
          className="gap-2 rounded-full px-6"
          aria-pressed={inputMode === "speech"}
        >
          <Mic className="w-4 h-4" />
          Speech to Text
        </Button>
      </div>

      {/* Current Mode Indicator */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-gentle" />
          {inputMode === "text" ? "Text Input Mode" : "Speech Recording Mode"}
        </span>
      </div>

      {/* Input Card */}
      <Card className="p-6 shadow-calm border-0 bg-card">
        <div className="space-y-4">
          <label htmlFor="text-input" className="block text-sm font-medium text-muted-foreground">
            {inputMode === "text" 
              ? "Enter the text you'd like to analyze" 
              : "Click the microphone to start recording, then speak"}
          </label>
          
          <Textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={inputMode === "text" 
              ? "Type or paste text here... For example: 'Oh great, another meeting. That's exactly what I needed today.'" 
              : "Your speech will appear here..."}
            className="min-h-[160px] text-base leading-relaxed resize-none border-muted focus:border-primary transition-colors"
            disabled={isRecording}
            aria-describedby="input-help"
          />
          
          <p id="input-help" className="text-xs text-muted-foreground">
            Tip: Include complete sentences for better analysis of tone and context.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {inputMode === "speech" && (
              <Button
                variant={isRecording ? "destructive" : "secondary"}
                onClick={isRecording ? stopRecording : toggleRecording}
                className="gap-2"
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Start Recording
                  </>
                )}
              </Button>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !text.trim() || isRecording}
              className="gap-2 gradient-primary text-primary-foreground shadow-calm hover:opacity-90 transition-opacity"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Text
                </>
              )}
            </Button>

            {(text || analysis) && (
              <Button variant="ghost" onClick={clearAll} className="text-muted-foreground">
                Clear All
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Analysis Results */}
      {analysis && <AnalysisResult analysis={analysis} />}
    </div>
  );
}
