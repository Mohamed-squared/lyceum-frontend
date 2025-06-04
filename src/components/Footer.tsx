'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';

export default function Footer() {
  const { t } = useTranslation('common');
  const params = useParams();
  const currentLocale = params.locale as string;

  const footerLinks = [
    { href: '/about', labelKey: 'footer.about' },
    { href: '/support', labelKey: 'footer.support' },
    { href: '/privacy', labelKey: 'footer.privacy' },
    { href: '/terms', labelKey: 'footer.terms' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo/Brand - Optional, can be added here */}
          <div className="mb-6 md:mb-0 lg:col-span-1">
            <Link href={`/${currentLocale}`} className="text-xl font-playfair font-bold text-white hover:text-gold transition-colors">
              {t('appName')}
            </Link>
            <p className="mt-2 text-sm text-gray-400">
              {t('footer.tagline', {defaultValue: 'Empowering learners through AI.'})}
            </p>
          </div>

          {/* Quick Links - Example Column */}
          <div className="lg:col-span-1">
            <h5 className="text-md font-semibold text-white uppercase tracking-wider">{t('footer.quickLinks', {defaultValue: 'Quick Links'})}</h5>
            <ul className="mt-4 space-y-2">
              {footerLinks.slice(0, 2).map((link) => ( // Example: first two links
                <li key={link.labelKey}>
                  <Link
                    href={`/${currentLocale}${link.href}`}
                    className="text-sm hover:text-gold transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links - Example Column */}
          <div className="lg:col-span-1">
             <h5 className="text-md font-semibold text-white uppercase tracking-wider">{t('footer.resources', {defaultValue: 'Resources'})}</h5>
            <ul className="mt-4 space-y-2">
              {footerLinks.slice(2, 4).map((link) => ( // Example: next two links
                <li key={link.labelKey}>
                  <Link
                    href={`/${currentLocale}${link.href}`}
                    className="text-sm hover:text-gold transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact/Social - Example Column, can be added if needed */}
           <div className="lg:col-span-1">
            <h5 className="text-md font-semibold text-white uppercase tracking-wider">{t('footer.connect', {defaultValue: 'Connect'})}</h5>
            {/* Placeholder for social media icons or contact info */}
            <p className="mt-4 text-sm text-gray-400">{t('footer.emailUs', {defaultValue: 'contact@lyceum.com'})}</p>
          </div>

        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-400">
            {t('footer.copyright', { year: currentYear, appName: t('appName'), defaultValue: `© ${currentYear} ${t('appName')}. All rights reserved.` })}
          </p>
        </div>
      </div>
    </footer>
  );
}
