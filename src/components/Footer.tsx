"use client";

import { useTheme, THEME_STOPS } from "@/lib/theme";

type FooterVariant = "light" | "dark";

interface FooterProps {
  variant?: FooterVariant;
  showToggle?: boolean;
}

export default function Footer({ variant = "light", showToggle }: FooterProps) {
  const { theme: themeColors } = useTheme();

  // Use context colors if showToggle, otherwise static
  const colors = showToggle ? themeColors : (variant === "dark" ? THEME_STOPS[4] : THEME_STOPS[0]);

  return (
    <footer
      className="border-t transition-colors duration-500"
      style={{
        borderTopColor: colors.border,
        backgroundColor: showToggle ? colors.bg : (variant === "dark" ? "transparent" : "#ffffff"),
      }}
    >
      <div
        className="max-w-6xl mx-auto px-6 py-6 text-center text-xs transition-colors duration-500"
        style={{ color: colors.textFaint }}
      >
        <p>
          &copy; 2026{" "}
          <span className="font-bold">OPEN</span>{" "}
          <span className="font-light">BLN</span>
          {" "}&hearts;{" "}All rights reserved.
        </p>
      </div>
    </footer>
  );
}
