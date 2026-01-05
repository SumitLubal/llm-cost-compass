import { db } from './db';

export interface ModelPricing {
  provider: string;
  model: string;
  input_per_million: number;
  output_per_million: number;
  context_window: number;
  free_tier?: string;
  total_cost?: number; // For calculations
  score?: number; // Value score
}

export interface ComparisonResult {
  best_overall: ModelPricing;
  best_free: ModelPricing | null;
  best_value: ModelPricing;
  hidden_gem: ModelPricing;
  all_models: ModelPricing[];
}

// Calculate value score (higher is better)
function calculateScore(model: ModelPricing): number {
  const cost = model.input_per_million + model.output_per_million;
  if (cost === 0) return 100; // Free tier gets max score
  // Score based on inverse of cost, adjusted for context window
  const baseScore = 1000 / cost;
  const contextBonus = model.context_window / 100000; // Normalize to ~1
  return baseScore * (1 + contextBonus * 0.2); // 20% bonus for larger context
}

// Get all pricing data
export function getAllPricing(): ModelPricing[] {
  const stmt = db.prepare(`
    SELECT p.name as provider, pr.model_name as model, pr.input_per_million,
           pr.output_per_million, pr.context_window, pr.free_tier
    FROM pricing pr
    JOIN providers p ON pr.provider_id = p.id
    WHERE pr.scraped_at > datetime('now', '-30 days')
    ORDER BY p.name, pr.model_name
  `);

  const results = stmt.all() as ModelPricing[];
  return results.map(m => ({
    ...m,
    score: calculateScore(m)
  }));
}

// Find better/cheaper alternatives
export function findAlternatives(target: ModelPricing, all: ModelPricing[]): {
  cheaper: ModelPricing[];
  better: ModelPricing[];
  free: ModelPricing[];
} {
  const cheaper = all.filter(m =>
    m.provider !== target.provider &&
    (m.input_per_million + m.output_per_million) <
    (target.input_per_million + target.output_per_million)
  ).sort((a, b) =>
    (a.input_per_million + a.output_per_million) -
    (b.input_per_million + b.output_per_million)
  ).slice(0, 2);

  const better = all.filter(m =>
    m.provider !== target.provider &&
    m.score > target.score
  ).sort((a, b) => b.score - a.score).slice(0, 2);

  const free = all.filter(m => m.free_tier).slice(0, 2);

  return { cheaper, better, free };
}

// Main comparison function
export function comparePricing(): ComparisonResult {
  const all = getAllPricing();

  if (all.length === 0) {
    throw new Error('No pricing data available');
  }

  // Best overall (highest score)
  const best_overall = [...all].sort((a, b) => b.score - a.score)[0];

  // Best free tier
  const best_free = all.filter(m => m.free_tier).sort((a, b) => b.score - a.score)[0] || null;

  // Best value (best score among affordable options, say under $50 total)
  const affordable = all.filter(m =>
    (m.input_per_million + m.output_per_million) < 50
  );
  const best_value = affordable.length > 0
    ? affordable.sort((a, b) => b.score - a.score)[0]
    : best_overall;

  // Hidden gem (high score, low recognition)
  const hidden_gem = all
    .filter(m => m.provider.toLowerCase().includes('mistral') ||
                 m.provider.toLowerCase().includes('mixtral') ||
                 m.provider.toLowerCase().includes('meta') ||
                 m.provider.toLowerCase().includes('llama'))
    .sort((a, b) => b.score - a.score)[0] || best_value;

  return {
    best_overall,
    best_free,
    best_value,
    hidden_gem,
    all_models: all
  };
}

// Calculate cost for specific task
export function calculateTaskCost(
  tokens: number,
  model: ModelPricing,
  taskType: 'input' | 'output' | 'mixed' = 'mixed'
): number {
  const inputCost = (tokens / 1000000) * model.input_per_million;
  const outputCost = (tokens / 1000000) * model.output_per_million;

  switch(taskType) {
    case 'input':
      return inputCost;
    case 'output':
      return outputCost;
    case 'mixed':
      return (inputCost + outputCost) / 2;
  }
}

// Search models by provider or name
export function searchModels(query: string): ModelPricing[] {
  const all = getAllPricing();
  const lowerQuery = query.toLowerCase();

  return all.filter(m =>
    m.provider.toLowerCase().includes(lowerQuery) ||
    m.model.toLowerCase().includes(lowerQuery)
  );
}