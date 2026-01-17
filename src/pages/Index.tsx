import TextAnalyzer from "@/components/TextAnalyzer";
import { Sparkles, Brain, MessageCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-calm">
      {/* Header */}
      <header className="pt-12 pb-8 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            Clarity
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Understand what people <em>really</em> mean. This tool helps decode sarcasm, metaphors, 
            and figurative language with clear, friendly explanations.
          </p>
        </div>
      </header>

      {/* Features Preview */}
      <section className="px-4 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-sarcasm-light text-sarcasm-foreground">
              <MessageCircle className="w-4 h-4 text-sarcasm" />
              <span>Sarcasm Detection</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-metaphor-light text-metaphor-foreground">
              <Sparkles className="w-4 h-4 text-metaphor" />
              <span>Metaphor Analysis</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-clarity-light text-clarity-foreground">
              <Brain className="w-4 h-4 text-clarity" />
              <span>Clear Explanations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 pb-16">
        <TextAnalyzer />
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Built with accessibility in mind. Helping everyone understand the nuances of communication.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
