// UPDATED FILE: src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Lora } from 'next/font/google';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider'; // Import the new provider

// Assuming font and metadata definitions exist and should remain the same.
// If they don't exist, this subtask might need adjustment or fail.
// For now, proceeding with the assumption they are correctly defined elsewhere or not needed for this specific change.

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-lora' });

export const metadata: Metadata = {
  title: 'Lyceum',
  description: 'Personalized Learning Platform',
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
