// src/lib/theme-script.ts
// NO "use client" — this file is server-safe.
// It duplicates THEME_INIT_SCRIPT from ThemeToggle so layout.tsx
// (a Server Component) can import it without crossing a client boundary.

export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;