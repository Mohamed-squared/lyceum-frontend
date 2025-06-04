import type { Metadata } from "next";
import "./globals.css";
// @ts-ignore
import nextI18NextConfig from "../../next-i18next.config.js"; // Adjust path
import I18nProviderClient from "../i18n-provider"; // Adjusted path
import { dir } from 'i18next';
import Header from "../../components/Header"; // Import Header
import Footer from "../../components/Footer"; // Import Footer

export async function generateStaticParams() {
  return nextI18NextConfig.i18n.locales.map((locale: string) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Lyceum Learning Platform", // Updated title
  description: "Personalized tests, AI-driven learning, and gamified progress.", // Updated description
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  // Here, you could fetch initial translations for the server layout if needed,
  // or rely on the I18nProviderClient to load them.
  // For simplicity, we'll let I18nProviderClient handle it, or pass pre-fetched.
  // This example doesn't pre-fetch for layout, but page.tsx will.

  return (
    <html lang={locale} dir={dir(locale)}>
      <body>
        <I18nProviderClient locale={locale} namespaces={['common']} resources={{}}>
          <Header />
          <main className="pt-16 min-h-screen flex flex-col"> {/* Ensure content can fill screen */}
            <div className="flex-grow"> {/* Content wrapper */}
              {children}
            </div>
            <Footer />
          </main>
        </I18nProviderClient>
      </body>
    </html>
  );
}
