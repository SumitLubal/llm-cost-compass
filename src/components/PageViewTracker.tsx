'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAnalytics } from '@/hooks/useAnalytics';

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { trackPageView } = useAnalytics();
  const trackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Construct the full URL with search params
    const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    // Only track if path has changed
    if (trackedPath.current !== currentPath) {
      trackedPath.current = currentPath;
      trackPageView(currentPath);
    }
  }, [pathname, searchParams, trackPageView]);

  return null;
}
