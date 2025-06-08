// NEW FILE: src/components/ThemeSwitcher.tsx
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { HiSun, HiMoon } from 'react-icons/hi';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      <HiSun className="h-6 w-6 hidden dark:block" />
      <HiMoon className="h-6 w-6 block dark:hidden" />
    </button>
  );
}
