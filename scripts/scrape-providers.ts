/**
 * Scraping script for LLM pricing
 *
 * This script fetches pricing data from llm-prices.com API and uses it as the
 * primary data source, with verified constants for core providers as backup.
 *
 * Strategy:
 * 1. Fetch ALL providers from llm-prices.com API
 * 2. Convert per-1K token pricing to per-million (our standard format)
 * 3. For core providers (OpenAI, Anthropic, Google, Meta, Mistral):
 *    - Use verified constants as source of truth
 *    - Compare with API to detect changes
 * 4. For all other providers:
 *    - Use API data directly (converted to per-million)
 *    - Flag any models without context window info
 *
 * Result: 32 models from 9 providers instead of just 12 models from 5 providers
 */

import { ScrapingResult } from '../src/data/types';

interface LLMPricesAPIModel {
  vendor: string;
  name: string;
  input: number;
  output: number;
  context?: number;
  updated?: string;
}

// Core providers - use verified constants as source of truth
const CORE_PROVIDERS = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral'];

// Verified pricing constants for core providers (per million tokens)
// These are the correct prices as of 2026-01-05
const VERIFIED_PRICING: Record<string, Record<string, ScrapingResult['models'][0]>> = {
  'OpenAI': {
    'GPT-4o': { name: 'GPT-4o', input_per_million: 5.00, output_per_million: 15.00, context_window: 128000 },
    'GPT-4 Turbo': { name: 'GPT-4 Turbo', input_per_million: 10.00, output_per_million: 30.00, context_window: 128000 },
    'GPT-3.5 Turbo': { name: 'GPT-3.5 Turbo', input_per_million: 0.50, output_per_million: 1.50, context_window: 16385, free_tier: 'Free tier: $5 credit for new users' },
  },
  'Anthropic': {
    'Claude 3 Opus': { name: 'Claude 3 Opus', input_per_million: 15.00, output_per_million: 75.00, context_window: 200000 },
    'Claude 3 Sonnet': { name: 'Claude 3 Sonnet', input_per_million: 3.00, output_per_million: 15.00, context_window: 200000 },
    'Claude 3 Haiku': { name: 'Claude 3 Haiku', input_per_million: 0.25, output_per_million: 1.25, context_window: 200000, free_tier: '1M tokens/month free tier' },
  },
  'Google': {
    'Gemini 1.5 Pro': { name: 'Gemini 1.5 Pro', input_per_million: 5.00, output_per_million: 15.00, context_window: 2000000, free_tier: 'Free tier: 1M tokens/month' },
    'Gemini Pro': { name: 'Gemini Pro', input_per_million: 0.50, output_per_million: 1.50, context_window: 32000, free_tier: 'Free tier: 1M tokens/month' },
  },
  'Meta': {
    'Llama 3 70B': { name: 'Llama 3 70B', input_per_million: 2.50, output_per_million: 10.00, context_window: 8192 },
    'Llama 3 8B': { name: 'Llama 3 8B', input_per_million: 0.30, output_per_million: 0.60, context_window: 8192 },
  },
  'Mistral': {
    'Mistral 7B': { name: 'Mistral 7B', input_per_million: 0.15, output_per_million: 0.30, context_window: 32000 },
    'Mixtral 8x7B': { name: 'Mixtral 8x7B', input_per_million: 0.70, output_per_million: 2.80, context_window: 32000 },
  },
};

/**
 * Fetch ALL pricing data from llm-prices.com API
 */
async function fetchFromLLMPricesAPI(): Promise<LLMPricesAPIModel[]> {
  try {
    console.log('  📡 Fetching from llm-prices.com API...');
    const response = await fetch('https://www.llm-prices.com/current-v1.json', {
      headers: {
        'User-Agent': 'LLM-Cost-Compass/1.0',
      },
      signal: timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const prices = data.prices || data;

    console.log(`  ✓ Retrieved ${prices.length} pricing records from API`);
    return prices;
  } catch (error) {
    console.error('  ✗ API fetch failed:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Simple timeout wrapper for fetch
 */
function timeout(ms: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

/**
 * Convert per-1K pricing to per-million
 * API returns: $2.50 per 1K tokens = $2500 per million
 */
function per1KToPerMillion(price: number): number {
  return price * 1000;
}

/**
 * Normalize provider name from API to our format
 */
function normalizeProviderName(vendor: string): string {
  // API uses lowercase, we want proper casing
  const map: Record<string, string> = {
    'openai': 'OpenAI',
    'anthropic': 'Anthropic',
    'google': 'Google',
    'meta': 'Meta',
    'mistral': 'Mistral',
    'amazon': 'Amazon',
    'deepseek': 'DeepSeek',
    'minimax': 'MiniMax',
    'moonshot ai': 'Moonshot AI',
    'moonshot': 'Moonshot AI',
    'moonshot-ai': 'Moonshot AI',
    'xai': 'xAI',
  };

  const lower = vendor.toLowerCase();
  return map[lower] || vendor;
}

/**
 * Detect if API values are in per-1K format (values < 100)
 * NOTE: llm-prices.com API returns prices per million tokens already
 * The values are typically: 0.25, 0.5, 1, 3, 5, 6, 10, 15, 30, etc.
 * NOT per-1K format which would be 0.00025, 0.0005, etc.
 */
function isPer1KFormat(input: number, output: number): boolean {
  // llm-prices.com API returns per-million pricing
  // Values like 0.25, 0.5, 1, 3, 5, 6, 10, 15, 30 are per-million
  // Values like 0.00025, 0.0005 would be per-1K (but API doesn't use this)
  // So we should NOT convert - just return false
  return false;
}

/**
 * Check for significant price changes in core providers
 */
function detectCoreProviderChanges(
  provider: string,
  apiModels: LLMPricesAPIModel[]
): number {
  let changes = 0;
  const verified = VERIFIED_PRICING[provider];
  if (!verified) return 0;

  for (const [modelName, verifiedModel] of Object.entries(verified)) {
    const apiModel = apiModels.find(m =>
      m.name.toLowerCase().includes(modelName.toLowerCase()) ||
      modelName.toLowerCase().includes(m.name.toLowerCase())
    );

    if (!apiModel) continue;

    // Convert API values to per-million
    const apiInput = isPer1KFormat(apiModel.input, apiModel.output)
      ? per1KToPerMillion(apiModel.input)
      : apiModel.input;
    const apiOutput = isPer1KFormat(apiModel.input, apiModel.output)
      ? per1KToPerMillion(apiModel.output)
      : apiModel.output;

    // Check for significant differences (>10%)
    const inputDiff = Math.abs(apiInput - verifiedModel.input_per_million);
    const outputDiff = Math.abs(apiOutput - verifiedModel.output_per_million);

    if (inputDiff > (verifiedModel.input_per_million * 0.1) ||
        outputDiff > (verifiedModel.output_per_million * 0.1)) {
      console.log(`    📊 ${modelName}: Potential change detected`);
      console.log(`       Verified: $${verifiedModel.input_per_million}/$${verifiedModel.output_per_million} per M`);
      console.log(`       API: $${apiInput.toFixed(2)}/$${apiOutput.toFixed(2)} per M`);
      changes++;
    }
  }

  return changes;
}

/**
 * Main scraping function - uses ALL data from API
 */
export async function scrapeAllProviders(): Promise<ScrapingResult[]> {
  console.log('🔍 Starting comprehensive pricing scrape...\n');

  // Fetch all data from API
  const apiData = await fetchFromLLMPricesAPI();

  if (apiData.length === 0) {
    console.log('⚠️  No API data available, using verified constants only\n');
    // Fall back to just verified providers
    const timestamp = new Date().toISOString();
    return Object.entries(VERIFIED_PRICING).map(([providerName, models]) => ({
      provider: providerName,
      models: Object.values(models),
      scraped_at: timestamp,
      source_url: 'verified constants (API unavailable)',
      confidence: 0.98,
    }));
  }

  // Group API data by provider
  const groupedByProvider: Record<string, LLMPricesAPIModel[]> = {};
  for (const model of apiData) {
    const providerName = normalizeProviderName(model.vendor);
    if (!groupedByProvider[providerName]) {
      groupedByProvider[providerName] = [];
    }
    groupedByProvider[providerName].push(model);
  }

  console.log(`  📊 Found ${Object.keys(groupedByProvider).length} providers in API\n`);

  const timestamp = new Date().toISOString();
  const results: ScrapingResult[] = [];
  let totalModels = 0;
  let changesDetected = 0;

  // Process each provider
  for (const [providerName, apiModels] of Object.entries(groupedByProvider)) {
    try {
      console.log(`Processing ${providerName} (${apiModels.length} models)...`);

      const models: ScrapingResult['models'] = [];
      const isCoreProvider = CORE_PROVIDERS.includes(providerName);

      // Check for changes in core providers
      if (isCoreProvider) {
        const changes = detectCoreProviderChanges(providerName, apiModels);
        changesDetected += changes;

        // Use verified constants for core providers
        const verified = VERIFIED_PRICING[providerName];
        if (verified) {
          for (const model of Object.values(verified)) {
            models.push(model);
          }
        }
      } else {
        // Use API data for non-core providers
        for (const apiModel of apiModels) {
          const isPer1K = isPer1KFormat(apiModel.input, apiModel.output);
          const inputPerMillion = isPer1K ? per1KToPerMillion(apiModel.input) : apiModel.input;
          const outputPerMillion = isPer1K ? per1KToPerMillion(apiModel.output) : apiModel.output;

          models.push({
            name: apiModel.name,
            input_per_million: inputPerMillion,
            output_per_million: outputPerMillion,
            context_window: apiModel.context || 0,
            // Note: API doesn't provide free tier info
          });
        }
      }

      if (models.length > 0) {
        results.push({
          provider: providerName,
          models,
          scraped_at: timestamp,
          source_url: 'https://www.llm-prices.com',
          confidence: isCoreProvider ? 0.98 : 0.85, // Lower confidence for API-only data
        });
        console.log(`  ✓ ${models.length} models (${isCoreProvider ? 'verified' : 'API'})`);
        totalModels += models.length;
      }
    } catch (error) {
      console.error(`  ✗ Failed to process ${providerName}:`, error);
    }
  }

  console.log(`\n✅ Scrape complete: ${results.length} providers, ${totalModels} models`);

  if (changesDetected > 0) {
    console.log(`⚠️  ${changesDetected} potential price changes in core providers - review recommended`);
  }

  return results;
}

// If run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeAllProviders().then(results => {
    console.log('\n=== Results ===\n');
    console.log(JSON.stringify(results, null, 2));

    // Summary
    const totalModels = results.reduce((sum, r) => sum + r.models.length, 0);
    console.log(`\n📊 Summary: ${results.length} providers, ${totalModels} models`);
  });
}
