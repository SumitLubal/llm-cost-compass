'use client';

import { ComparisonResult } from '@/lib/pricing';
import type { FlatModel } from '@/data/types';
import { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ComparisonViewProps {
  data: ComparisonResult | { all_models: FlatModel[] };
  isSearch: boolean;
  query: string;
}

type SortField = 'provider' | 'model' | 'input' | 'output' | 'total' | 'score';
type SortDirection = 'asc' | 'desc';

export function ComparisonView({ data, isSearch, query }: ComparisonViewProps) {
  if ('all_models' in data && data.all_models.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No results found</h3>
        <p className="text-gray-600 dark:text-gray-400">Try searching for "OpenAI", "Claude", or "Gemini"</p>
      </div>
    );
  }

  if (!isSearch && 'best_overall' in data) {
    // Show smart comparison view
    const { best_overall, best_free, best_value, hidden_gem, all_models } = data;

    return (
      <div className="space-y-8">
        {/* Smart Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SmartCard
            title="🏆 Best Overall"
            subtitle="Highest value score"
            model={best_overall}
            accent="from-purple-600 to-purple-800"
          />

          {best_free && (
            <SmartCard
              title="🆓 Best Free"
              subtitle="No cost option"
              model={best_free}
              accent="from-green-600 to-green-800"
            />
          )}

          <SmartCard
            title="💰 Best Value"
            subtitle="Quality vs cost"
            model={best_value}
            accent="from-blue-600 to-blue-800"
          />

          <SmartCard
            title="💎 Hidden Gem"
            subtitle="Underrated option"
            model={hidden_gem}
            accent="from-amber-600 to-amber-800"
          />
        </div>

        {/* Full Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All Models</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Click any model to see better alternatives</p>
          </div>
          <PricingTable models={all_models} />
        </div>
      </div>
    );
  }

  // Search results view
  const models = 'all_models' in data ? data.all_models : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 bg-blue-50 dark:bg-blue-950/30 border-b border-blue-200 dark:border-blue-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Search Results for "{query}"
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Found {models.length} models</p>
      </div>
      <PricingTable models={models} />
    </div>
  );
}

function SmartCard({ title, subtitle, model, accent }: {
  title: string;
  subtitle: string;
  model: FlatModel;
  accent: string;
}) {
  const totalCost = model.input_per_million + model.output_per_million;

  return (
    <div className={`bg-gradient-to-br ${accent} text-white rounded-2xl p-6 shadow-lg`}>
      <div className="text-sm font-medium opacity-90">{title}</div>
      <div className="text-xs opacity-75 mb-3">{subtitle}</div>
      <div className="font-bold text-lg mb-1">{model.provider}</div>
      <div className="text-sm opacity-90 mb-2">{model.model}</div>
      <div className="text-2xl font-bold mb-1">
        {totalCost === 0 ? 'FREE' : `$${totalCost.toFixed(2)}`}
      </div>
      {model.free_tier && (
        <div className="text-xs opacity-80">🎁 {model.free_tier}</div>
      )}
    </div>
  );
}

function PricingTable({ models }: { models: FlatModel[] }) {
  const [selectedModel, setSelectedModel] = useState<FlatModel | null>(null);
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const { trackSort } = useAnalytics();

  const handleRowClick = (model: FlatModel) => {
    alert(
      `Model: ${model.provider} ${model.model}\n` +
      `Price: $${(model.input_per_million + model.output_per_million).toFixed(2)} per 1M tokens\n\n` +
      `Better alternatives feature would show here!`
    );
  };

  const handleSort = (field: SortField) => {
    let newDirection: SortDirection;
    if (sortField === field) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
    } else {
      setSortField(field);
      newDirection = 'desc';
      setSortDirection('desc');
    }
    trackSort(field, newDirection);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const sortedModels = [...models].sort((a, b) => {
    let aVal: string | number, bVal: string | number;

    switch (sortField) {
      case 'provider':
        aVal = a.provider.toLowerCase();
        bVal = b.provider.toLowerCase();
        break;
      case 'model':
        aVal = a.model.toLowerCase();
        bVal = b.model.toLowerCase();
        break;
      case 'input':
        aVal = a.input_per_million;
        bVal = b.input_per_million;
        break;
      case 'output':
        aVal = a.output_per_million;
        bVal = b.output_per_million;
        break;
      case 'total':
        aVal = a.input_per_million + a.output_per_million;
        bVal = b.input_per_million + b.output_per_million;
        break;
      case 'score':
        aVal = a.score || 0;
        bVal = b.score || 0;
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

  const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      className="px-6 py-3 text-left font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        <span className="text-xs opacity-50">{getSortIcon(field)}</span>
      </span>
    </th>
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <SortableHeader field="provider" label="Provider" />
              <SortableHeader field="model" label="Model" />
              <SortableHeader field="input" label="Input ($/M)" />
              <SortableHeader field="output" label="Output ($/M)" />
              <SortableHeader field="total" label="Total ($)" />
              <SortableHeader field="score" label="Score" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedModels.map((model, idx) => {
              const total = model.input_per_million + model.output_per_million;
              const isFree = total === 0;

              return (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(model)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{model.provider}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{model.model}</td>
                  <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                    {model.input_per_million === 0 ? 'FREE' : `$${model.input_per_million.toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                    {model.output_per_million === 0 ? 'FREE' : `$${model.output_per_million.toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">
                    {isFree ? (
                      <span className="text-green-600 font-bold">FREE</span>
                    ) : (
                      `$${total.toFixed(2)}`
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium">
                      {model.score?.toFixed(0) || '-'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Simple modal for selected model */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{selectedModel.provider} {selectedModel.model}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Price: ${(selectedModel.input_per_million + selectedModel.output_per_million).toFixed(2)} per 1M tokens
            </p>
            <button
              onClick={() => setSelectedModel(null)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
