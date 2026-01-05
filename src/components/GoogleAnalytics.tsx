'use client';

import { useEffect } from 'react';

interface GoogleAnalyticsProps {
  measurementId: string;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize dataLayer FIRST (before script loads)
    if (!window.dataLayer) {
      window.dataLayer = [];
      console.log('[GA] Created dataLayer');
    }

    // Define gtag function that pushes to dataLayer
    if (!window.gtag) {
      window.gtag = function gtag() {
        window.dataLayer!.push(arguments);
      };
      console.log('[GA] Created gtag function');
    }

    // Queue initial config - this will be processed when gtag.js loads
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_path: window.location.pathname,
      send_page_view: true,
    });
    console.log('[GA] Config queued:', measurementId);

    // Load gtag.js script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    script.onload = () => {
      console.log('[GA] Script loaded successfully');
    };
    script.onerror = (e) => {
      console.error('[GA] Script failed to load:', e);
    };
    document.head.appendChild(script);

    return () => {};
  }, [measurementId]);

  return null;
}

// Helper function to track events
export const trackEvent = (
  action: string,
  category: string,
  label: string = '',
  value: number | string = ''
) => {
  if (typeof window === 'undefined') return;

  console.log('[GA] trackEvent called:', { action, category, label, value });

  if (window.gtag) {
    console.log('[GA] Sending via gtag');
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else if (window.dataLayer) {
    console.log('[GA] gtag not ready, queuing to dataLayer');
    window.dataLayer.push(['event', action, {
      event_category: category,
      event_label: label,
      value: value,
    }]);
  } else {
    console.log('[GA] No dataLayer or gtag available');
  }
};

// Helper function to track page views
export const trackPageView = (path: string, measurementId?: string) => {
  if (typeof window === 'undefined') return;

  console.log('[GA] trackPageView called:', path);

  const id = measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

  if (window.gtag) {
    console.log('[GA] Sending page view via gtag');
    window.gtag('config', id, {
      page_path: path,
    });
  } else if (window.dataLayer) {
    console.log('[GA] gtag not ready, queuing page view to dataLayer');
    window.dataLayer.push(['config', id, { page_path: path }]);
  } else {
    console.log('[GA] No dataLayer or gtag available for page view');
  }
};