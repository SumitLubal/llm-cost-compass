/**
 * Merge extracted pricing data into pricing.json
 *
 * Usage:
 *   npx tsx scripts/merge-pricing.ts <provider_id> <json_string>
 *   npx tsx scripts/merge-pricing.ts xai '{"id":"xai","name":"xAI","models":[...]}'
 *
 * Also exported for use by other scripts:
 *   import { mergePricingData } from './merge-pricing';
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { PricingData, ProviderData } from '../src/data/types';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'pricing.json');

async function loadPricingData(): Promise<PricingData> {
  const content = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(content) as PricingData;
}

async function savePricingData(data: PricingData): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
  console.log('✅ Pricing data saved');
}

function mergeProviderData(
  existingData: PricingData,
  newProvider: ProviderData
): PricingData {
  const providerIndex = existingData.providers.findIndex(p => p.id === newProvider.id);

  if (providerIndex === -1) {
    // Add new provider
    existingData.providers.push(newProvider);
    console.log(`➕ Added new provider: ${newProvider.name}`);
  } else {
    // Merge with existing provider
    const existingProvider = existingData.providers[providerIndex];

    // Update provider name if changed
    existingProvider.name = newProvider.name;

    // Merge models
    for (const newModel of newProvider.models) {
      const modelIndex = existingProvider.models.findIndex(m => m.name === newModel.name);

      if (modelIndex === -1) {
        // Add new model
        existingProvider.models.push(newModel);
        console.log(`➕ Added: ${newProvider.name} - ${newModel.name}`);
      } else {
        // Update existing model
        const oldModel = existingProvider.models[modelIndex];
        const changes: string[] = [];

        if (oldModel.input_per_million !== newModel.input_per_million) {
          changes.push(`input: $${oldModel.input_per_million} → $${newModel.input_per_million}`);
        }
        if (oldModel.output_per_million !== newModel.output_per_million) {
          changes.push(`output: $${oldModel.output_per_million} → $${newModel.output_per_million}`);
        }
        if (oldModel.context_window !== newModel.context_window) {
          changes.push(`context: ${oldModel.context_window} → ${newModel.context_window}`);
        }
        if (oldModel.free_tier !== newModel.free_tier) {
          changes.push(`free_tier: ${oldModel.free_tier || 'none'} → ${newModel.free_tier || 'none'}`);
        }

        if (changes.length > 0) {
          console.log(`📝 Updated: ${newProvider.name} - ${newModel.name}`);
          changes.forEach(c => console.log(`   ${c}`));
        }

        existingProvider.models[modelIndex] = newModel;
      }
    }

    // Remove models that no longer exist (optional - comment out if you want to keep all models)
    // const modelNames = new Set(newProvider.models.map(m => m.name));
    // const removed = existingProvider.models.filter(m => !modelNames.has(m.name));
    // if (removed.length > 0) {
    //   console.log(`🗑️  Removed: ${removed.map(m => m.name).join(', ')}`);
    //   existingProvider.models = existingProvider.models.filter(m => modelNames.has(m.name));
    // }
  }

  // Update metadata
  existingData.metadata.last_updated = new Date().toISOString();
  existingData.metadata.total_models = existingData.providers.reduce(
    (sum, p) => sum + p.models.length, 0
  );

  return existingData;
}

export async function mergePricingData(
  providerId: string,
  newDataJson: string
): Promise<void> {
  console.log(`\n🔄 Merging pricing data for provider: ${providerId}`);

  try {
    // Parse new data
    const newProvider: ProviderData = JSON.parse(newDataJson);

    // Validate
    if (!newProvider.id || !newProvider.name || !Array.isArray(newProvider.models)) {
      throw new Error('Invalid provider data format');
    }

    // Load existing data
    const existingData = await loadPricingData();
    console.log(`   Current: ${existingData.metadata.total_models} models across ${existingData.providers.length} providers`);

    // Merge
    const mergedData = mergeProviderData(existingData, newProvider);

    // Save
    await savePricingData(mergedData);

    // Summary
    const provider = mergedData.providers.find(p => p.id === providerId);
    console.log(`\n📊 Summary for ${provider?.name}:`);
    console.log(`   Models: ${provider?.models.length}`);
    console.log(`   Total models in system: ${mergedData.metadata.total_models}`);

  } catch (error) {
    console.error('❌ Merge failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const providerId = process.argv[2];
  const jsonData = process.argv[3];

  if (!providerId || !jsonData) {
    console.error('❌ Error: Provider ID and JSON data required');
    console.error('\nUsage:');
    console.error('  npx tsx scripts/merge-pricing.ts <provider_id> <json_string>');
    console.error('\nExample:');
    console.error('  npx tsx scripts/merge-pricing.ts xai \'{"id":"xai","name":"xAI","models":[...]}\'');
    process.exit(1);
  }

  mergePricingData(providerId, jsonData)
    .then(() => process.exit(0))
    .catch(error => {
      console.error('\n❌ Failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    });
}
