'use client';

import { ModelPricing, ComparisonResult } from '@/lib/pricing';
import { useState } from 'react';

interface ComparisonViewProps {
  data: ComparisonResult | { all_models: ModelPricing[] };
  isSearch: boolean;
  query: string;
}

export function ComparisonView({ data, isSearch, query }: ComparisonViewProps) {
  if ('all_models' in data && data.all_models.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600">Try searching for "OpenAI", "Claude", or "Gemini"</p>
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Models</h2>
            <p className="text-sm text-gray-600">Click any model to see better alternatives</p>
          </div>
          <PricingTable models={all_models} />
        </div>
      </div>
    );
  }

  // Search results view
  const models = 'all_models' in data ? data.all_models : [];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Search Results for "{query}"
        </h2>
        <p className="text-sm text-gray-600">Found {models.length} models</p>
      </div>
      <PricingTable models={models} />
    </div>
  );
}

function SmartCard({ title, subtitle, model, accent }: {
  title: string;
  subtitle: string;
  model: ModelPricing;
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

function PricingTable({ models }: { models: ModelPricing[] }) {
  const [selectedModel, setSelectedModel] = useState<ModelPricing | null>(null);

  const handleRowClick = (model: ModelPricing) => {
    // Show alternatives in a simple alert for now
    // In production, this would show a modal
    alert(
      `Model: ${model.provider} ${model.model}\n` +
      `Price: $${(model.input_per_million + model.output_per_million).toFixed(2)} per 1M tokens\n\n` +
      `Better alternatives feature would show here!`
    );
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Provider</th>
              <th className="px-6 py-3 text-left font-semibold">Model</th>
              <th className="px-6 py-3 text-right font-semibold">Input/M</th>
              <th className="px-6 py-3 text-right font-semibold">Output/M</th>
              <th className="px-6 py-3 text-right font-semibold">Total</th>
              <th className="px-6 py-3 text-right font-semibold">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {models.map((model, idx) => {
              const total = model.input_per_million + model.output_per_million;
              const isFree = total === 0;

              return (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(model)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{model.provider}</td>
                  <td className="px-6 py-4 text-gray-700">{model.model}</td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    {model.input_per_million === 0 ? 'FREE' : `$${model.input_per_million.toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
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
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
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
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">{selectedModel.provider} {selectedModel.model}</h3>
            <p className="text-gray-600 mb-4">
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