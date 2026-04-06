"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ThemeProvider, useTheme } from "@/lib/theme";

function CommunityShell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <Nav variant={theme} showToggle />
      <main className="flex-1">{children}</main>
      <Footer variant={theme} />
    </div>
  );
}

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <CommunityShell>{children}</CommunityShell>
    </ThemeProvider>
  );
}
