import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, MessageCircle, Zap, Shield, Feather, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useFontSize } from "@/hooks/useFontSize";
import { usePersonalization } from "@/hooks/usePersonalization";
import ThemeToggle from "@/components/ThemeToggle";
import FontSizeControls from "@/components/FontSizeControls";
import PersonalizationInput from "@/components/PersonalizationInput";
import ChatInput from "@/components/ChatInput";
import ChatHistory from "@/components/ChatHistory";
import type { Analysis, ChatHistoryItem } from "@/types/analysis";
import logo from "@/assets/logo.png";

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { history, addToHistory, clearHistory } = useChatHistory();
  const { fontSize, increase, decrease, reset, canIncrease, canDecrease } = useFontSize();
  const { userName, updateName, getGreeting, hasName } = usePersonalization();

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

  const greeting = getGreeting();

  return (
    <div className="min-h-screen gradient-calm">
      {/* Floating Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
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

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-metaphor/5 rounded-full blur-3xl animate-breathe" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative pt-8 md:pt-12 pb-6 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
          {/* Logo */}
          <div className="inline-block animate-breathe">
            <img 
              src={logo} 
              alt="Context C?ue Logo" 
              className="w-32 h-32 md:w-40 md:h-40 object-contain mx-auto drop-shadow-lg"
            />
          </div>
          
          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
              Context C<span className="text-primary">?</span>ue
            </h1>
            
            {/* Personalized Greeting */}
            {hasName && greeting ? (
              <p className="text-lg md:text-xl text-primary font-medium animate-slide-up">
                {greeting} Ready to analyze some text?
              </p>
            ) : (
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Understand what people <em className="text-primary font-medium">really</em> mean.
                Decode sarcasm, metaphors, and hidden meanings with AI.
              </p>
            )}
          </div>

          {/* Personalization Input */}
          <div className="flex justify-center pt-2">
            <PersonalizationInput userName={userName} onUpdateName={updateName} />
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sarcasm-light text-sarcasm-foreground text-sm font-medium shadow-soft transition-transform hover:scale-105">
              <MessageCircle className="w-3.5 h-3.5 text-sarcasm" />
              Sarcasm
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-metaphor-light text-metaphor-foreground text-sm font-medium shadow-soft transition-transform hover:scale-105">
              <Sparkles className="w-3.5 h-3.5 text-metaphor" />
              Metaphors
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium shadow-soft transition-transform hover:scale-105">
              <Feather className="w-3.5 h-3.5 text-primary" />
              Similes
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-clarity-light text-clarity-foreground text-sm font-medium shadow-soft transition-transform hover:scale-105">
              <Zap className="w-3.5 h-3.5 text-clarity" />
              & More
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
            <Heart className="w-4 h-4 text-primary" />
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
