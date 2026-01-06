'use client';

import { useEffect } from 'react';
import Script from 'next/script';

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

    console.log('[GA] Initialized with ID:', measurementId);
  }, [measurementId]);

  if (!measurementId) {
    console.log('[GA] No measurement ID provided, skipping GA initialization');
    return null;
  }

  return (
    <>
      {/* Load gtag.js script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('[GA] Script loaded successfully');
          // Queue initial config after script loads
          if (window.gtag) {
            window.gtag('js', new Date());
            window.gtag('config', measurementId, {
              page_path: window.location.pathname,
              send_page_view: true,
            });
            console.log('[GA] Config sent:', measurementId);
          }
        }}
        onError={(e) => {
          console.error('[GA] Script failed to load:', e);
        }}
      />
    </>
  );
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