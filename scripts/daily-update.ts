/**
 * Daily Update Script
 *
 * This script is run by GitHub Actions daily to:
 * 1. Monitor pricing from llm-prices.com API
 * 2. Compare with existing pricing.json data
 * 3. Send email if changes detected
 * 4. Update the pricing.json file (if auto-publish or no changes)
 *
 * Uses verified pricing constants as source of truth.
 * API data is only used for change detection.
 */

import { scrapeAllProviders } from './scrape-providers';
import { loadExistingPricing, comparePricing } from './compare-pricing';
import { sendDailyReport } from './send-email';
import { PricingData } from '../src/data/types';
import * as fs from 'fs/promises';
import * as path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'pricing.json');

async function savePricingData(data: PricingData): Promise<void> {
  try {
    await fs.writeFile(
      DATA_PATH,
      JSON.stringify(data, null, 2)
    );
    console.log('✅ Pricing data saved to:', DATA_PATH);
  } catch (error) {
    console.error('❌ Failed to save pricing data:', error);
    throw error;
  }
}

async function buildPricingData(
  scrapedResults: any[]
): Promise<PricingData> {
  const providers = scrapedResults.map(result => ({
    id: result.provider.toLowerCase().replace(/\s+/g, '-'),
    name: result.provider,
    models: result.models.map((m: any) => ({
      name: m.name,
      input_per_million: m.input_per_million,
      output_per_million: m.output_per_million,
      context_window: m.context_window || 0,
      free_tier: m.free_tier || null,
      last_updated: result.scraped_at,
    })),
  }));

  return {
    providers,
    metadata: {
      last_updated: new Date().toISOString(),
      source: 'scraped',
      total_models: providers.reduce((sum, p) => sum + p.models.length, 0),
    },
  };
}

export async function runDailyUpdate(
  recipientEmail: string,
  autoPublish: boolean = false
): Promise<{
  changes: number;
  published: boolean;
  emailSent: boolean;
}> {
  console.log('🚀 Starting daily pricing update...\n');

  // Step 1: Load existing data
  console.log('Step 1: Loading existing pricing data...');
  const oldData = await loadExistingPricing();
  console.log(`   ${oldData ? `Found ${oldData.metadata.total_models} models` : 'No existing data'}\n`);

  // Step 2: Scrape new data
  console.log('Step 2: Scraping pricing from providers...');
  const scrapedResults = await scrapeAllProviders();
  console.log('');

  // Step 3: Compare
  console.log('Step 3: Comparing prices...');
  const changes = comparePricing(oldData, scrapedResults);
  console.log(`   ${changes.length} changes detected\n`);

  // Step 4: Build new data
  console.log('Step 4: Building new pricing data...');
  const newData = await buildPricingData(scrapedResults);
  console.log(`   ${newData.metadata.total_models} models ready\n`);

  // Step 5: Send email report
  console.log('Step 5: Sending email report...');
  await sendDailyReport(changes, recipientEmail);
  console.log('');

  // Step 6: Save data (if auto-publish or no changes)
  let published = false;
  if (autoPublish || changes.length === 0) {
    console.log('Step 6: Publishing data...');
    await savePricingData(newData);
    published = true;
    console.log('   ✅ Data published!\n');
  } else {
    console.log('Step 6: Skipping auto-publish (changes require review)');
    console.log('   ⏸️  Data saved for review\n');
  }

  // Summary
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 DAILY UPDATE SUMMARY');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`   Changes detected: ${changes.length}`);
  console.log(`   Published: ${published ? 'Yes' : 'No (requires review)'}`);
  console.log(`   Models tracked: ${newData.metadata.total_models}`);
  console.log(`   Recipient: ${recipientEmail}`);
  console.log('═══════════════════════════════════════════════════════\n');

  return {
    changes: changes.length,
    published,
    emailSent: true,
  };
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const email = process.env.ALERT_EMAIL || process.argv[2];
  const autoPublish = process.argv.includes('--auto-publish');

  if (!email) {
    console.error('❌ Error: No email address provided');
    console.error('\nUsage:');
    console.error('  npm run daily:update your@email.com');
    console.error('  npm run daily:update your@email.com --auto-publish');
    console.error('\nOr set ALERT_EMAIL environment variable');
    process.exit(1);
  }

  runDailyUpdate(email, autoPublish)
    .then(() => {
      console.log('✅ Daily update complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Daily update failed:', error);
      process.exit(1);
    });
}
