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
      <body className="bg-white">
        <Nav />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-gray-200 bg-white mt-20">
          <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
            <p>OPEN BLN — A community for Berlin's creative professionals</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
