'use client';

import { useState } from 'react';
import { ModelPricing } from '@/lib/pricing';

interface CostCalculatorProps {
  models: ModelPricing[];
}

export function CostCalculator({ models }: CostCalculatorProps) {
  const [inputTokens, setInputTokens] = useState<number>(100000); // 100K
  const [outputTokens, setOutputTokens] = useState<number>(50000); // 50K
  const [showResults, setShowResults] = useState<boolean>(false);

  const calculateCost = (model: ModelPricing) => {
    const inputCost = (inputTokens / 1000000) * model.input_per_million;
    const outputCost = (outputTokens / 1000000) * model.output_per_million;
    return inputCost + outputCost;
  };

  const sortedModels = [...models].sort((a, b) =>
    calculateCost(a) - calculateCost(b)
  );

  const handleCalculate = () => {
    if (inputTokens >= 0 && outputTokens >= 0) {
      setShowResults(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white">
        <h2 className="text-xl font-bold">💰 Cost Calculator</h2>
        <p className="text-sm text-purple-100">Estimate your monthly bill across all models</p>
      </div>

      <div className="p-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Tokens (per month)
            </label>
            <input
              type="number"
              value={inputTokens}
              onChange={(e) => setInputTokens(Number(e.target.value))}
              placeholder="e.g., 100000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 font-medium"
            />
            <p className="text-xs text-gray-500 mt-1">
              ~{(inputTokens / 1000).toLocaleString()}K tokens
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Tokens (per month)
            </label>
            <input
              type="number"
              value={outputTokens}
              onChange={(e) => setOutputTokens(Number(e.target.value))}
              placeholder="e.g., 50000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 font-medium"
            />
            <p className="text-xs text-gray-500 mt-1">
              ~{(outputTokens / 1000).toLocaleString()}K tokens
            </p>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition mb-6"
        >
          Calculate Costs
        </button>

        {/* Results Section */}
        {showResults && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">Your Usage:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Input:</span>{' '}
                  <span className="font-mono font-bold text-gray-900">
                    {inputTokens.toLocaleString()} tokens
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Output:</span>{' '}
                  <span className="font-mono font-bold text-gray-900">
                    {outputTokens.toLocaleString()} tokens
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Total:</span>{' '}
                  <span className="font-mono font-bold text-gray-900">
                    {(inputTokens + outputTokens).toLocaleString()} tokens
                  </span>
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 text-lg">Estimated Monthly Costs:</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Provider</th>
                    <th className="px-4 py-2 text-left">Model</th>
                    <th className="px-4 py-2 text-right">Input</th>
                    <th className="px-4 py-2 text-right">Output</th>
                    <th className="px-4 py-2 text-right font-bold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedModels.map((model, idx) => {
                    const inputCost = (inputTokens / 1000000) * model.input_per_million;
                    const outputCost = (outputTokens / 1000000) * model.output_per_million;
                    const total = inputCost + outputCost;
                    const isCheapest = idx === 0;

                    return (
                      <tr
                        key={idx}
                        className={isCheapest ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'}
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {model.provider}
                          {isCheapest && <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded">CHEAPEST</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{model.model}</td>
                        <td className="px-4 py-3 text-right text-gray-600">${inputCost.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-gray-600">${outputCost.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">
                          {total === 0 ? 'FREE' : `$${total.toFixed(2)}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg p-4">
                <div className="text-xs opacity-90">Cheapest Option</div>
                <div className="font-bold text-lg mt-1">{sortedModels[0].provider}</div>
                <div className="text-sm opacity-90">{sortedModels[0].model}</div>
                <div className="text-2xl font-bold mt-2">
                  ${calculateCost(sortedModels[0]).toFixed(2)}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg p-4">
                <div className="text-xs opacity-90">Best Value (score)</div>
                <div className="font-bold text-lg mt-1">
                  {models.reduce((best, curr) =>
                    (curr.score || 0) > (best.score || 0) ? curr : best
                  ).provider}
                </div>
                <div className="text-sm opacity-90">
                  {models.reduce((best, curr) =>
                    (curr.score || 0) > (best.score || 0) ? curr : best
                  ).model}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg p-4">
                <div className="text-xs opacity-90">Your Total</div>
                <div className="text-3xl font-bold mt-2">
                  ${sortedModels.reduce((sum, m) => sum + calculateCost(m), 0).toFixed(2)}
                </div>
                <div className="text-xs opacity-90 mt-1">Sum of all providers</div>
              </div>
            </div>

            {/* Free Tier Alert */}
            {sortedModels.some(m => calculateCost(m) === 0) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🆓</div>
                  <div>
                    <div className="font-semibold text-green-900">Free Tier Available!</div>
                    <div className="text-sm text-green-700 mt-1">
                      Some providers offer free tiers that could cover your usage entirely.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowResults(false)}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition mt-4"
            >
              Hide Results
            </button>
          </div>
        )}

        {/* Quick Presets */}
        {!showResults && (
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Quick Presets:</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setInputTokens(100000); setOutputTokens(50000); }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
              >
                100K/50K
              </button>
              <button
                onClick={() => { setInputTokens(1000000); setOutputTokens(500000); }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
              >
                1M/500K
              </button>
              <button
                onClick={() => { setInputTokens(5000000); setOutputTokens(2000000); }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
              >
                5M/2M
              </button>
              <button
                onClick={() => { setInputTokens(10000000); setOutputTokens(5000000); }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
              >
                10M/5M
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}