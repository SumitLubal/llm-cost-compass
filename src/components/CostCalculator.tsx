'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { FlatModel } from '@/data/types';
import { useAnalytics } from '@/hooks/useAnalytics';

interface CostCalculatorProps {
  models: FlatModel[];
}

type SortField = 'provider' | 'model' | 'input_cost' | 'output_cost' | 'total_cost';
type SortDirection = 'asc' | 'desc';

export function CostCalculator({ models }: CostCalculatorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize state from URL params or defaults
  const [inputTokens, setInputTokens] = useState<number>(() => {
    const param = searchParams.get('input');
    return param ? Math.max(0, parseInt(param)) : 100000;
  });
  const [outputTokens, setOutputTokens] = useState<number>(() => {
    const param = searchParams.get('output');
    return param ? Math.max(0, parseInt(param)) : 50000;
  });
  // Auto-show results if params exist in URL
  const [showResults, setShowResults] = useState<boolean>(() => {
    return searchParams.has('input') && searchParams.has('output');
  });
  const [sortField, setSortField] = useState<SortField>('total_cost');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const { trackCalculator, trackSort } = useAnalytics();

  // Track if user has modified values (to avoid updating URL on initial load)
  // If we loaded from URL, we consider it "modified" so effects run correctly if needed,
  // but we mostly want to respect the user's intent.
  const [hasUserModified, setHasUserModified] = useState(false);

  // Sync state to URL when tokens change (only after user interaction)
  useEffect(() => {
    if (!hasUserModified && !showResults) return;

    const params = new URLSearchParams(searchParams.toString());

    if (showResults && inputTokens >= 0) {
      params.set('input', inputTokens.toString());
    } else {
      params.delete('input');
    }

    if (showResults && outputTokens >= 0) {
      params.set('output', outputTokens.toString());
    } else {
      params.delete('output');
    }

    // Only update if URL actually changed
    const currentParams = searchParams.toString();
    const newParams = params.toString();

    if (currentParams !== newParams) {
      const newURL = `${pathname}?${params.toString()}`;
      router.replace(newURL, { scroll: false });
    }
  }, [inputTokens, outputTokens, showResults, hasUserModified]);

  // Sync URL to state when URL changes externally
  useEffect(() => {
    const inputParam = searchParams.get('input');
    const outputParam = searchParams.get('output');

    if (inputParam && outputParam) {
      setShowResults(true);
    }

    if (inputParam !== null) {
      const newInput = Math.max(0, parseInt(inputParam));
      if (!isNaN(newInput) && newInput !== inputTokens) {
        setInputTokens(newInput);
      }
    }

    if (outputParam !== null) {
      const newOutput = Math.max(0, parseInt(outputParam));
      if (!isNaN(newOutput) && newOutput !== outputTokens) {
        setOutputTokens(newOutput);
      }
    }
  }, [searchParams]);

  const calculateCost = (model: FlatModel) => {
    const inputCost = (inputTokens / 1000000) * model.input_per_million;
    const outputCost = (outputTokens / 1000000) * model.output_per_million;
    return { inputCost, outputCost, total: inputCost + outputCost };
  };

  const handleCalculate = () => {
    console.log('[GA DEBUG] Calculate button clicked');
    if (inputTokens >= 0 && outputTokens >= 0) {
      setShowResults(true);
      setHasUserModified(true);
      // Track calculator usage
      trackCalculator(inputTokens, outputTokens, models.length);
      setCurrentPage(1);
    }
  };

  const handleHideResults = () => {
    setShowResults(false);
    setHasUserModified(true);
    // Clear params effectively
    const params = new URLSearchParams(searchParams.toString());
    params.delete('input');
    params.delete('output');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };


  const handleInputChange = (type: 'input' | 'output', value: number) => {
    setHasUserModified(true);
    if (type === 'input') {
      setInputTokens(value);
    } else {
      setOutputTokens(value);
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
    setCurrentPage(1);
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
      <span className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        {label}
        <span className="text-xs opacity-50">{getSortIcon(field)}</span>
      </span>
    </th>
  );

  const sortedData = showResults ? getSortedModels() : [];

  // Pagination Logic
  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = itemsPerPage === -1
    ? sortedData
    : sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-200 dark:border-gray-700">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white">
        <h2 className="text-xl font-bold">💰 Cost Calculator</h2>
        <p className="text-sm text-purple-100">Estimate your monthly bill across all models</p>
      </div>

      <div className="p-6">
        {/* Quick Presets - At the top for easy access */}
        <div className="mb-6 space-y-4">
          {/* Usage Presets - Using 130:1 input:output ratio based on real usage */}
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Usage Presets:</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setHasUserModified(true); setInputTokens(1300000); setOutputTokens(10000); }}
                className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 rounded-lg text-sm hover:from-green-200 hover:to-emerald-200 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50 border border-green-200 dark:border-green-800"
              >
                🌱 1 Day of Coding
              </button>
              <button
                onClick={() => { setHasUserModified(true); setInputTokens(13000000); setOutputTokens(100000); }}
                className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm hover:from-blue-200 hover:to-cyan-200 dark:hover:from-blue-900/50 dark:hover:to-cyan-900/50 border border-blue-200 dark:border-blue-800"
              >
                📅 1 Month of Coding
              </button>
              <button
                onClick={() => { setHasUserModified(true); setInputTokens(65000000); setOutputTokens(500000); }}
                className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-300 rounded-lg text-sm hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 border border-purple-200 dark:border-purple-800"
              >
                🌐 Building WebApp
              </button>
              <button
                onClick={() => { setHasUserModified(true); setInputTokens(260000000); setOutputTokens(2000000); }}
                className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-300 rounded-lg text-sm hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-900/50 dark:hover:to-orange-900/50 border border-amber-200 dark:border-amber-800"
              >
                🚀 Production Scale
              </button>
            </div>
          </div>

          {/* Token Presets */}
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Token Presets:</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setHasUserModified(true); setInputTokens(1300000); setOutputTokens(10000); }}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                1.3M/10K
              </button>
              <button
                onClick={() => { setHasUserModified(true); setInputTokens(13000000); setOutputTokens(100000); }}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                13M/100K
              </button>
              <button
                onClick={() => { setHasUserModified(true); setInputTokens(65000000); setOutputTokens(500000); }}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                65M/500K
              </button>
              <button
                onClick={() => { setHasUserModified(true); setInputTokens(130000000); setOutputTokens(1000000); }}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                130M/1M
              </button>
              <button
                onClick={() => {
                  // Copy shareable URL to clipboard
                  if (typeof window !== 'undefined') {
                    const url = `${window.location.origin}${pathname}?input=${inputTokens}&output=${outputTokens}`;
                    navigator.clipboard.writeText(url).then(() => {
                      alert('Shareable URL copied to clipboard!');
                    });
                  }
                }}
                className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50"
              >
                📋 Copy Share URL
              </button>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Input Tokens (per month)
            </label>
            <input
              type="number"
              value={inputTokens}
              onChange={(e) => handleInputChange('input', Number(e.target.value))}
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
              onChange={(e) => handleInputChange('output', Number(e.target.value))}
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
                  {paginatedData.map(({ model, costs }, idx) => {
                    // Global index for cheapest calculation
                    const globalIndex = (currentPage - 1) * (itemsPerPage === -1 ? 0 : itemsPerPage) + idx;

                    // Only show CHEAPEST badge when sorting by total_cost in ascending order
                    const isCheapest = sortField === 'total_cost' && sortDirection === 'asc' && globalIndex === 0;

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

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-gray-200 dark:border-gray-700">

              {/* Items per page Selector */}
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span>Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={-1}>All</option>
                </select>
                <span>results</span>
              </div>

              {/* Page Numbers */}
              {itemsPerPage !== -1 && totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Prev
                  </button>

                  {getPageNumbers().map((page, i) => (
                    typeof page === 'number' ? (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded flex items-center justify-center text-sm ${currentPage === page
                            ? 'bg-purple-600 text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={i} className="px-1 text-gray-500">...</span>
                    )
                  ))}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Results Count */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {itemsPerPage === -1 ? 1 : (currentPage - 1) * itemsPerPage + 1} to {itemsPerPage === -1 ? sortedData.length : Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length}
              </div>
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
              onClick={handleHideResults}
              className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition mt-4"
            >
              Hide Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
