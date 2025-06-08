// FINAL CODE FOR: src/app/[locale]/layout.tsx
import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/ThemeProvider'; // Import the new provider

// This is the main application layout. It renders the <html> and <body> tags.

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Lyceum - Your AI-Powered Learning Platform',
  description: 'Lyceum combines intelligent test generation, AI-driven study tools, and immersive courses to personalize your path to academic excellence and lifelong learning.',
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning> {/* Add suppressHydrationWarning */}
      <body className={`${inter.variable} ${lora.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
