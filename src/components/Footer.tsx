type FooterVariant = "light" | "dark";

export default function Footer({ variant = "light" }: { variant?: FooterVariant }) {
  const isDark = variant === "dark";

  return (
    <footer
      className={`border-t ${
        isDark
          ? "border-white/10 bg-transparent"
          : "border-gray-200 bg-white"
      }`}
    >
      <div
        className={`max-w-6xl mx-auto px-6 py-6 text-center text-xs ${
          isDark ? "text-white/30" : "text-gray-400"
        }`}
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
