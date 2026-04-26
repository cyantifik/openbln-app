"use client";

import { useTheme, THEME_STOPS } from "@/lib/theme";

type FooterVariant = "light" | "dark";

interface FooterProps {
  variant?: FooterVariant;
  showToggle?: boolean;
}

export default function Footer({ variant = "light", showToggle }: FooterProps) {
  const { theme: themeColors } = useTheme();

  const colors = showToggle ? themeColors : (variant === "dark" ? THEME_STOPS[4] : THEME_STOPS[0]);

  const linkStyle = { color: colors.textFaint };
  const linkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = colors.textMuted;
  };
  const linkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = colors.textFaint;
  };

  return (
    <footer
      className="border-t transition-colors duration-500"
      style={{
        borderTopColor: colors.border,
        backgroundColor: showToggle ? colors.bg : (variant === "dark" ? "transparent" : "#ffffff"),
      }}
    >
      <div
        className="max-w-6xl mx-auto px-6 py-8 transition-colors duration-500"
        style={{ color: colors.textFaint }}
      >
        {/* Links row */}
        <div className="flex flex-wrap justify-center gap-4 mb-5 text-xs tracking-widest uppercase">
          <a
            href="/about"
            className="transition-colors duration-200"
            style={linkStyle}
            onMouseEnter={linkHover}
            onMouseLeave={linkLeave}
          >
            About
          </a>
          <span style={{ color: colors.separator }}>·</span>
          <a
            href="https://instagram.com/open.bln"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200"
            style={linkStyle}
            onMouseEnter={linkHover}
            onMouseLeave={linkLeave}
          >
            Instagram
          </a>
          <span style={{ color: colors.separator }}>·</span>
          <a
            href="https://www.linkedin.com/company/open-bln"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200"
            style={linkStyle}
            onMouseEnter={linkHover}
            onMouseLeave={linkLeave}
          >
            LinkedIn
          </a>
          <span style={{ color: colors.separator }}>·</span>
          <a
            href="mailto:hallo@open-bln.com"
            className="transition-colors duration-200"
            style={linkStyle}
            onMouseEnter={linkHover}
            onMouseLeave={linkLeave}
          >
            Email Us
          </a>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs">
          &copy; 2026{" "}
          <span className="font-bold">OPEN</span>{" "}
          <span className="font-light">BLN</span>
          {" "}&hearts;{" "}All rights reserved.
        </p>
      </div>
    </footer>
  );
}
