type FooterVariant = "light" | "dark";

export default function Footer({ variant = "light" }: { variant?: FooterVariant }) {
  const isDark = variant === "dark";

  const linkColor = isDark
    ? "text-white/30 hover:text-white/60"
    : "text-gray-400 hover:text-gray-600";
  const dividerColor = isDark ? "text-white/15" : "text-gray-300";

  return (
    <footer
      className={`border-t ${
        isDark
          ? "border-white/10 bg-transparent"
          : "border-gray-200 bg-white"
      }`}
    >
      <div
        className={`max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs tracking-widest uppercase ${
          isDark ? "text-white/30" : "text-gray-400"
        }`}
      >
        <p className="font-normal normal-case tracking-normal text-xs">
          &copy; 2026{" "}
          <span className="font-bold">OPEN</span>{" "}
          <span className="font-light">BLN</span>
          {" "}&hearts;{" "}All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <a href="https://space.open-bln.com" className={`transition-colors ${linkColor}`}>Space</a>
          <span className={dividerColor}>|</span>
          <a href="https://instagram.com/open.bln" target="_blank" rel="noopener noreferrer" className={`transition-colors ${linkColor}`}>IG</a>
          <span className={dividerColor}>|</span>
          <a href="https://www.linkedin.com/company/open-bln" target="_blank" rel="noopener noreferrer" className={`transition-colors ${linkColor}`}>LI</a>
          <span className={dividerColor}>|</span>
          <a href="mailto:hallo@open-bln.com" className={`transition-colors ${linkColor}`}>@</a>
        </div>
      </div>
    </footer>
  );
}
