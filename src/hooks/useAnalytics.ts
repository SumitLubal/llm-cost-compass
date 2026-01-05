import { useCallback } from 'react';

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number | string;
}

// Helper to get measurement ID
function getMeasurementId(): string {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
}

// Helper to check if GA is ready
function isGAReady(): boolean {
  return typeof window !== 'undefined' &&
         typeof window.gtag === 'function' &&
         Array.isArray(window.dataLayer);
}

export function useAnalytics() {
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    const measurementId = getMeasurementId();

    console.log('[GA DEBUG] trackEvent called:', { event, measurementId });

    if (!measurementId) {
      console.log('[GA] No measurement ID configured, skipping event');
      return;
    }

    if (typeof window === 'undefined') {
      console.log('[GA] Server-side, skipping event');
      return;
    }

    // Check if GA is ready
    if (isGAReady()) {
      console.log('[GA] Sending via gtag');
      window.gtag!('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    } else if (window.dataLayer) {
      console.log('[GA] GA not fully ready, queuing to dataLayer');
      window.dataLayer.push(['event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      }]);
    } else {
      console.log('[GA] No dataLayer available - GA not initialized');
    }
  }, []);

  const trackPageView = useCallback((path: string) => {
    const measurementId = getMeasurementId();

    console.log('[GA DEBUG] trackPageView called:', { path, measurementId });

    if (!measurementId) {
      console.log('[GA] No measurement ID configured, skipping page view');
      return;
    }

    if (typeof window === 'undefined') {
      console.log('[GA] Server-side, skipping page view');
      return;
    }

    if (isGAReady()) {
      console.log('[GA] Sending page view via gtag');
      window.gtag!('config', measurementId, {
        page_path: path,
      });
    } else if (window.dataLayer) {
      console.log('[GA] GA not fully ready, queuing page view to dataLayer');
      window.dataLayer.push(['config', measurementId, { page_path: path }]);
    } else {
      console.log('[GA] No dataLayer available for page view');
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