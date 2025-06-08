// src/app/[locale]/login/layout.tsx
import React from 'react';

// This layout is minimal and only renders the children,
// effectively isolating the login page from the main site's Navbar and Footer.
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
