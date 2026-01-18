import { Clock, MessageSquare, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { ChatHistoryItem } from "@/types/analysis";
import { formatDistanceToNow } from "date-fns";

interface ChatHistoryProps {
  history: ChatHistoryItem[];
  onSelect: (item: ChatHistoryItem) => void;
  onClear: () => void;
}

export default function ChatHistory({ history, onSelect, onClear }: ChatHistoryProps) {
  if (history.length === 0) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex flex-col items-center justify-center text-center py-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">No analysis history yet</p>
            <p className="text-sm text-muted-foreground">Your analyzed texts will appear here</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold text-foreground">Recent Analysis</h3>
          <Badge variant="secondary" className="text-xs">{history.length}</Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </Button>
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="p-2 space-y-1">
          {history.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full p-3 rounded-lg text-left transition-all duration-200 hover:bg-accent/50 group animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {item.text.slice(0, 60)}{item.text.length > 60 ? "..." : ""}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs py-0">
                      {item.analysis.overallTone}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-0.5" />
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
