'use client';

import { useEffect, useState } from 'react';

export function GADebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    const updateInfo = () => {
      const info = {
        measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        hasWindow: typeof window !== 'undefined',
        dataLayer: typeof window !== 'undefined' ? (window as any).dataLayer : null,
        dataLayerType: typeof window !== 'undefined' && (window as any).dataLayer ? typeof (window as any).dataLayer : null,
        gtag: typeof window !== 'undefined' ? typeof (window as any).gtag : null,
        gtagIsFunction: typeof window !== 'undefined' && typeof (window as any).gtag === 'function',
        scriptLoaded: typeof window !== 'undefined' && document.querySelector('script[src*="googletagmanager.com"]') !== null,
        scriptTags: typeof window !== 'undefined' ? Array.from(document.querySelectorAll('script')).filter(s => s.src.includes('googletagmanager')).map(s => ({ src: s.src, async: s.async })) : [],
        dataLayerContents: typeof window !== 'undefined' && (window as any).dataLayer ? (window as any).dataLayer.slice(0, 5) : null,
      };
      setDebugInfo(info);
    };

    updateInfo();
    const interval = setInterval(updateInfo, 500);
    return () => clearInterval(interval);
  }, []);

  const testGA = () => {
    if (typeof window === 'undefined') {
      setTestResult('Server-side - cannot test');
      return;
    }

    if (!window.gtag) {
      setTestResult('gtag not available');
      return;
    }

    console.log('[GA TEST] Sending test event...');
    window.gtag('event', 'test_event', {
      event_category: 'Test',
      event_label: 'GA Debug Test',
      value: 1,
    });
    setTestResult('Test event sent! Check browser Network tab for "collect" request');
  };

  if (!debugInfo) return null;

  const isReady = debugInfo.gtagIsFunction && debugInfo.dataLayer;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50 font-mono text-xs max-w-md border border-gray-700">
      <div className="font-bold mb-2 text-yellow-400">GA DEBUG</div>
      <div className="space-y-1 opacity-90">
        <div>Measurement ID: <span className={debugInfo.measurementId ? 'text-green-400' : 'text-red-400'}>{debugInfo.measurementId || 'MISSING!'}</span></div>
        <div>gtag function: <span className={debugInfo.gtagIsFunction ? 'text-green-400' : 'text-red-400'}>{debugInfo.gtagIsFunction ? 'READY' : 'MISSING'}</span></div>
        <div>dataLayer: <span className={debugInfo.dataLayer ? 'text-green-400' : 'text-red-400'}>{debugInfo.dataLayer ? 'EXISTS' : 'MISSING'}</span></div>
        <div>Script tag: <span className={debugInfo.scriptLoaded ? 'text-green-400' : 'text-red-400'}>{debugInfo.scriptLoaded ? 'LOADED' : 'MISSING'}</span></div>
        <div>Status: <span className={isReady ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{isReady ? 'READY' : 'NOT READY'}</span></div>

        {/* Additional debug info */}
        {debugInfo.dataLayerContents && (
          <div className="text-[10px] text-gray-400 mt-1">
            dataLayer[0-4]: {JSON.stringify(debugInfo.dataLayerContents)}
          </div>
        )}
        {debugInfo.scriptTags.length > 0 && (
          <div className="text-[10px] text-gray-400 mt-1">
            Scripts: {debugInfo.scriptTags.length} found
          </div>
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-700">
        <button
          onClick={testGA}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-2 rounded transition mb-1"
        >
          Test GA Event
        </button>
        {testResult && (
          <div className="text-[10px] text-gray-300 mt-1 italic">{testResult}</div>
        )}
      </div>
      <div className="mt-2 text-[10px] text-gray-400">
        Check browser console for [GA] logs and Network tab for collect requests
      </div>
    </div>
  );
}