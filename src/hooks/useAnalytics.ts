import { useCallback } from 'react';

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number | string;
}

export function useAnalytics() {
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
  }, []);

  const trackPageView = useCallback((path: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
        page_path: path,
      });
    }
  }, []);

  const trackSearch = useCallback((query: string, resultCount: number) => {
    trackEvent({
      action: 'search',
      category: 'Engagement',
      label: query,
      value: resultCount,
    });
  }, [trackEvent]);

  const trackCalculator = useCallback(
    (inputTokens: number, outputTokens: number, modelCount: number) => {
      trackEvent({
        action: 'calculate_costs',
        category: 'Engagement',
        label: `${inputTokens}i_${outputTokens}o`,
        value: modelCount,
      });
    },
    [trackEvent]
  );

  const trackSort = useCallback((column: string, direction: string) => {
    trackEvent({
      action: 'sort_table',
      category: 'Interaction',
      label: `${column}_${direction}`,
    });
  }, [trackEvent]);

  const trackSubmit = useCallback((provider: string) => {
    trackEvent({
      action: 'submit_pricing',
      category: 'Contribution',
      label: provider,
    });
  }, [trackEvent]);

  const trackThemeToggle = useCallback((theme: string) => {
    trackEvent({
      action: 'toggle_theme',
      category: 'Preference',
      label: theme,
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackSearch,
    trackCalculator,
    trackSort,
    trackSubmit,
    trackThemeToggle,
  };
}