'use client';
import { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { setTheme } = useTheme();

  const handleThemeChange = useCallback(() => {
    if (typeof window !== 'undefined') {
      const userPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const localTheme = localStorage.getItem('theme');

      if (localTheme === 'dark' || (!localTheme && userPrefersDark)) {
        document.documentElement.classList.add('dark');
        setDarkMode(true);
        setTheme('dark');
      } else {
        document.documentElement.classList.remove('dark');
        setTheme('light');
      }
    }
  }, [setTheme]);

  useEffect(() => {
    handleThemeChange();
  }, [handleThemeChange]);

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`flex h-[24px] w-[24px] items-center justify-center rounded-full bg-background-200 p-0.5 text-heading hover:bg-background-300 dark:bg-background-dark-200 dark:hover:bg-background-dark-300 md:h-[32px] md:w-[32px] md:p-1 lg:h-[40px] lg:w-[40px] lg:p-2`}
    >
      {darkMode ? (
        <Sun fill='gold' stroke='gold' />
      ) : (
        <Moon fill='gold' stroke='gold' />
      )}
    </button>
  );
};
