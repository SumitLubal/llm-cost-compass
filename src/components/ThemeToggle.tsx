'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { useAnalytics } from '@/hooks/useAnalytics';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { trackThemeToggle } = useAnalytics();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    trackThemeToggle(newTheme);
    setIsOpen(false);
  };

  const getCurrentIcon = () => {
    if (theme === 'system') {
      return resolvedTheme === 'dark' ? '🌙' : '☀️';
    }
    return theme === 'dark' ? '🌙' : '☀️';
  };

  const getCurrentLabel = () => {
    if (theme === 'system') {
      return resolvedTheme === 'dark' ? 'System (Dark)' : 'System (Light)';
    }
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  const options = [
    { value: 'light' as const, icon: '☀️', label: 'Light' },
    { value: 'dark' as const, icon: '🌙', label: 'Dark' },
    { value: 'system' as const, icon: '⚙️', label: 'System' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        aria-label="Theme selector"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-base">{getCurrentIcon()}</span>
        <span className="hidden sm:inline">{getCurrentLabel()}</span>
        <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50 origin-top-right transition-all ${
          isOpen
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
        role="listbox"
      >
        {options.map((option) => {
          const isActive = theme === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleThemeChange(option.value)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-medium'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              role="option"
              aria-selected={isActive}
            >
              <span className="text-base">{option.icon}</span>
              <span>{option.label}</span>
              {isActive && <span className="ml-auto text-purple-600 dark:text-purple-400">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
