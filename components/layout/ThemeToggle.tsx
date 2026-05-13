"use client";

import { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved === "dark" || (!saved && prefersDark);
    setIsDark(dark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    const theme = next ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  if (!mounted) {
    return <span className={`inline-block w-9 h-5 ${className}`} aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      style={{
        display: "inline-flex",
        alignItems: "center",
        width: "2.25rem", // 36px
        height: "1.25rem", // 20px
        borderRadius: "999px",
        border: "1.5px solid var(--color-border-strong)",
        backgroundColor: isDark ? "var(--color-fg)" : "transparent",
        cursor: "pointer",
        padding: "2px",
        transition: "background-color 200ms, border-color 200ms",
        flexShrink: 0,
      }}
      className={className}
    >
      <span
        aria-hidden="true"
        style={{
          display: "block",
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          backgroundColor: isDark ? "var(--color-bg)" : "var(--color-fg)",
          transform: isDark ? "translateX(16px)" : "translateX(0)",
          transition: "transform 200ms, background-color 200ms",
          flexShrink: 0,
        }}
      />
    </button>
  );
}
