import { comparePricing, searchModels } from '@/lib/pricing';
import { ComparisonView } from '@/components/ComparisonView';
import { SearchBar } from '@/components/SearchBar';
import { SubmitButton } from '@/components/SubmitButton';
import { CostCalculator } from '@/components/CostCalculator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PageViewTracker } from '@/components/PageViewTracker';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

// Generate dynamic metadata based on search query
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q: query = '' } = await searchParams;

  if (query) {
    const cleanQuery = query.trim();
    return {
      title: `Search Results for "${cleanQuery}" | LLM PriceCheck`,
      description: `Find LLM pricing for ${cleanQuery}. Compare costs across OpenAI, Anthropic, Google, xAI and more.`,
      alternates: {
        canonical: `https://llmpricecompare.com/?q=${encodeURIComponent(cleanQuery)}`,
      },
      openGraph: {
        title: `LLM Pricing for ${cleanQuery} - LLM PriceCheck`,
        description: `Compare ${cleanQuery} pricing and find cheaper alternatives.`,
        url: `https://llmpricecompare.com/?q=${encodeURIComponent(cleanQuery)}`,
        type: 'website',
      },
      twitter: {
        title: `LLM Pricing for ${cleanQuery}`,
        description: `Compare ${cleanQuery} pricing and find cheaper alternatives.`,
      },
    };
  }

  // Default metadata for home page
  return {
    title: "LLM PriceCheck - Compare LLM Pricing Across All Providers",
    description: "Compare LLM pricing across OpenAI, Anthropic, Google, xAI, and more. Real-time cost calculator, smart recommendations, and daily price updates.",
    alternates: {
      canonical: "https://llmpricecompare.com",
    },
  };
}

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
      <PageViewTracker />
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

        {/* SEO Content Section - Only show on home page (no search query) */}
        {!query && (
          <div className="mt-12 space-y-12">
            {/* What is LLM PriceCheck */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                What is LLM PriceCheck?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                LLM PriceCheck is a free tool that helps you compare pricing across all major large language model providers.
                We track real-time pricing from OpenAI, Anthropic, Google, xAI, Amazon, Meta, and more to help you find
                the most cost-effective AI models for your needs.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Our smart cost calculator estimates your monthly bill based on your expected token usage, and our value
                scoring system helps you find the best balance between price, performance, and features.
              </p>
            </section>

            {/* Supported Providers */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Supported LLM Providers
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We track pricing for all major AI model providers including:
              </p>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2"><span className="text-blue-600">•</span> OpenAI (GPT-4, GPT-4o)</li>
                <li className="flex items-center gap-2"><span className="text-blue-600">•</span> Anthropic (Claude 3)</li>
                <li className="flex items-center gap-2"><span className="text-blue-600">•</span> Google (Gemini)</li>
                <li className="flex items-center gap-2"><span className="text-blue-600">•</span> xAI (Grok)</li>
                <li className="flex items-center gap-2"><span className="text-blue-600">•</span> Amazon (Nova)</li>
                <li className="flex items-center gap-2"><span className="text-blue-600">•</span> Meta (Llama)</li>
                <li className="flex items-center gap-2"><span className="text-blue-600">•</span> DeepSeek</li>
                <li className="flex items-center gap-2"><span className="text-blue-600">•</span> And more...</li>
              </ul>
            </section>

            {/* How It Works */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                How to Use LLM PriceCheck
              </h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>Search for models</strong> - Enter any model name (e.g., "GPT-4", "Claude", "Grok")
                </li>
                <li>
                  <strong>Use the cost calculator</strong> - Input your monthly token usage to see estimated costs
                </li>
                <li>
                  <strong>Compare prices</strong> - Sort by input cost, output cost, or total cost
                </li>
                <li>
                  <strong>Find alternatives</strong> - Click any model to see better value options
                </li>
              </ol>
            </section>

            {/* FAQ Schema */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">How often is pricing updated?</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">Prices are updated daily through automated scraping and manual verification.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Is LLM PriceCheck free?</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">Yes! LLM PriceCheck is completely free to use with no registration required.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">How is the score calculated?</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">Score is based on cost (inverse relationship), context window size, and free tier availability. Higher is better.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Can I submit pricing data?</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">Yes! Use the "Submit Pricing" button to contribute new pricing information.</p>
                </div>
              </div>
            </section>

            {/* Keywords Section for SEO */}
            <section className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-purple-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Popular LLM Pricing Searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  'GPT-4 pricing',
                  'Claude 3 Opus cost',
                  'Gemini 1.5 Pro pricing',
                  'Grok 4 price',
                  'LLM cost calculator',
                  'cheapest AI model',
                  'OpenAI API pricing',
                  'Anthropic API cost',
                ].map((term) => (
                  <a
                    key={term}
                    href={`/?q=${encodeURIComponent(term.split(' ')[0])}`}
                    className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700 transition border border-gray-200 dark:border-gray-600"
                  >
                    {term}
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}
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
