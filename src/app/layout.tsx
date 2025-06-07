import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import './globals.css';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server'; // getLocale is not strictly needed here if we use params.locale

// Configure Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', // CSS variable
});

// Configure Lora font
const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora', // CSS variable
  weight: ['400', '700'], // Specify weights needed
});

export const metadata: Metadata = {
  title: 'Lyceum - Your AI-Powered Learning Platform',
  description: 'Lyceum combines intelligent test generation, AI-driven study tools, and immersive courses to personalize your path to academic excellence and lifelong learning.',
};

// Define a named interface for the RootLayout props
interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function RootLayout({
  children,
  params: {locale}
}: RootLayoutProps) { // Use the named interface
  // Explicitly pass the locale to getMessages
  const messages = await getMessages({locale});

  return (
    <html lang={locale}>
      {/* Apply font variables to the body for global access if needed,
          and Inter as the default sans-serif font.
          Tailwind's font-sans and font-serif will pick up from tailwind.config.ts
      */}
      <body className={`${inter.variable} ${lora.variable} font-sans`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
