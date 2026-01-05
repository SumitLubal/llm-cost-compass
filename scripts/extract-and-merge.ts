/**
 * Extract pricing from URL and automatically merge into pricing.json
 *
 * Usage:
 *   npx tsx scripts/extract-and-merge.ts "https://docs.x.ai/docs/models/grok-4-1-fast-reasoning"
 *   npx tsx scripts/extract-and-merge.ts "https://openai.com/pricing" --provider OpenAI
 *
 * This script:
 * 1. Extracts pricing data from the URL using LLM
 * 2. Merges the data into pricing.json
 * 3. Shows what changed
 */

import { extractPricingFromURL, resultToProviderData } from './llm-extract';
import { mergePricingData } from './merge-pricing';

async function extractAndMerge(url: string, providerHint?: string): Promise<void> {
  console.log('🚀 Extract and Merge Workflow\n');

  // Step 1: Extract
  console.log('Step 1: Extracting pricing from URL...');
  const result = await extractPricingFromURL(url, providerHint);

  // Step 2: Convert to JSON format
  const jsonForMerge = resultToProviderData(result);

  // Step 3: Merge into pricing.json
  console.log('\nStep 2: Merging into pricing.json...');
  await mergePricingData(jsonForMerge.id, JSON.stringify(jsonForMerge));

  console.log('\n✅ Complete! Data has been extracted and merged.');
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2];
  const providerHint = process.argv[3] === '--provider' ? process.argv[4] : undefined;

  if (!url) {
    console.error('❌ Error: URL required');
    console.error('\nUsage:');
    console.error('  npx tsx scripts/extract-and-merge.ts <url> [--provider <name>]');
    console.error('\nExamples:');
    console.error('  npx tsx scripts/extract-and-merge.ts "https://docs.x.ai/docs/models/grok-4-1-fast-reasoning"');
    console.error('  npx tsx scripts/extract-and-merge.ts "https://openai.com/pricing" --provider OpenAI');
    process.exit(1);
  }

  extractAndMerge(url, providerHint)
    .then(() => process.exit(0))
    .catch(error => {
      console.error('\n❌ Failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    });
}
