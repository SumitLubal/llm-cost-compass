/**
 * LLM-based Pricing Extractor
 *
 * This script uses an LLM to extract pricing information from documentation URLs.
 * It fetches web content and uses structured output to extract model pricing data.
 *
 * Usage:
 *   npx tsx scripts/llm-extract.ts "https://docs.x.ai/docs/models/grok-4-1-fast-reasoning"
 *   npx tsx scripts/llm-extract.ts "https://docs.x.ai/docs/models" --provider xAI
 *
 * Environment Variables Required:
 *   - EXTRACTION_API_KEY: API key for the LLM service
 *   - EXTRACTION_BASE_URL: Base URL for the API (e.g., https://api.openai.com/v1)
 *   - EXTRACTION_MODEL: Model name to use (e.g., gpt-4-turbo, mimo-v2-flash)
 */

import { ScrapingResult } from '../src/data/types';
import * as fs from 'fs';
import * as path from 'path';

// Load .env file if it exists
const envPath = path.join(process.cwd(), '.env');
const envLocalPath = path.join(process.cwd(), '.env.local');

const loadEnv = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    const envContent = fs.readFileSync(filePath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        // Remove quotes if present
        const cleanValue = value.trim().replace(/^["'](.*)["']$/, '$1');
        // Only set if not already defined (preserves system env vars / secrets)
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = cleanValue;
        }
      }
    });
  }
};

// Load .env.local first (local user overrides)
loadEnv(envLocalPath);
// Then load .env (defaults)
loadEnv(envPath);

interface ExtractionConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LLMResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface ExtractedModelData {
  name: string;
  input_per_million: number;
  output_per_million: number;
  context_window: number;
  free_tier?: string;
}

interface ExtractionResult {
  provider: string;
  models: ExtractedModelData[];
  source_url: string;
}

// System prompt for the LLM
const EXTRACTION_SYSTEM_PROMPT = `You are a pricing data extraction expert. Your task is to extract pricing information from documentation pages about LLM models.

Given a documentation page about LLM pricing, extract the following information:

1. Provider name (e.g., "xAI", "OpenAI", "Anthropic")
2. Model name(s) and their pricing details:
   - Model name
   - Input price per million tokens
   - Output price per million tokens
   - Context window (if available)
   - Free tier information (if available)

Important notes:
- Prices are ALWAYS in dollars per million tokens ($/M)
- If you see prices like "$0.20 per 1K tokens", convert to $200 per million
- If you see prices like "$0.20 per 1M tokens", keep as $0.20 per million
- Context window is in tokens (e.g., 128000, 200000)
- Look for "input", "output", "prompt", "completion" pricing
- Some providers use "per 1K tokens" - multiply by 1000 to get per million
- Some providers use "per 1M tokens" - use as-is
- Multiple models might be on one page (e.g., Grok 4 variants)

Return your response as valid JSON in this exact format:
{
  "provider": "Provider Name",
  "models": [
    {
      "name": "Model Name",
      "input_per_million": 0.20,
      "output_per_million": 0.50,
      "context_window": 128000,
      "free_tier": "Optional free tier info"
    }
  ]
}

If no pricing data is found, return an empty models array.`;

/**
 * Fetch web page content
 */
async function fetchWebContent(url: string): Promise<string> {
  console.log(`  📡 Fetching content from: ${url}`);

  try {
    // Use a simple fetch - in production you might want to use a specialized scraping service
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LLM-Cost-Compass-Scraper/1.0',
        'Accept': 'text/html, */*',
      },
      signal: timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    console.log(`  ✓ Retrieved ${html.length} characters`);
    return html;
  } catch (error) {
    console.error('  ✗ Fetch failed:', error instanceof Error ? error.message : error);
    throw error;
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
 * Extract text content from HTML (basic cleanup)
 */
function extractTextFromHTML(html: string): string {
  // Remove script and style tags
  let text = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '');
  text = text.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, '');

  // Remove HTML tags but preserve some structure
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<\/div>/gi, '\n');
  text = text.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  text = text.replace(/ /g, ' ');
  text = text.replace(/&/g, '&');
  text = text.replace(/</g, '<');
  text = text.replace(/>/g, '>');
  text = text.replace(/"/g, '"');
  text = text.replace(/'/g, "'");

  // Clean up whitespace
  text = text.replace(/\s+\n/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

/**
 * Call the LLM API to extract pricing data
 */
async function callLLM(
  config: ExtractionConfig,
  content: string,
  providerHint?: string
): Promise<ExtractionResult> {
  console.log('  🤖 Sending to LLM for extraction...');

  const userPrompt = providerHint
    ? `Documentation content (provider hint: ${providerHint}):\n\n${content.substring(0, 8000)}`
    : `Documentation content:\n\n${content.substring(0, 8000)}`;

  const messages: LLMMessage[] = [
    { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
    { role: 'user', content: userPrompt }
  ];

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages,
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
      signal: timeout(60000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM API error: ${response.status} - ${errorText}`);
    }

    const data: LLMResponse = await response.json();
    const content = data.choices[0].message.content;

    console.log('  ✓ LLM response received');

    // Parse the JSON response
    const result = JSON.parse(content) as ExtractionResult;
    return result;
  } catch (error) {
    console.error('  ✗ LLM call failed:', error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * Validate and normalize extracted data
 */
function validateAndNormalize(result: ExtractionResult): ExtractionResult {
  if (!result.provider || !result.models) {
    throw new Error('Invalid extraction result: missing provider or models');
  }

  const normalizedModels = result.models.map(model => {
    // Validate required fields
    if (!model.name || typeof model.input_per_million !== 'number' || typeof model.output_per_million !== 'number') {
      throw new Error(`Invalid model data: ${JSON.stringify(model)}`);
    }

    return {
      name: model.name,
      input_per_million: model.input_per_million,
      output_per_million: model.output_per_million,
      context_window: model.context_window || 0,
      free_tier: model.free_tier || undefined,
    };
  });

  return {
    provider: result.provider,
    models: normalizedModels,
    source_url: result.source_url,
  };
}

/**
 * Format result for display
 */
function formatResult(result: ExtractionResult): string {
  const lines: string[] = [];
  lines.push(`\n${'='.repeat(60)}`);
  lines.push(`Provider: ${result.provider}`);
  lines.push(`Source: ${result.source_url}`);
  lines.push(`${'='.repeat(60)}`);

  result.models.forEach((model, idx) => {
    lines.push(`\n${idx + 1}. ${model.name}`);
    lines.push(`   Input:  $${model.input_per_million.toFixed(2)} per M tokens`);
    lines.push(`   Output: $${model.output_per_million.toFixed(2)} per M tokens`);
    if (model.context_window > 0) {
      lines.push(`   Context: ${model.context_window.toLocaleString()} tokens`);
    }
    if (model.free_tier) {
      lines.push(`   Free: ${model.free_tier}`);
    }
  });

  lines.push(`\n${'='.repeat(60)}`);
  return lines.join('\n');
}

/**
 * Format result as JSON for pricing.json
 */
function formatForPricingJSON(result: ExtractionResult): string {
  const timestamp = new Date().toISOString();

  const providerData = {
    id: result.provider.toLowerCase().replace(/\s+/g, '-'),
    name: result.provider,
    models: result.models.map(m => ({
      name: m.name,
      input_per_million: m.input_per_million,
      output_per_million: m.output_per_million,
      context_window: m.context_window,
      free_tier: m.free_tier,
      last_updated: timestamp,
    })),
  };

  return JSON.stringify(providerData, null, 2);
}

/**
 * Convert extraction result to ProviderData format for merging
 */
export function resultToProviderData(result: ExtractionResult): any {
  const timestamp = new Date().toISOString();

  return {
    id: result.provider.toLowerCase().replace(/\s+/g, '-'),
    name: result.provider,
    models: result.models.map(m => ({
      name: m.name,
      input_per_million: m.input_per_million,
      output_per_million: m.output_per_million,
      context_window: m.context_window,
      free_tier: m.free_tier,
      last_updated: timestamp,
    })),
  };
}

/**
 * Main extraction function
 */
export async function extractPricingFromURL(
  url: string,
  providerHint?: string
): Promise<ExtractionResult> {
  console.log(`\n🔍 Starting LLM extraction from: ${url}`);

  // Load config
  const config: ExtractionConfig = {
    apiKey: process.env.EXTRACTION_API_KEY || '',
    baseUrl: process.env.EXTRACTION_BASE_URL || '',
    model: process.env.EXTRACTION_MODEL || 'gpt-4-turbo',
  };

  if (!config.apiKey || !config.baseUrl) {
    throw new Error('Missing EXTRACTION_API_KEY or EXTRACTION_BASE_URL environment variables');
  }

  // Step 1: Fetch web content
  const html = await fetchWebContent(url);

  // Step 2: Extract text from HTML
  const text = extractTextFromHTML(html);
  console.log(`  📄 Cleaned text: ${text.length} characters`);

  // Step 3: Call LLM to extract pricing
  const result = await callLLM(config, text, providerHint);

  // Step 4: Add source URL
  const finalResult: ExtractionResult = {
    ...result,
    source_url: url,
  };

  // Step 5: Validate
  const validated = validateAndNormalize(finalResult);

  // Step 6: Display results
  console.log(formatResult(validated));

  // Step 7: Show JSON format
  console.log('\n📋 JSON for pricing.json:');
  console.log(formatForPricingJSON(validated));

  return validated;
}

/**
 * Batch extract from a JSON file containing URLs
 */
async function batchExtract(filePath: string): Promise<void> {
  console.log(`\n📊 Batch extraction from: ${filePath}`);

  const content = await fs.promises.readFile(filePath, 'utf-8');
  const urls: Array<{ url: string; provider?: string }> = JSON.parse(content);

  if (!Array.isArray(urls)) {
    throw new Error('File must contain a JSON array of URL objects');
  }

  console.log(`Found ${urls.length} URLs to process\n`);

  const results: ExtractionResult[] = [];

  for (const item of urls) {
    const url = typeof item === 'string' ? item : item.url;
    const provider = typeof item === 'object' ? item.provider : undefined;

    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Processing: ${url}`);
      console.log(`${'='.repeat(60)}`);

      const result = await extractPricingFromURL(url, provider);
      results.push(result);

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`\n⚠️  Failed to process ${url}:`, error instanceof Error ? error.message : error);
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('BATCH EXTRACTION SUMMARY');
  console.log(`${'='.repeat(60)}`);
  console.log(`Total URLs: ${urls.length}`);
  console.log(`Successful: ${results.length}`);
  console.log(`Failed: ${urls.length - results.length}`);

  if (results.length > 0) {
    console.log('\n📋 Combined JSON for pricing.json:');
    const combined = results.map(r => ({
      id: r.provider.toLowerCase().replace(/\s+/g, '-'),
      name: r.provider,
      models: r.models.map(m => ({
        name: m.name,
        input_per_million: m.input_per_million,
        output_per_million: m.output_per_million,
        context_window: m.context_window,
        free_tier: m.free_tier,
        last_updated: new Date().toISOString(),
      })),
    }));

    console.log(JSON.stringify(combined, null, 2));
  }
}

/**
 * CLI entry point
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = process.argv[2];
  const providerHint = process.argv[3] === '--provider' ? process.argv[4] : undefined;
  const batchMode = process.argv.includes('--batch');

  if (!arg) {
    console.error('❌ Error: URL or file path required');
    console.error('\nUsage:');
    console.error('  # Single URL extraction');
    console.error('  npx tsx scripts/llm-extract.ts <url> [--provider <name>]');
    console.error('');
    console.error('  # Batch extraction from JSON file');
    console.error('  npx tsx scripts/llm-extract.ts <file.json> --batch');
    console.error('\nExamples:');
    console.error('  npx tsx scripts/llm-extract.ts "https://docs.x.ai/docs/models/grok-4-1-fast-reasoning"');
    console.error('  npx tsx scripts/llm-extract.ts urls.json --batch');
    console.error('\nBatch file format:');
    console.error('  [');
    console.error('    {"url": "https://...", "provider": "xAI"},');
    console.error('    {"url": "https://..."}');
    console.error('  ]');
    process.exit(1);
  }

  if (batchMode) {
    batchExtract(arg)
      .then(() => {
        console.log('\n✅ Batch extraction complete!');
        process.exit(0);
      })
      .catch(error => {
        console.error('\n❌ Batch extraction failed:', error instanceof Error ? error.message : error);
        process.exit(1);
      });
  } else {
    extractPricingFromURL(arg, providerHint)
      .then(() => {
        console.log('\n✅ Extraction complete!');
        process.exit(0);
      })
      .catch(error => {
        console.error('\n❌ Extraction failed:', error instanceof Error ? error.message : error);
        process.exit(1);
      });
  }
}
