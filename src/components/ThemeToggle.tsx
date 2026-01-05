'use client';

import { useTheme } from './ThemeProvider';
import { useAnalytics } from '@/hooks/useAnalytics';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { trackThemeToggle } = useAnalytics();

  const toggleTheme = () => {
    const nextTheme = theme === 'system'
      ? (resolvedTheme === 'light' ? 'dark' : 'light')
      : (theme === 'light' ? 'dark' : 'light');
    setTheme(nextTheme);
    trackThemeToggle(nextTheme);
  };

  const getIcon = () => {
    if (theme === 'system') {
      return resolvedTheme === 'dark' ? '🌙' : '☀️';
    }
    return theme === 'dark' ? '🌙' : '☀️';
  };

  const getLabel = () => {
    if (theme === 'system') {
      return resolvedTheme === 'dark' ? 'Dark (System)' : 'Light (System)';
    }
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      title="Toggle theme (click to switch, currently follows system)"
      aria-label={`Toggle theme. Current: ${getLabel()}`}
    >
      <span className="text-base">{getIcon()}</span>
      <span className="hidden sm:inline">{getLabel()}</span>
    </button>
  );
}
