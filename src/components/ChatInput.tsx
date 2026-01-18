import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Type, Mic, MicOff, Sparkles, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onAnalyze: (text: string) => Promise<void>;
  isAnalyzing: boolean;
}

type InputMode = "text" | "speech";

export default function ChatInput({ onAnalyze, isAnalyzing }: ChatInputProps) {
  const [text, setText] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!text.trim() || isAnalyzing) return;
    await onAnalyze(text.trim());
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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
      stopRecording();
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
    (window as any).__speechRecognition = recognition;
  };

  const stopRecording = () => {
    if ((window as any).__speechRecognition) {
      (window as any).__speechRecognition.stop();
    }
    setIsRecording(false);
  };

  return (
    <Card className="p-4 md:p-6 shadow-calm border-0 bg-card/80 backdrop-blur-md animate-slide-up">
      {/* Mode Toggle */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Button
          variant={inputMode === "text" ? "default" : "outline"}
          onClick={() => setInputMode("text")}
          className="gap-2 rounded-full px-5 text-sm transition-all duration-300"
          aria-pressed={inputMode === "text"}
          size="sm"
        >
          <Type className="w-3.5 h-3.5" />
          Type
        </Button>
        <Button
          variant={inputMode === "speech" ? "default" : "outline"}
          onClick={() => setInputMode("speech")}
          className="gap-2 rounded-full px-5 text-sm transition-all duration-300"
          aria-pressed={inputMode === "speech"}
          size="sm"
        >
          <Mic className="w-3.5 h-3.5" />
          Speech
        </Button>
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={inputMode === "text" 
              ? "Enter text to analyze... (Press Enter to send)" 
              : "Click record and speak..."}
            className="min-h-[120px] md:min-h-[140px] text-base leading-relaxed resize-none border-muted focus:border-primary transition-all pr-12 rounded-xl bg-background/50"
            disabled={isRecording}
          />
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                Recording
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {inputMode === "speech" && (
              <Button
                variant={isRecording ? "destructive" : "secondary"}
                onClick={isRecording ? stopRecording : toggleRecording}
                className="gap-2 rounded-full transition-all duration-300"
                size="sm"
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Record
                  </>
                )}
              </Button>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isAnalyzing || !text.trim() || isRecording}
            className="gap-2 gradient-primary text-primary-foreground shadow-calm hover:opacity-90 transition-all duration-300 rounded-full px-6"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze
                <Send className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
