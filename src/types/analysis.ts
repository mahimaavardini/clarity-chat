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

export interface ChatHistoryItem {
  id: string;
  text: string;
  analysis: Analysis;
  timestamp: Date;
}
