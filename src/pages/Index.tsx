import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Sparkles, MessageCircle, Zap, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useChatHistory } from "@/hooks/useChatHistory";
import ThemeToggle from "@/components/ThemeToggle";
import ChatInput from "@/components/ChatInput";
import ChatHistory from "@/components/ChatHistory";
import type { Analysis, ChatHistoryItem } from "@/types/analysis";

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { history, addToHistory, clearHistory } = useChatHistory();

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-text", {
        body: { text },
      });

      if (error) {
        throw new Error(error.message || "Failed to analyze text");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const analysis = data.analysis as Analysis;
      const historyItem = addToHistory(text, analysis);

      // Navigate to analysis page with the result
      navigate("/analysis", { state: { historyItem } });
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

  const handleHistorySelect = (item: ChatHistoryItem) => {
    navigate("/analysis", { state: { historyItem: item } });
  };

  return (
    <div className="min-h-screen gradient-calm">
      {/* Floating Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-metaphor/5 rounded-full blur-3xl animate-breathe" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-clarity/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative pt-12 md:pt-16 pb-8 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/60 shadow-calm mb-4 animate-breathe">
            <Brain className="w-10 h-10 text-primary-foreground" />
          </div>
          
          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground tracking-tight">
              Clarity
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Understand what people <em className="text-primary font-medium">really</em> mean.
              Decode sarcasm, metaphors, and hidden meanings with AI.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-sarcasm-light text-sarcasm-foreground text-sm font-medium shadow-soft transition-transform hover:scale-105">
              <MessageCircle className="w-4 h-4 text-sarcasm" />
              Sarcasm Detection
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-metaphor-light text-metaphor-foreground text-sm font-medium shadow-soft transition-transform hover:scale-105">
              <Sparkles className="w-4 h-4 text-metaphor" />
              Metaphor Analysis
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-clarity-light text-clarity-foreground text-sm font-medium shadow-soft transition-transform hover:scale-105">
              <Zap className="w-4 h-4 text-clarity" />
              Instant Results
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative px-4 pb-16">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Chat Input */}
          <ChatInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

          {/* Chat History */}
          <ChatHistory
            history={history}
            onSelect={handleHistorySelect}
            onClear={clearHistory}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-border/50">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Built with accessibility in mind</span>
          </div>
          <p className="text-xs text-muted-foreground/70">
            Helping everyone understand the nuances of communication
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
