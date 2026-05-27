"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle(): React.JSX.Element {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by rendering a placeholder until mounted
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="size-9 rounded-full border border-border/40 bg-secondary/10"
        aria-label="Toggle theme"
      >
        <div className="size-4.5 rounded-full bg-muted-foreground/20 animate-pulse" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="size-9 rounded-full border border-border/40 bg-secondary/15 hover:bg-secondary/30 text-foreground transition-all duration-300 relative overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="relative size-full flex items-center justify-center">
        {/* Sun Icon */}
        <Sun
          aria-hidden="true"
          className={`absolute size-4.5 transition-transform duration-500 text-amber-500 ${
            isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
          }`}
        />
        {/* Moon Icon */}
        <Moon
          aria-hidden="true"
          className={`absolute size-4.5 transition-transform duration-500 text-indigo-400 ${
            isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
          }`}
        />
      </div>
    </Button>
  );
}
export default ThemeToggle;
