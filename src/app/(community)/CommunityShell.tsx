"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ThemeProvider, useTheme } from "@/lib/theme";

function Shell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-500"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <Nav variant="light" showToggle />
      <main className="flex-1">{children}</main>
      <Footer variant="light" showToggle />
    </div>
  );
}

export default function CommunityShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Shell>{children}</Shell>
    </ThemeProvider>
  );
}
