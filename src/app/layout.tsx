// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // Keep global styles here

export const metadata: Metadata = {
  title: "Lyceum Learning Platform", // Can be generic here, specific layouts can override
  description: "Welcome to Lyceum!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The lang and dir attributes will be handled by the [locale]/layout.tsx
    // This root layout should not be locale-aware.
    <html>
      <body>{children}</body>
    </html>
  );
}
