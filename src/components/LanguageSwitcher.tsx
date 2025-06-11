// FINAL CORRECTED CODE for: src/components/LanguageSwitcher.tsx
'use client';

import { usePathname, useRouter } from '@/navigation'; // <-- Import the CORRECT, localized hooks
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

    startTransition(() => {
      // Use the new router to push the same pathname but with a different locale
      router.push(pathname, { locale: newLocale });
    });
  };

  return (
    <select
      value={locale}
      onChange={handleChange}
      disabled={isPending}
      className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="en">English</option>
      <option value="ar">العربية</option>
      <option value="tr">Türkçe</option>
      <option value="de">Deutsch</option>
    </select>
  );
}
