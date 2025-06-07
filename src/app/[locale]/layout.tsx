// FILE: src/app/[locale]/layout.tsx
import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
// Ensure globals.css is imported if it's not already handled by the root layout.
// However, since the new root layout src/app/layout.tsx imports it,
// it might not be necessary to import it again here, depending on Next.js version and specific setup.
// For now, we'll assume it's handled by the root layout as per the new structure.
// If build issues arise related to CSS, this is a point to check.
// import '../globals.css';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

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

export default async function LocaleLayout({ // Renamed from RootLayout to LocaleLayout for clarity
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages({locale});

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${lora.variable} font-sans`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
