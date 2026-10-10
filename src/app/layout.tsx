import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090a0f",
};

export const metadata: Metadata = {
  title: "DemoPilot — Evidence-Grounded Product Demonstrations",
  description:
    "DemoPilot turns an existing website or web application into an evidence-grounded, professional product demonstration. Grounded in your real product, verified by Gemini.",
  keywords: [
    "product demo",
    "browser automation",
    "interactive demo",
    "evidence-grounded AI",
    "SaaS walkthrough",
    "Gemini TTS",
    "Playwright",
  ],
  authors: [{ name: "DemoPilot Engineering" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-primary-500/25 selection:text-white">
        {children}
      </body>
    </html>
  );
}
