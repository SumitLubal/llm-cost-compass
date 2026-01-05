'use client';

import { useEffect, useRef } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

export function ScrollTracker() {
  const { trackEvent } = useAnalytics();
  const hasTracked25 = useRef(false);
  const hasTracked50 = useRef(false);
  const hasTracked75 = useRef(false);
  const hasTracked100 = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

      // Track scroll milestones (25%, 50%, 75%, 100%)
      if (scrollPercent >= 25 && !hasTracked25.current) {
        hasTracked25.current = true;
        trackEvent({
          action: 'scroll_25',
          category: 'Engagement',
          label: 'scroll_depth',
          value: 25,
        });
      }

      if (scrollPercent >= 50 && !hasTracked50.current) {
        hasTracked50.current = true;
        trackEvent({
          action: 'scroll_50',
          category: 'Engagement',
          label: 'scroll_depth',
          value: 50,
        });
      }

      if (scrollPercent >= 75 && !hasTracked75.current) {
        hasTracked75.current = true;
        trackEvent({
          action: 'scroll_75',
          category: 'Engagement',
          label: 'scroll_depth',
          value: 75,
        });
      }

      if (scrollPercent >= 95 && !hasTracked100.current) {
        hasTracked100.current = true;
        trackEvent({
          action: 'scroll_100',
          category: 'Engagement',
          label: 'scroll_depth',
          value: 100,
        });
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [trackEvent]);

  return null;
}
