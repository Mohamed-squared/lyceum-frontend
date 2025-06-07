// FINAL CODE FOR: src/app/layout.tsx
import React from 'react';
import './globals.css';

// This is the top-level root layout.
// It MUST be a minimal pass-through component that only returns its children.
// It must not render <html> or <body>.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}