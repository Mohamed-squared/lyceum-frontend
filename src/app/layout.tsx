// FILE: src/app/layout.tsx
import './globals.css';

import React from 'react'; // Ensure React is imported if needed for JSX, though for simple children it might not be.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // Return children directly, wrapped in a fragment or nothing if allowed
}