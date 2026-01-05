import { comparePricing, searchModels } from '@/lib/pricing';
import { ComparisonView } from '@/components/ComparisonView';
import { SearchBar } from '@/components/SearchBar';
import { SubmitButton } from '@/components/SubmitButton';
import { CostCalculator } from '@/components/CostCalculator';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: query = '' } = await searchParams;

  let data;
  let isSearch = false;
  let allModels: any[] = [];

  try {
    if (query) {
      const results = searchModels(query);
      data = { all_models: results };
      allModels = results;
      isSearch = true;
    } else {
      data = comparePricing();
      allModels = data.all_models;
    }
  } catch (error) {
    // Database might not be seeded yet
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              🎯 LLM PriceCheck
            </h1>
            <p className="text-gray-600 text-lg">
              Find the best LLM pricing instantly
            </p>
          </header>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Database Not Seeded</h2>
            <p className="text-gray-600 mb-6">
              Run <code className="bg-gray-100 px-2 py-1 rounded">npm run db:seed</code> to populate initial data
            </p>
            <a
              href="/submit"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Or Submit Pricing Manually
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                💎
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  LLM PriceCheck
                </h1>
                <p className="text-xs text-gray-600">Smart pricing comparison</p>
              </div>
            </div>

            <div className="flex gap-2">
              <SubmitButton />
              <a
                href="/submit"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Submit Pricing
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search */}
        <SearchBar initialQuery={query} />

        {/* Cost Calculator */}
        <CostCalculator models={allModels} />

        {/* Comparison View */}
        <ComparisonView data={data} isSearch={isSearch} query={query} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>Prices updated daily • Always show better alternatives • Never hide providers</p>
          <p className="mt-2 text-xs text-gray-500">
            Built for Sumeet • Beta v0.1
          </p>
        </div>
      </footer>
    </div>
  );
}
