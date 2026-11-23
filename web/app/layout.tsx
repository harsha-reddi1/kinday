import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "kinDay — Calm Family Planning & Routines",
  description: "A calm, child-safe family planner connecting school notices, daily routines, and small moments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
