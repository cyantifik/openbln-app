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
        className="max-w-6xl mx-auto px-6 py-6 text-center text-xs transition-colors duration-500"
        style={{ color: colors.textFaint }}
      >
        {/* Row 1: Copyright + links */}
        <div className="flex flex-wrap justify-center items-center gap-x-1 mb-2 tracking-widest uppercase">
          <span>
            &copy; 2026{" "}
            <span className="font-bold">OPEN</span>{" "}
            <span className="font-light">BLN</span>
            {" "}&hearts;{" "}All rights reserved.
          </span>
          <span style={{ color: colors.separator }}>|</span>
          <a href="/about" className="transition-colors duration-200" style={linkStyle} onMouseEnter={linkHover} onMouseLeave={linkLeave}>About</a>
          <span style={{ color: colors.separator }}>|</span>
          <a href="https://instagram.com/open.bln" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200" style={linkStyle} onMouseEnter={linkHover} onMouseLeave={linkLeave}>IG</a>
          <span style={{ color: colors.separator }}>|</span>
          <a href="https://www.linkedin.com/company/open-bln" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200" style={linkStyle} onMouseEnter={linkHover} onMouseLeave={linkLeave}>LI</a>
          <span style={{ color: colors.separator }}>|</span>
          <a href="mailto:hallo@open-bln.com" className="transition-colors duration-200" style={linkStyle} onMouseEnter={linkHover} onMouseLeave={linkLeave}>@</a>
        </div>

        {/* Row 2: Legal */}
        <div className="flex justify-center gap-x-1 tracking-widest uppercase">
          <a href="/privacy" className="transition-colors duration-200" style={linkStyle} onMouseEnter={linkHover} onMouseLeave={linkLeave}>Privacy</a>
          <span style={{ color: colors.separator }}>|</span>
          <a href="/imprint" className="transition-colors duration-200" style={linkStyle} onMouseEnter={linkHover} onMouseLeave={linkLeave}>Imprint</a>
        </div>
      </div>
    </footer>
  );
}
