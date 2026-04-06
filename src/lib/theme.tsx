"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// 5 curated theme stops — each with hand-tuned colors for full readability
export const THEME_STOPS = [
  {
    id: 0,
    label: "Light",
    bg: "#ffffff",
    text: "#000000",
    textMuted: "#6b7280",    // gray-500
    textFaint: "#9ca3af",    // gray-400
    border: "#e5e7eb",       // gray-200
    borderHover: "#9ca3af",  // gray-400
    cardBg: "#ffffff",
    cardBorder: "#e5e7eb",
    inputBorder: "#d1d5db",
    inputFocus: "#000000",
    tagBg: "#f3f4f6",
    tagText: "#374151",
    tagBorder: "#e5e7eb",
    accent: "#000000",
    accentText: "#ffffff",
    separator: "#d1d5db",
  },
  {
    id: 1,
    label: "Mist",
    bg: "#e8e8e8",
    text: "#1a1a1a",
    textMuted: "#5c5c5c",
    textFaint: "#888888",
    border: "#cccccc",
    borderHover: "#888888",
    cardBg: "#f2f2f2",
    cardBorder: "#cccccc",
    inputBorder: "#bbbbbb",
    inputFocus: "#1a1a1a",
    tagBg: "#dcdcdc",
    tagText: "#3a3a3a",
    tagBorder: "#c0c0c0",
    accent: "#1a1a1a",
    accentText: "#f2f2f2",
    separator: "#bbbbbb",
  },
  {
    id: 2,
    label: "Stone",
    bg: "#a0a0a0",
    text: "#111111",
    textMuted: "#3d3d3d",
    textFaint: "#555555",
    border: "#888888",
    borderHover: "#555555",
    cardBg: "#b0b0b0",
    cardBorder: "#888888",
    inputBorder: "#777777",
    inputFocus: "#111111",
    tagBg: "#949494",
    tagText: "#1a1a1a",
    tagBorder: "#777777",
    accent: "#111111",
    accentText: "#c0c0c0",
    separator: "#777777",
  },
  {
    id: 3,
    label: "Dusk",
    bg: "#3a3a3a",
    text: "#e8e8e8",
    textMuted: "#aaaaaa",
    textFaint: "#777777",
    border: "#555555",
    borderHover: "#888888",
    cardBg: "#444444",
    cardBorder: "#555555",
    inputBorder: "#666666",
    inputFocus: "#e8e8e8",
    tagBg: "#4a4a4a",
    tagText: "#cccccc",
    tagBorder: "#5a5a5a",
    accent: "#e8e8e8",
    accentText: "#2a2a2a",
    separator: "#555555",
  },
  {
    id: 4,
    label: "Dark",
    bg: "#111111",
    text: "#f0f0f0",
    textMuted: "#999999",
    textFaint: "#666666",
    border: "#2a2a2a",
    borderHover: "#555555",
    cardBg: "#1a1a1a",
    cardBorder: "#2a2a2a",
    inputBorder: "#3a3a3a",
    inputFocus: "#f0f0f0",
    tagBg: "#222222",
    tagText: "#aaaaaa",
    tagBorder: "#333333",
    accent: "#f0f0f0",
    accentText: "#111111",
    separator: "#333333",
  },
] as const;

export type ThemeStop = (typeof THEME_STOPS)[number];

interface ThemeContextType {
  stop: number;        // 0-4
  theme: ThemeStop;
  setStop: (n: number) => void;
  // Convenience booleans
  isDark: boolean;     // stop >= 3
  isLight: boolean;    // stop <= 1
}

const ThemeContext = createContext<ThemeContextType>({
  stop: 0,
  theme: THEME_STOPS[0],
  setStop: () => {},
  isDark: false,
  isLight: true,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [stop, setStopState] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("space-theme-stop");
    if (saved !== null) {
      const n = parseInt(saved, 10);
      if (n >= 0 && n <= 4) setStopState(n);
    }
  }, []);

  const setStop = (n: number) => {
    const clamped = Math.max(0, Math.min(4, n));
    setStopState(clamped);
    localStorage.setItem("space-theme-stop", String(clamped));
  };

  const theme = THEME_STOPS[stop];

  return (
    <ThemeContext.Provider
      value={{
        stop,
        theme,
        setStop,
        isDark: stop >= 3,
        isLight: stop <= 1,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
