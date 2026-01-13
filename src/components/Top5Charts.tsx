'use client';

import type { FlatModel } from '@/data/types';

interface Top5ChartsProps {
  price: FlatModel[];
  speed: FlatModel[];
  benchScore: FlatModel[];
}

export function Top5Charts({ price, speed, benchScore }: Top5ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
            <div className="space-y-2">
              {price.map((model, idx) => (
                <div
                  key={model.model + idx}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-sm w-5 text-center ${
                      idx === 0 ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {model.model}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {model.provider}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600 dark:text-green-400 text-sm">
                      ${model.total_cost.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      /M tokens
                    </div>
                  </div>
                </div>
              ))}
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
            <div className="space-y-2">
              {speed.map((model, idx) => (
                <div
                  key={model.model + idx}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-sm w-5 text-center ${
                      idx === 0 ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {model.model}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {model.provider}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                      {model.speed}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      tokens/sec
                    </div>
                  </div>
                </div>
              ))}
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
            <div className="space-y-2">
              {benchScore.map((model, idx) => (
                <div
                  key={model.model + idx}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-sm w-5 text-center ${
                      idx === 0 ? 'text-purple-600' : 'text-gray-500'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {model.model}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {model.provider}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-purple-600 dark:text-purple-400 text-sm">
                      {model.sde_bench_score}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      score
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}