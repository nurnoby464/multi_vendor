"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import type { SizeProp } from "@/lib/types";
// ✅ Import from the server-safe source instead of re-defining here
export { THEME_INIT_SCRIPT } from "@/lib/theme-script";

export interface ThemeToggleProps {
  size?: SizeProp;
  className?: string;
}

export function ThemeToggle({ size = "md", className }: ThemeToggleProps) {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage may be unavailable
    }
  }

  return (
    <Button
      variant="ghost"
      color="neutral"
      size={size}
      iconOnly
      icon={isDark ? Sun : Moon}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={className}
    />
  );
}