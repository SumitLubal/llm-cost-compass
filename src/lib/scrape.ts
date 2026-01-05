import { LLMExtractor, notifyAdmin } from './extractor';
import { db } from './db';

// Get all providers that need updating
function getProvidersToUpdate() {
  const stmt = db.prepare(`
    SELECT id, name, website, last_scraped, confidence
    FROM providers
    WHERE last_scraped IS NULL
       OR last_scraped < datetime('now', '-7 days')
    ORDER BY last_scraped ASC
  `);

  return stmt.all() as Array<{
    id: number;
    name: string;
    website: string;
    last_scraped: string | null;
    confidence: number;
  }>;
}

// Compare prices and detect changes
function detectChanges(providerId: number, newModels: Array<{
  name: string;
  input_per_million: number;
  output_per_million: number;
}>) {
  const changes: Array<{
    model: string;
    old: number;
    new: number;
  }> = [];

  for (const model of newModels) {
    const existing = db.prepare(`
      SELECT input_per_million, output_per_million
      FROM pricing
      WHERE provider_id = ? AND model_name = ?
    `).get(providerId, model.name) as {
      input_per_million: number;
      output_per_million: number;
    } | undefined;

    if (existing) {
      const inputChange = Math.abs(existing.input_per_million - model.input_per_million);
      const outputChange = Math.abs(existing.output_per_million - model.output_per_million);

      if (inputChange > 0.01 || outputChange > 0.01) {
        changes.push({
          model: model.name,
          old: existing.input_per_million + existing.output_per_million,
          new: model.input_per_million + model.output_per_million,
        });
      }
    }
  }

  return changes;
}

// Main scraping function
export async function runScraping() {
  console.log('🚀 Starting pricing update...');

  const providers = getProvidersToUpdate();
  console.log(`Found ${providers.length} providers to update`);

  if (providers.length === 0) {
    console.log('All providers are up to date!');
    return { success: true, message: 'No updates needed' };
  }

  // Get API config from environment
  const apiKey = process.env.EXTRACTION_API_KEY;
  const baseURL = process.env.EXTRACTION_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.EXTRACTION_MODEL || 'gpt-4-turbo';

  if (!apiKey) {
    throw new Error('EXTRACTION_API_KEY not set');
  }

  const extractor = new LLMExtractor({ apiKey, baseURL, model });

  let successCount = 0;
  let failCount = 0;
  const notifications: Array<{
    extracted: any;
    changes: Array<{ model: string; old: number; new: number }>;
  }> = [];

  for (const provider of providers) {
    console.log(`\n📦 Processing: ${provider.name}`);

    try {
      const extracted = await extractor.extractPricing(
        provider.website,
        provider.name
      );

      console.log(`   ✓ Extracted ${extracted.models.length} models`);
      console.log(`   Confidence: ${extracted.confidence}`);

      // Detect changes
      const changes = detectChanges(provider.id, extracted.models);

      if (changes.length > 0) {
        console.log(`   📝 ${changes.length} price changes`);
      }

      // Auto-publish or queue for review
      if (extracted.confidence >= 0.85) {
        console.log('   ✅ Auto-publishing');
        await extractor.verifyAndStore(extracted);
        successCount++;

        if (changes.length > 0) {
          notifications.push({ extracted, changes });
        }
      } else {
        console.log('   ⚠️  Queued for manual review');
      }

    } catch (error: any) {
      console.log(`   ❌ Failed: ${error.message}`);
      failCount++;
    }
  }

  // Send notifications
  console.log('\n📧 Sending notifications...');
  for (const { extracted, changes } of notifications) {
    try {
      await notifyAdmin(extracted, changes);
      console.log(`   ✓ ${extracted.provider} notification sent`);
    } catch (error: any) {
      console.log(`   ❌ Failed to notify: ${error.message}`);
    }
  }

  console.log('\n✅ Scraping complete!');
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);

  return {
    success: true,
    successCount,
    failCount,
    total: providers.length
  };
}