import { useState, useCallback, useEffect } from "react";

export type Theme = "light" | "dark" | "high-contrast";

const STORAGE_KEY = "context-clue-theme";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme;
      if (stored && ["light", "dark", "high-contrast"].includes(stored)) {
        return stored;
      }
      // Check system preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("light", "dark", "high-contrast");
    
    // Add current theme class
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const setLightTheme = useCallback(() => setThemeState("light"), []);
  const setDarkTheme = useCallback(() => setThemeState("dark"), []);
  const setHighContrastTheme = useCallback(() => setThemeState("high-contrast"), []);

  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      if (current === "light") return "dark";
      if (current === "dark") return "high-contrast";
      return "light";
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === "light" ? "dark" : "light"));
  }, []);

  return {
    theme,
    setTheme,
    setLightTheme,
    setDarkTheme,
    setHighContrastTheme,
    cycleTheme,
    toggleTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
    isHighContrast: theme === "high-contrast",
  };
}
