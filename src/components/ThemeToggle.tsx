import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-accent/50 hover:bg-accent transition-all duration-300 group"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <Sun className={`h-5 w-5 absolute transition-all duration-300 ${
        theme === "light" 
          ? "rotate-0 scale-100 opacity-100" 
          : "rotate-90 scale-0 opacity-0"
      }`} />
      <Moon className={`h-5 w-5 absolute transition-all duration-300 ${
        theme === "dark" 
          ? "rotate-0 scale-100 opacity-100" 
          : "-rotate-90 scale-0 opacity-0"
      }`} />
    </Button>
  );
}
