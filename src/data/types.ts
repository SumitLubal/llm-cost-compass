export interface ModelPricing {
  name: string;
  input_per_million: number;
  output_per_million: number;
  context_window: number;
  free_tier: string | null;
  last_updated: string;
}

export interface ProviderData {
  id: string;
  name: string;
  models: ModelPricing[];
}

export interface PricingData {
  providers: ProviderData[];
  metadata: {
    last_updated: string;
    source: 'manual' | 'scraped' | 'user_submission';
    total_models: number;
  };
}

export interface FlatModel extends ModelPricing {
  provider: string;
  provider_id: string;
  model: string;
  score: number;
  total_cost: number;
}

export interface PriceChange {
  provider: string;
  model: string;
  field: 'input_per_million' | 'output_per_million';
  old_value: number;
  new_value: number;
  change_percent: number;
  confidence: number;
  source: string;
}

export interface ScrapingResult {
  provider: string;
  models: {
    name: string;
    input_per_million: number;
    output_per_million: number;
    context_window?: number;
    free_tier?: string;
  }[];
  scraped_at: string;
  source_url: string;
  confidence: number;
}
