'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAnalytics } from '@/hooks/useAnalytics';

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { trackPageView } = useAnalytics();
  const trackedPath = useRef<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Construct the full URL with search params
    const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    // Only track if path has changed
    if (trackedPath.current !== currentPath) {
      trackedPath.current = currentPath;
      trackPageView(currentPath);
    }
  }, [pathname, searchParams, trackPageView, isMounted]);

  return null;
}
