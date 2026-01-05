import { comparePricing, searchModels } from '@/lib/pricing-json';
import { ComparisonView } from '@/components/ComparisonView';
import { SearchBar } from '@/components/SearchBar';
import { SubmitButton } from '@/components/SubmitButton';
import { CostCalculator } from '@/components/CostCalculator';
import { ThemeToggle } from '@/components/ThemeToggle';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: query = '' } = await searchParams;

  let data;
  let isSearch = false;
  let allModels: any[] = [];

  if (query) {
    const results = searchModels(query);
    data = { all_models: results };
    allModels = results;
    isSearch = true;
  } else {
    data = comparePricing();
    allModels = data.all_models;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                💎
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  LLM PriceCheck
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Smart pricing comparison</p>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <ThemeToggle />
              <SubmitButton />
              <a
                href="/submit"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
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
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Prices updated daily • Always show better alternatives • Never hide providers</p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            Built for Sumeet • Beta v0.1
          </p>
        </div>
      </footer>
    </div>
  );
}
