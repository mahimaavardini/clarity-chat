import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "context-clue-font-size";
const MIN_SIZE = 14;
const MAX_SIZE = 24;
const DEFAULT_SIZE = 16;
const STEP = 2;

export function useFontSize() {
  const [fontSize, setFontSize] = useState(DEFAULT_SIZE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= MIN_SIZE && parsed <= MAX_SIZE) {
        setFontSize(parsed);
      }
    }
    setIsHydrated(true);
  }, []);

  // Apply font size to document
  useEffect(() => {
    if (isHydrated) {
      document.documentElement.style.fontSize = `${fontSize}px`;
      sessionStorage.setItem(STORAGE_KEY, fontSize.toString());
    }
  }, [fontSize, isHydrated]);

  const increase = useCallback(() => {
    setFontSize((prev) => Math.min(prev + STEP, MAX_SIZE));
  }, []);

  const decrease = useCallback(() => {
    setFontSize((prev) => Math.max(prev - STEP, MIN_SIZE));
  }, []);

  const reset = useCallback(() => {
    setFontSize(DEFAULT_SIZE);
  }, []);

  return {
    fontSize,
    increase,
    decrease,
    reset,
    canIncrease: fontSize < MAX_SIZE,
    canDecrease: fontSize > MIN_SIZE,
  };
}
