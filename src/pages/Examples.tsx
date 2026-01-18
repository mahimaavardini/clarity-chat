import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, MessageCircle, Sparkles, Feather, Megaphone, BookOpen, Lightbulb, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import FontSizeControls from "@/components/FontSizeControls";
import { useFontSize } from "@/hooks/useFontSize";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

interface Example {
  id: string;
  text: string;
  category: string;
  description: string;
  hint: string;
}

const examples: Example[] = [
  // Sarcasm
  {
    id: "sarcasm-1",
    text: "Oh great, another meeting that could have been an email. This is exactly how I wanted to spend my afternoon.",
    category: "sarcasm",
    description: "Workplace frustration expressed through fake enthusiasm",
    hint: "The speaker uses positive words ('great', 'exactly') to express negative feelings",
  },
  {
    id: "sarcasm-2",
    text: "Thanks for letting me know about the deadline after it passed. Your timing is impeccable as always.",
    category: "sarcasm",
    description: "Criticism disguised as a compliment",
    hint: "Praising 'impeccable timing' when the timing was actually terrible",
  },
  {
    id: "sarcasm-3",
    text: "I love how you always remember to take out the trash... three days after I asked.",
    category: "sarcasm",
    description: "Frustration with forgetfulness",
    hint: "The word 'love' is used sarcastically to express annoyance",
  },
  // Metaphors
  {
    id: "metaphor-1",
    text: "Life is a journey with many unexpected turns. Sometimes the detours lead to the most beautiful destinations.",
    category: "metaphor",
    description: "Life compared to a physical journey",
    hint: "Life isn't literally a road, but the comparison helps us understand experiences",
  },
  {
    id: "metaphor-2",
    text: "She has a heart of gold and always puts others before herself.",
    category: "metaphor",
    description: "Kindness compared to precious metal",
    hint: "The heart isn't made of gold - it means the person is exceptionally kind",
  },
  // Similes
  {
    id: "simile-1",
    text: "The news spread through the office like wildfire, and soon everyone knew about the promotion.",
    category: "simile",
    description: "Fast information spread compared to fire",
    hint: "Uses 'like' to compare - information moved as quickly as fire spreads",
  },
  {
    id: "simile-2",
    text: "After the marathon, my legs felt like jelly and I could barely walk to the car.",
    category: "simile",
    description: "Muscle exhaustion compared to jelly",
    hint: "Uses 'like' to describe weakness - legs weren't literally jelly",
  },
  // Hyperbole
  {
    id: "hyperbole-1",
    text: "I've told you a million times to clean your room! Do I need to put it in writing?",
    category: "hyperbole",
    description: "Extreme exaggeration for emphasis",
    hint: "Not literally a million times - the exaggeration emphasizes frustration",
  },
  {
    id: "hyperbole-2",
    text: "This bag weighs a ton! What do you have in here, bricks?",
    category: "hyperbole",
    description: "Weight exaggeration for effect",
    hint: "The bag doesn't literally weigh a ton (2000 lbs) - it just feels very heavy",
  },
  // Idioms
  {
    id: "idiom-1",
    text: "Let's not beat around the bush. We need to discuss the budget cuts directly.",
    category: "idiom",
    description: "Common phrase meaning 'get to the point'",
    hint: "No actual bushes involved - this phrase means to speak directly without avoiding the topic",
  },
  {
    id: "idiom-2",
    text: "When it rains, it pours. First my car broke down, then I lost my keys, and now this.",
    category: "idiom",
    description: "Expression about misfortunes coming together",
    hint: "Not about actual weather - means problems often happen all at once",
  },
  {
    id: "idiom-3",
    text: "I'm feeling under the weather today, so I might leave work early.",
    category: "idiom",
    description: "Common phrase for feeling unwell",
    hint: "Not literally under weather - means feeling sick or not well",
  },
];

const categoryInfo = {
  sarcasm: { icon: MessageCircle, color: "text-sarcasm", bgColor: "bg-sarcasm-light" },
  metaphor: { icon: Sparkles, color: "text-metaphor", bgColor: "bg-metaphor-light" },
  simile: { icon: Feather, color: "text-figurative-simile", bgColor: "bg-accent" },
  hyperbole: { icon: Megaphone, color: "text-figurative-hyperbole", bgColor: "bg-destructive/10" },
  idiom: { icon: BookOpen, color: "text-figurative-idiom", bgColor: "bg-secondary" },
};

export default function Examples() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fontSize, increase, decrease, reset, canIncrease, canDecrease } = useFontSize();
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(true);

  const handleTryExample = async (example: Example) => {
    setIsAnalyzing(example.id);
    
    try {
      const { data, error } = await supabase.functions.invoke("analyze-text", {
        body: { text: example.text },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      navigate("/analysis", {
        state: {
          historyItem: {
            id: crypto.randomUUID(),
            text: example.text,
            analysis: data.analysis,
            timestamp: new Date(),
          },
        },
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(null);
    }
  };

  const categories = ["all", "sarcasm", "metaphor", "simile", "hyperbole", "idiom"];

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
            <div className="flex items-center gap-2">
              <img src={logo} alt="Context C?ue" className="w-8 h-8 object-contain" />
              <span className="font-display font-semibold text-foreground hidden sm:inline">
                Example Library
              </span>
            </div>
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

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Learn by Example
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore real-world examples of figurative language. Click any example to see a full AI analysis.
          </p>
          
          {/* Learning Mode Toggle */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant={showHints ? "default" : "outline"}
              size="sm"
              onClick={() => setShowHints(!showHints)}
              className="gap-2 rounded-full"
            >
              <Lightbulb className="w-4 h-4" />
              Learning Mode: {showHints ? "On" : "Off"}
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto p-0">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground capitalize"
              >
                {cat === "all" ? "All Examples" : cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {examples
                  .filter((e) => category === "all" || e.category === category)
                  .map((example) => {
                    const catInfo = categoryInfo[example.category as keyof typeof categoryInfo];
                    const Icon = catInfo?.icon || MessageCircle;
                    
                    return (
                      <Card
                        key={example.id}
                        className="p-5 hover:shadow-calm transition-all duration-300 border-border/50 group"
                      >
                        <div className="space-y-4">
                          {/* Category Badge */}
                          <div className="flex items-center justify-between">
                            <Badge className={`${catInfo?.bgColor} ${catInfo?.color} border-0 capitalize`}>
                              <Icon className="w-3 h-3 mr-1" />
                              {example.category}
                            </Badge>
                          </div>

                          {/* Example Text */}
                          <p className="text-foreground leading-relaxed">
                            "{example.text}"
                          </p>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground">
                            {example.description}
                          </p>

                          {/* Learning Hint */}
                          {showHints && (
                            <div className="p-3 rounded-lg bg-accent/50 border border-accent animate-fade-in">
                              <div className="flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-accent-foreground">{example.hint}</p>
                              </div>
                            </div>
                          )}

                          {/* Try Button */}
                          <Button
                            onClick={() => handleTryExample(example)}
                            disabled={isAnalyzing === example.id}
                            className="w-full gap-2 rounded-full group-hover:bg-primary transition-colors"
                            variant="outline"
                          >
                            {isAnalyzing === example.id ? (
                              <>Analyzing...</>
                            ) : (
                              <>
                                <Play className="w-4 h-4" />
                                Try This Example
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </>
                            )}
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
