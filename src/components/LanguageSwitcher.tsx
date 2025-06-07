// src/components/LanguageSwitcher.tsx
'use client';

import { useRouter } from 'next/navigation';

const LanguageSwitcher = () => {
  const router = useRouter();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'de', name: 'Deutsch' },
  ];

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = window.location.pathname; // e.g., /en/about, /about, /en/, /
    const pathSegments = currentPath.split('/'); // e.g., ["", "en", "about"], ["", "about"], ["", "en", ""], ["", ""]

    // Check if the first path segment (index 1) is a known locale
    const currentLocaleIsPresentInPath = languages.some(lang => lang.code === pathSegments[1]);

    let basePathWithoutLocale;
    if (currentLocaleIsPresentInPath) {
      // If current path is /en/foo/bar, pathSegments = ["", "en", "foo", "bar"]
      // We want "foo/bar". So slice from index 2.
      const segmentsAfterLocale = pathSegments.slice(2);
      basePathWithoutLocale = segmentsAfterLocale.join('/');
    } else {
      // If current path is /foo/bar (default locale), pathSegments = ["", "foo", "bar"]
      // We want "foo/bar". So slice from index 1.
      // If current path is / (default locale, root), pathSegments = ["", ""].
      // Slicing from index 1 gives [""]. join('/') gives "".
      const segmentsAfterPotentialSlash = pathSegments.slice(1);
      basePathWithoutLocale = segmentsAfterPotentialSlash.join('/');
    }

    // basePathWithoutLocale is now like "foo/bar" or "" (for root)

    let newPath;
    if (basePathWithoutLocale === "") {
      newPath = `/${newLocale}`; // For root, e.g. /de
    } else {
      newPath = `/${newLocale}/${basePathWithoutLocale}`; // For other pages, e.g. /de/foo/bar
    }

    // Handle potential trailing slash if the original path had one (e.g. /en/somepage/)
    // basePathWithoutLocale might end with a slash if pathSegments ended with an empty string
    // e.g. /en/page/ -> pathSegments ["", "en", "page", ""] -> slice(2) -> ["page", ""] -> join -> "page/"
    if (currentPath.endsWith('/') && !newPath.endsWith('/') && newPath !== `/${newLocale}`) {
        newPath += '/';
    }

    router.push(newPath);
  };

  return (
    <div className="flex space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className="px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-lyceum-accent"
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
