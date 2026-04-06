import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OPEN BLN - Berlin Creative Community",
  description:
    "A Berlin-based creative community shaped by mentorship, colored with inspiration, and driven by purposeful collaboration.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "OPEN BLN",
    description:
      "Berlin-based creative community shaped by mentorship, colored with inspiration, and driven by purposeful collaboration.",
    url: "https://open-bln.com",
    siteName: "OPEN BLN",
    images: [
      {
        url: "https://open-bln.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "OPEN BLN",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OPEN BLN",
    description:
      "Berlin-based creative community shaped by mentorship, colored with inspiration, and driven by purposeful collaboration.",
    images: ["https://open-bln.com/og-image.png"],
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black">{children}</body>
    </html>
  );
}
