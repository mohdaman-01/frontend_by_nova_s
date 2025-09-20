import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function FloatingThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [hidden, setHidden] = useState(false);
  const lastY = useRef<number>(0);

  // Init theme (default dark per project brand)
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    let next: "light" | "dark" = "dark";
    if (saved === "light" || saved === "dark") next = saved;
    else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
      next = "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const delta = y - (lastY.current || 0);
      if (Math.abs(delta) < 6) return; // ignore tiny moves
      setHidden(delta > 0); // hide when scrolling down
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  return (
    <button
      aria-label="Toggle theme"
      aria-pressed={theme === "dark"}
      onClick={toggle}
      className={cn(
        "fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60]",
        hidden
          ? "translate-y-6 opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100",
        "transition-all",
      )}
    >
      <span
        className={cn(
          "relative inline-flex h-9 w-16 items-center rounded-full border backdrop-blur shadow-lg transition-all",
          "bg-background/80 border-border",
          "dark:bg-white/10 dark:border-white/15 ring-1 ring-violet-500/10",
          "hover:ring-violet-500/25 hover:shadow-purple-500/30 hover:shadow-xl",
        )}
      >
        <span className="pointer-events-none absolute left-1">
          <Moon
            className={cn(
              "h-4 w-4 transition-colors",
              theme === "dark" ? "text-violet-300" : "text-muted-foreground/70",
            )}
          />
        </span>
        <span className="pointer-events-none absolute right-1">
          <Sun
            className={cn(
              "h-4 w-4 transition-colors",
              theme === "light"
                ? "text-yellow-300"
                : "text-muted-foreground/70",
            )}
          />
        </span>
        <span
          className={cn(
            "absolute left-1 top-1 h-7 w-7 rounded-full border transition-transform",
            "bg-white dark:bg-white border-black/5 dark:border-white/20",
            "shadow-[0_2px_12px_rgba(139,92,246,0.35)]",
            theme === "light" ? "translate-x-7" : "translate-x-0",
          )}
        />
      </span>
    </button>
  );
}
