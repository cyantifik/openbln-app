import type { Metadata } from "next";
import Nav from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "OPEN BLN - Berlin Creative Community",
  description:
    "A community platform for designers, developers, and creative professionals in Berlin.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white">
        <Nav />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-gray-200 bg-white mt-20">
          <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 <span className="font-bold">OPEN</span> <span className="font-light">BLN</span> — A community for Berlin&apos;s creative professionals &nbsp;&hearts;&nbsp; All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
