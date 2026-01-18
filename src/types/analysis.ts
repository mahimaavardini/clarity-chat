export interface SarcasmInstance {
  phrase: string;
  literalMeaning: string;
  intendedMeaning: string;
  explanation: string;
  confidence: "high" | "medium" | "low";
}

export type FigurativeLanguageType = 
  | "metaphor" 
  | "simile" 
  | "personification" 
  | "hyperbole" 
  | "idiom" 
  | "symbolism" 
  | "imagery";

export interface FigurativeLanguageInstance {
  phrase: string;
  type: FigurativeLanguageType;
  literalMeaning: string;
  intendedMeaning: string;
  explanation: string;
  confidence: "high" | "medium" | "low";
}

// Legacy type for backwards compatibility
export interface MetaphorInstance {
  phrase: string;
  type?: FigurativeLanguageType;
  literalMeaning: string;
  intendedMeaning: string;
  explanation: string;
  confidence: "high" | "medium" | "low";
}

export interface Analysis {
  overallTone: string;
  simplifiedExplanation?: string;
  hasSarcasm: boolean;
  hasMetaphors: boolean;
  hasFigurativeLanguage?: boolean;
  sarcasmInstances: SarcasmInstance[];
  metaphorInstances: MetaphorInstance[];
  figurativeLanguageInstances?: FigurativeLanguageInstance[];
  summary: string;
}

export interface ChatHistoryItem {
  id: string;
  text: string;
  analysis: Analysis;
  timestamp: Date;
}
