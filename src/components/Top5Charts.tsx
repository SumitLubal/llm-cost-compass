'use client';

import { useState, useEffect, useRef } from 'react';
import type { FlatModel } from '@/data/types';

interface Top5ChartsProps {
  price: FlatModel[];
  speed: FlatModel[];
  benchScore: FlatModel[];
}

export function Top5Charts({ price, speed, benchScore }: Top5ChartsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Helper to get max value for bar scaling
  const getMaxValue = (data: FlatModel[], field: 'total_cost' | 'speed' | 'sde_bench_score') => {
    return Math.max(...data.map(m => m[field] || 0), 1);
  };

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
    >
      {/* Price Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 text-white">
          <h3 className="font-bold text-lg">💰 Top 5 Cheapest</h3>
          <p className="text-sm opacity-90">Lowest total cost per million tokens</p>
        </div>
        <div className="p-4">
          {price.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              No pricing data available
            </div>
          ) : (
            <div className="space-y-3">
              {price.map((model, idx) => {
                const maxVal = getMaxValue(price, 'total_cost');
                const barWidth = (model.total_cost / maxVal) * 100;
                return (
                  <div key={model.model + idx} className="group">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {idx + 1}. {model.model}
                      </span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        ${model.total_cost.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                      {model.provider}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out group-hover:from-green-600 group-hover:to-emerald-600 ${
                          isVisible ? 'w-full' : 'w-0'
                        }`}
                        style={{
                          width: isVisible ? `${barWidth}%` : '0%',
                          transitionDelay: `${idx * 60}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Speed Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-white">
          <h3 className="font-bold text-lg">⚡ Top 5 Fastest</h3>
          <p className="text-sm opacity-90">Highest tokens per second</p>
        </div>
        <div className="p-4">
          {speed.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              No speed data available
            </div>
          ) : (
            <div className="space-y-3">
              {speed.map((model, idx) => {
                const maxVal = getMaxValue(speed, 'speed');
                const barWidth = ((model.speed || 0) / maxVal) * 100;
                return (
                  <div key={model.model + idx} className="group">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {idx + 1}. {model.model}
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {model.speed}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                      {model.provider}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-700 ease-out group-hover:from-blue-600 group-hover:to-cyan-600 ${
                          isVisible ? 'w-full' : 'w-0'
                        }`}
                        style={{
                          width: isVisible ? `${barWidth}%` : '0%',
                          transitionDelay: `${100 + idx * 60}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bench Score Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-white">
          <h3 className="font-bold text-lg">📊 Top 5 Bench Scores</h3>
          <p className="text-sm opacity-90">Highest SWE-bench performance</p>
        </div>
        <div className="p-4">
          {benchScore.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              No benchmark data available
            </div>
          ) : (
            <div className="space-y-3">
              {benchScore.map((model, idx) => {
                const maxVal = getMaxValue(benchScore, 'sde_bench_score');
                const barWidth = ((model.sde_bench_score || 0) / maxVal) * 100;
                return (
                  <div key={model.model + idx} className="group">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {idx + 1}. {model.model}
                      </span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {model.sde_bench_score}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                      {model.provider}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-700 ease-out group-hover:from-purple-600 group-hover:to-pink-600 ${
                          isVisible ? 'w-full' : 'w-0'
                        }`}
                        style={{
                          width: isVisible ? `${barWidth}%` : '0%',
                          transitionDelay: `${200 + idx * 60}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}