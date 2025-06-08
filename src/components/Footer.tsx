// FILE: src/components/Footer.tsx
'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Link, type AppPathnames } from '@/navigation';

interface FooterLink { label: string; href: AppPathnames; }

export default function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  const sections = [
    { title: t('company.title'), links: [ { label: t('company.about'), href: '/about' }, { label: t('company.contact'), href: '/contact' } ] as FooterLink[] },
    { title: t('legal.title'), links: [ { label: t('legal.privacy'), href: '/privacy' }, { label: t('legal.terms'), href: '/terms' } ] as FooterLink[] }
  ];

  return (
    <footer className="bg-gray-900 text-white p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="font-bold mb-2 uppercase">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white hover:underline">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="font-bold mb-2 uppercase">{t('newsletter.title')}</h3>
          <p className="text-sm text-gray-400">{t('newsletter.description')}</p>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-8 pt-8 border-t border-gray-800">
        <p>{t('copyright', { year: currentYear })}</p>
      </div>
    </footer>
  );
}
