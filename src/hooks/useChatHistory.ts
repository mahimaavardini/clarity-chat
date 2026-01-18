import { useState, useCallback } from "react";
import type { ChatHistoryItem, Analysis } from "@/types/analysis";

const STORAGE_KEY = "clarity-chat-history";

export function useChatHistory() {
  const [history, setHistory] = useState<ChatHistoryItem[]>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }));
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const addToHistory = useCallback((text: string, analysis: Analysis) => {
    const newItem: ChatHistoryItem = {
      id: crypto.randomUUID(),
      text,
      analysis,
      timestamp: new Date(),
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev];
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return newItem;
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const getHistoryItem = useCallback((id: string) => {
    return history.find((item) => item.id === id);
  }, [history]);

  return { history, addToHistory, clearHistory, getHistoryItem };
}
