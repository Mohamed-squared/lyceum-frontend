// FILE: src/app/layout.tsx
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The lang attribute will be handled by the locale-specific layout
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}