import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlaybackProps {
  text: string;
  label?: string;
  variant?: "default" | "compact";
}

export default function AudioPlayback({ text, label, variant = "default" }: AudioPlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setIsSupported(false);
    }
    
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(() => {
    if (!isSupported) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.volume = isMuted ? 0 : 1;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [text, rate, isMuted, isSupported]);

  const pause = useCallback(() => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    } else {
      speak();
    }
  }, [speak]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [isPlaying, pause, resume]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  if (!isSupported) {
    return null;
  }

  if (variant === "compact") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={togglePlay}
        className="gap-2 text-muted-foreground hover:text-foreground"
        title="Read aloud"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
        {label || "Listen"}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      {/* Play/Pause Button */}
      <Button
        variant="default"
        size="icon"
        onClick={togglePlay}
        className="h-10 w-10 rounded-full flex-shrink-0"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" />
        )}
      </Button>

      {/* Controls */}
      <div className="flex-1 flex items-center gap-4">
        {/* Speed Control */}
        <div className="flex items-center gap-2 flex-1 min-w-[120px]">
          <span className="text-xs text-muted-foreground w-8">{rate}x</span>
          <Slider
            value={[rate]}
            onValueChange={([value]) => setRate(value)}
            min={0.5}
            max={2}
            step={0.25}
            className="flex-1"
          />
        </div>

        {/* Mute Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className={cn("h-8 w-8", isMuted && "text-muted-foreground")}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>

        {/* Stop/Reset Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={stop}
          className="h-8 w-8"
          disabled={!isPlaying}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Label */}
      {label && (
        <span className="text-sm text-muted-foreground hidden md:inline">{label}</span>
      )}
    </div>
  );
}
