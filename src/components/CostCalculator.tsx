'use client';

import { useState } from 'react';
import type { FlatModel } from '@/data/types';
import { useAnalytics } from '@/hooks/useAnalytics';

interface CostCalculatorProps {
  models: FlatModel[];
}

type SortField = 'provider' | 'model' | 'input_cost' | 'output_cost' | 'total_cost';
type SortDirection = 'asc' | 'desc';

export function CostCalculator({ models }: CostCalculatorProps) {
  const [inputTokens, setInputTokens] = useState<number>(100000); // 100K
  const [outputTokens, setOutputTokens] = useState<number>(50000); // 50K
  const [showResults, setShowResults] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>('total_cost');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const { trackCalculator, trackSort } = useAnalytics();

  const calculateCost = (model: FlatModel) => {
    const inputCost = (inputTokens / 1000000) * model.input_per_million;
    const outputCost = (outputTokens / 1000000) * model.output_per_million;
    return { inputCost, outputCost, total: inputCost + outputCost };
  };

  const handleCalculate = () => {
    console.log('[GA DEBUG] Calculate button clicked');
    if (inputTokens >= 0 && outputTokens >= 0) {
      setShowResults(true);
      // Track calculator usage
      trackCalculator(inputTokens, outputTokens, models.length);
    }
  };

  const handleSort = (field: SortField) => {
    let newDirection: SortDirection;
    if (sortField === field) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
    } else {
      setSortField(field);
      newDirection = 'asc';
      setSortDirection('asc');
    }
    // Track sort event
    trackSort(field, newDirection);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getSortedModels = () => {
    const modelsWithCosts = models.map(model => ({
      model,
      costs: calculateCost(model)
    }));

    return modelsWithCosts.sort((a, b) => {
      let aVal: string | number, bVal: string | number;

      switch (sortField) {
        case 'provider':
          aVal = a.model.provider.toLowerCase();
          bVal = b.model.provider.toLowerCase();
          break;
        case 'model':
          aVal = a.model.model.toLowerCase();
          bVal = b.model.model.toLowerCase();
          break;
        case 'input_cost':
          aVal = a.costs.inputCost;
          bVal = b.costs.inputCost;
          break;
        case 'output_cost':
          aVal = a.costs.outputCost;
          bVal = b.costs.outputCost;
          break;
        case 'total_cost':
          aVal = a.costs.total;
          bVal = b.costs.total;
          break;
        default:
          return 0;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      // At this point, both values are numbers
      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  };

  const SortableHeader = ({ field, label, align = 'left' }: { field: SortField; label: string; align?: 'left' | 'right' }) => (
    <th
      className={`px-4 py-2 text-${align} font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none`}
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1 justify-end">
        {label}
        <span className="text-xs opacity-50">{getSortIcon(field)}</span>
      </span>
    </th>
  );

  const sortedData = showResults ? getSortedModels() : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-200 dark:border-gray-700">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white">
        <h2 className="text-xl font-bold">💰 Cost Calculator</h2>
        <p className="text-sm text-purple-100">Estimate your monthly bill across all models</p>
      </div>

      <div className="p-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Input Tokens (per month)
            </label>
            <input
              type="number"
              value={inputTokens}
              onChange={(e) => setInputTokens(Number(e.target.value))}
              placeholder="e.g., 100000"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-gray-100 font-medium bg-white dark:bg-gray-700"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ~{(inputTokens / 1000).toLocaleString()}K tokens
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Output Tokens (per month)
            </label>
            <input
              type="number"
              value={outputTokens}
              onChange={(e) => setOutputTokens(Number(e.target.value))}
              placeholder="e.g., 50000"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-gray-100 font-medium bg-white dark:bg-gray-700"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Your Usage:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Input:</span>{' '}
                  <span className="font-mono font-bold text-gray-900 dark:text-gray-100">
                    {inputTokens.toLocaleString()} tokens
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Output:</span>{' '}
                  <span className="font-mono font-bold text-gray-900 dark:text-gray-100">
                    {outputTokens.toLocaleString()} tokens
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>{' '}
                  <span className="font-mono font-bold text-gray-900 dark:text-gray-100">
                    {(inputTokens + outputTokens).toLocaleString()} tokens
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Cards - Moved above the table */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg p-4">
                <div className="text-xs opacity-90">Cheapest Option</div>
                <div className="font-bold text-lg mt-1">
                  {sortedData.reduce((best, curr) =>
                    curr.costs.total < best.costs.total ? curr : best
                  , sortedData[0])?.model.provider}
                </div>
                <div className="text-sm opacity-90">
                  {sortedData.reduce((best, curr) =>
                    curr.costs.total < best.costs.total ? curr : best
                  , sortedData[0])?.model.model}
                </div>
                <div className="text-2xl font-bold mt-2">
                  ${sortedData.reduce((best, curr) =>
                    curr.costs.total < best.costs.total ? curr : best
                  , sortedData[0])?.costs.total.toFixed(2)}
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
                <div className="text-xs opacity-90">Latest Prices</div>
                <div className="text-sm mt-1 space-y-1">
                  {['OpenAI', 'Google', 'Anthropic'].map(provider => {
                    const model = models.find(m =>
                      m.provider.toLowerCase().includes(provider.toLowerCase())
                    );
                    if (!model) return null;
                    const cost = calculateCost(model);
                    return (
                      <div key={provider} className="flex justify-between text-xs">
                        <span className="opacity-80">{provider}:</span>
                        <span className="font-bold">${cost.total.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Estimated Monthly Costs:</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <tr>
                    <SortableHeader field="provider" label="Provider" />
                    <SortableHeader field="model" label="Model" />
                    <SortableHeader field="input_cost" label="Input ($)" align="right" />
                    <SortableHeader field="output_cost" label="Output ($)" align="right" />
                    <SortableHeader field="total_cost" label="Total ($)" align="right" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedData.map(({ model, costs }, idx) => {
                    // Only show CHEAPEST badge when sorting by total_cost in ascending order
                    const isCheapest = sortField === 'total_cost' && sortDirection === 'asc' && idx === 0;

                    return (
                      <tr
                        key={idx}
                        className={isCheapest
                          ? 'bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
                      >
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                          {model.provider}
                          {isCheapest && <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded">CHEAPEST</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{model.model}</td>
                        <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">${costs.inputCost.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">${costs.outputCost.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-gray-100">
                          {costs.total === 0 ? 'FREE' : `$${costs.total.toFixed(2)}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Free Tier Alert */}
            {sortedData.some(({ costs }) => costs.total === 0) && (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🆓</div>
                  <div>
                    <div className="font-semibold text-green-900 dark:text-green-100">Free Tier Available!</div>
                    <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Some providers offer free tiers that could cover your usage entirely.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowResults(false)}
              className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition mt-4"
            >
              Hide Results
            </button>
          </div>
        )}

        {/* Quick Presets */}
        {!showResults && (
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Presets:</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setInputTokens(100000); setOutputTokens(50000); }}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                100K/50K
              </button>
              <button
                onClick={() => { setInputTokens(1000000); setOutputTokens(500000); }}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                1M/500K
              </button>
              <button
                onClick={() => { setInputTokens(5000000); setOutputTokens(2000000); }}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                5M/2M
              </button>
              <button
                onClick={() => { setInputTokens(10000000); setOutputTokens(5000000); }}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
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
