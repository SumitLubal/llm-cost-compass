/**
 * Pricing utilities using JSON data (no database required)
 */

import rawPricingData from '@/data/pricing.json';
import { PricingData, FlatModel, ModelPricing } from '@/data/types';

// Type assertion to handle JSON import
const pricingData = rawPricingData as unknown as PricingData;

export interface ComparisonResult {
  best_overall: FlatModel;
  best_free?: FlatModel;
  best_value: FlatModel;
  hidden_gem: FlatModel;
  all_models: FlatModel[];
}

/**
 * Flatten the nested pricing data for easier manipulation
 */
function flattenModels(data: PricingData): FlatModel[] {
  const flattened: FlatModel[] = [];

  for (const provider of data.providers) {
    for (const model of provider.models) {
      const totalCost = model.input_per_million + model.output_per_million;
      const score = calculateScore(model);

      flattened.push({
        // From ModelPricing
        name: model.name,
        input_per_million: model.input_per_million,
        output_per_million: model.output_per_million,
        context_window: model.context_window,
        free_tier: model.free_tier,
        last_updated: model.last_updated,
        speed: model.speed,
        sde_bench_score: model.sde_bench_score,
        // Additional FlatModel properties
        provider: provider.name,
        provider_id: provider.id,
        model: model.name,
        total_cost: totalCost,
        score,
      });
    }
  }

  return flattened;
}

/**
 * Calculate a value score (higher is better)
 * Factors: low cost, high context, free tier bonus
 */
function calculateScore(model: any): number {
  const totalCost = model.input_per_million + model.output_per_million;

  // Base score: inverse of cost (lower cost = higher score)
  let score = 1000 / (totalCost + 1); // +1 to avoid division by zero

  // Context window bonus (higher is better)
  score += model.context_window / 10000;

  // Free tier bonus
  if (model.free_tier) {
    score += 100;
  }

  return Math.round(score);
}

/**
 * Get all models, optionally filtered by search query
 */
export function searchModels(query: string): FlatModel[] {
  const allModels = flattenModels(pricingData);

  if (!query || query.trim() === '') {
    return allModels;
  }

  const lowerQuery = query.toLowerCase();

  return allModels.filter(model =>
    model.provider.toLowerCase().includes(lowerQuery) ||
    model.model.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get smart comparison view with best options
 */
export function comparePricing(): ComparisonResult {
  const allModels = flattenModels(pricingData);

  // Best overall: highest score
  const bestOverall = allModels.reduce((best, current) =>
    (current.score || 0) > (best.score || 0) ? current : best
  );

  // Best free: free tier with lowest cost
  const freeModels = allModels.filter(m => m.free_tier);
  const bestFree = freeModels.length > 0
    ? freeModels.reduce((best, current) =>
        (current.total_cost || 0) < (best.total_cost || 0) ? current : best
      )
    : undefined;

  // Best value: best score-to-cost ratio
  const bestValue = allModels.reduce((best, current) => {
    const currentRatio = (current.score || 0) / (current.total_cost || 1);
    const bestRatio = (best.score || 0) / (best.total_cost || 1);
    return currentRatio > bestRatio ? current : best;
  });

  // Hidden gem: high score, low cost, not best overall
  const hiddenGems = allModels
    .filter(m => (m.score || 0) > 500 && (m.total_cost || 0) < 5 && m.model !== bestOverall.model)
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const hiddenGem = hiddenGems[0] || bestValue;

  return {
    best_overall: bestOverall,
    best_free: bestFree,
    best_value: bestValue,
    hidden_gem: hiddenGem,
    all_models: allModels,
  };
}

/**
 * Get all providers with their models
 */
export function getAllProviders() {
  return pricingData.providers;
}

/**
 * Get last update timestamp
 */
export function getLastUpdated(): string {
  return pricingData.metadata.last_updated;
}

/**
 * Get total model count
 */
export function getTotalModels(): number {
  return pricingData.metadata.total_models;
}

/**
 * Get top 5 models by price (lowest total cost)
 */
export function getTop5ByPrice(): FlatModel[] {
  const allModels = flattenModels(pricingData);
  return allModels
    .filter(m => m.total_cost > 0) // Exclude free tier for price comparison
    .sort((a, b) => a.total_cost - b.total_cost)
    .slice(0, 5);
}

/**
 * Get top 5 models by speed (highest tokens per second)
 */
export function getTop5BySpeed(): FlatModel[] {
  const allModels = flattenModels(pricingData);
  return allModels
    .filter(m => m.speed !== undefined)
    .sort((a, b) => (b.speed || 0) - (a.speed || 0))
    .slice(0, 5);
}

/**
 * Get top 5 models by SDE bench score (highest score)
 */
export function getTop5ByBenchScore(): FlatModel[] {
  const allModels = flattenModels(pricingData);
  return allModels
    .filter(m => m.sde_bench_score !== undefined)
    .sort((a, b) => (b.sde_bench_score || 0) - (a.sde_bench_score || 0))
    .slice(0, 5);
}

/**
 * Get all top 5 charts data in one call
 */
export function getTop5Charts() {
  return {
    price: getTop5ByPrice(),
    speed: getTop5BySpeed(),
    benchScore: getTop5ByBenchScore(),
  };
}
