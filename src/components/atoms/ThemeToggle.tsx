"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import type { SizeProp } from "@/lib/types";

/**
 * Drop this in layout.tsx, in <head>, BEFORE any other script:
 *
 *   <head>
 *     <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
 *   </head>
 *
 * It runs before React hydrates, reads localStorage (falls back to OS
 * preference), and sets the `dark` class immediately — no flash of the
 * wrong theme on load.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

export interface ThemeToggleProps {
  /**
   * Design-system size token or a custom size object — passed straight
   * through to the underlying Button atom.
   * Defaults to "md" which matches the Navbar's default icon size.
   */
  size?: SizeProp;
  className?: string;
}

/**
 * Atom — single-responsibility icon button that toggles light / dark mode.
 *
 * Placement in the atomic hierarchy:
 *   atoms/ThemeToggle.tsx  ← here
 *   molecules/...
 *   organisms/Navbar.tsx   ← consumes via `showThemeToggle` prop
 *
 * Can also be used standalone anywhere in the tree.
 */
export function ThemeToggle({ size = "md", className }: ThemeToggleProps) {
  const [isDark, setIsDark] = React.useState(false);

  // Read the real DOM state after hydration (avoids SSR mismatch)
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
      // localStorage may be unavailable (private browsing etc.)
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
