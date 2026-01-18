import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, Lightbulb, CheckCircle2, HelpCircle, Quote, ArrowRight, Feather, Mountain, Megaphone, BookOpen, Eye, Palette } from "lucide-react";
import type { Analysis, SarcasmInstance, MetaphorInstance, FigurativeLanguageType } from "@/types/analysis";

interface Props {
  analysis: Analysis;
}

function ConfidenceBadge({ level }: { level: "high" | "medium" | "low" }) {
  const styles = {
    high: "bg-confidence-high/20 text-confidence-high border-confidence-high/30",
    medium: "bg-confidence-medium/20 text-confidence-medium border-confidence-medium/30",
    low: "bg-confidence-low/20 text-confidence-low border-confidence-low/30",
  };

  const labels = {
    high: "High Confidence",
    medium: "Medium Confidence", 
    low: "Low Confidence",
  };

  return (
    <Badge variant="outline" className={`text-xs font-medium ${styles[level]}`}>
      {labels[level]}
    </Badge>
  );
}

function getTypeIcon(type: FigurativeLanguageType | undefined) {
  switch (type) {
    case "simile":
      return <Feather className="w-5 h-5" />;
    case "personification":
      return <Mountain className="w-5 h-5" />;
    case "hyperbole":
      return <Megaphone className="w-5 h-5" />;
    case "idiom":
      return <BookOpen className="w-5 h-5" />;
    case "imagery":
      return <Eye className="w-5 h-5" />;
    case "symbolism":
      return <Palette className="w-5 h-5" />;
    default:
      return <HelpCircle className="w-5 h-5" />;
  }
}

function getTypeLabel(type: FigurativeLanguageType | undefined): string {
  if (!type) return "Metaphor";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function getTypeColor(type: FigurativeLanguageType | undefined): string {
  switch (type) {
    case "simile":
      return "text-figurative-simile";
    case "personification":
      return "text-figurative-personification";
    case "hyperbole":
      return "text-figurative-hyperbole";
    case "idiom":
      return "text-figurative-idiom";
    case "imagery":
      return "text-figurative-imagery";
    case "symbolism":
      return "text-figurative-symbolism";
    default:
      return "text-metaphor";
  }
}

function SarcasmCard({ instance, index }: { instance: SarcasmInstance; index: number }) {
  return (
    <Card className="p-5 bg-sarcasm-light border-sarcasm/20 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-sarcasm font-medium">
            <AlertTriangle className="w-5 h-5" />
            <span>Sarcasm Detected</span>
          </div>
          <ConfidenceBadge level={instance.confidence} />
        </div>

        <blockquote className="border-l-4 border-sarcasm pl-4 py-2 bg-background/50 rounded-r-lg">
          <Quote className="w-4 h-4 text-sarcasm/50 mb-1" />
          <p className="text-foreground font-medium italic">&ldquo;{instance.phrase}&rdquo;</p>
        </blockquote>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              Literal Meaning
            </h4>
            <p className="text-sm text-foreground/80">{instance.literalMeaning}</p>
          </div>
          
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-sarcasm-foreground flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              Actual Meaning
            </h4>
            <p className="text-sm text-sarcasm-foreground font-medium">{instance.intendedMeaning}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-sarcasm/10">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-sarcasm mt-0.5 flex-shrink-0" />
            <p className="text-sm text-sarcasm-foreground">{instance.explanation}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FigurativeLanguageCard({ instance, index }: { instance: MetaphorInstance; index: number }) {
  const typeColor = getTypeColor(instance.type);
  
  return (
    <Card className="p-5 bg-metaphor-light border-metaphor/20 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className={`flex items-center gap-2 ${typeColor} font-medium`}>
            {getTypeIcon(instance.type)}
            <span>{getTypeLabel(instance.type)} Detected</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {getTypeLabel(instance.type)}
            </Badge>
            <ConfidenceBadge level={instance.confidence} />
          </div>
        </div>

        <blockquote className="border-l-4 border-metaphor pl-4 py-2 bg-background/50 rounded-r-lg">
          <Quote className="w-4 h-4 text-metaphor/50 mb-1" />
          <p className="text-foreground font-medium italic">&ldquo;{instance.phrase}&rdquo;</p>
        </blockquote>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              Literal Meaning
            </h4>
            <p className="text-sm text-foreground/80">{instance.literalMeaning}</p>
          </div>
          
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-metaphor-foreground flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              Actual Meaning
            </h4>
            <p className="text-sm text-metaphor-foreground font-medium">{instance.intendedMeaning}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-metaphor/10">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-metaphor mt-0.5 flex-shrink-0" />
            <p className="text-sm text-metaphor-foreground">{instance.explanation}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function AnalysisResult({ analysis }: Props) {
  const hasFigurativeLanguage = analysis.hasSarcasm || analysis.hasMetaphors || analysis.hasFigurativeLanguage;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Card */}
      <Card className={`p-6 border-0 shadow-calm ${hasFigurativeLanguage ? 'bg-secondary' : 'bg-clarity-light'}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${hasFigurativeLanguage ? 'bg-primary/10' : 'bg-clarity/10'}`}>
            {hasFigurativeLanguage ? (
              <Lightbulb className="w-6 h-6 text-primary" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-clarity" />
            )}
          </div>
          <div className="space-y-2 flex-1">
            <h2 className="text-xl font-display font-semibold text-foreground">Tone Analysis</h2>
            <p className="text-base text-foreground/80">{analysis.summary}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline" className="bg-background">
                Tone: {analysis.overallTone}
              </Badge>
              {analysis.hasSarcasm && (
                <Badge className="bg-sarcasm/10 text-sarcasm border-sarcasm/20">
                  {analysis.sarcasmInstances.length} Sarcasm{analysis.sarcasmInstances.length !== 1 ? 's' : ''}
                </Badge>
              )}
              {(analysis.hasMetaphors || analysis.hasFigurativeLanguage) && analysis.metaphorInstances.length > 0 && (
                <Badge className="bg-metaphor/10 text-metaphor border-metaphor/20">
                  {analysis.metaphorInstances.length} Figurative Expression{analysis.metaphorInstances.length !== 1 ? 's' : ''}
                </Badge>
              )}
              {!hasFigurativeLanguage && (
                <Badge className="bg-clarity/10 text-clarity border-clarity/20">
                  Clear & Direct
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Findings */}
      {hasFigurativeLanguage && (
        <Accordion type="multiple" defaultValue={["sarcasm", "figurative"]} className="space-y-4">
          {analysis.hasSarcasm && analysis.sarcasmInstances.length > 0 && (
            <AccordionItem value="sarcasm" className="border-0">
              <AccordionTrigger className="bg-sarcasm-light hover:bg-sarcasm-light/80 rounded-lg px-5 py-4 text-sarcasm-foreground font-display font-semibold">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-sarcasm" />
                  Sarcasm Found ({analysis.sarcasmInstances.length})
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                {analysis.sarcasmInstances.map((instance, index) => (
                  <SarcasmCard key={index} instance={instance} index={index} />
                ))}
              </AccordionContent>
            </AccordionItem>
          )}

          {(analysis.hasMetaphors || analysis.hasFigurativeLanguage) && analysis.metaphorInstances.length > 0 && (
            <AccordionItem value="figurative" className="border-0">
              <AccordionTrigger className="bg-metaphor-light hover:bg-metaphor-light/80 rounded-lg px-5 py-4 text-metaphor-foreground font-display font-semibold">
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-metaphor" />
                  Figurative Language ({analysis.metaphorInstances.length})
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                {analysis.metaphorInstances.map((instance, index) => (
                  <FigurativeLanguageCard key={index} instance={instance} index={index} />
                ))}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      )}

      {/* No Figurative Language */}
      {!hasFigurativeLanguage && (
        <Card className="p-6 bg-clarity-light border-clarity/20">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-clarity flex-shrink-0" />
            <div>
              <h3 className="font-display font-semibold text-clarity-foreground mb-2">
                Good news! This text is straightforward
              </h3>
              <p className="text-sm text-clarity-foreground/80">
                The text you provided doesn't contain sarcasm or figurative language. The meaning is direct and 
                can be understood at face value. This kind of clear communication is often easier to interpret.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
