/**
 * Compare old and new pricing data to detect changes
 */

import { PricingData, ScrapingResult, PriceChange } from '../src/data/types';
import * as fs from 'fs/promises';
import * as path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'pricing.json');

export async function loadExistingPricing(): Promise<PricingData | null> {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('No existing pricing data found, starting fresh.');
    return null;
  }
}

export function comparePricing(
  oldData: PricingData | null,
  newResults: ScrapingResult[]
): PriceChange[] {
  const changes: PriceChange[] = [];

  if (!oldData) {
    console.log('No previous data to compare against.');
    return changes;
  }

  // Create a map of old prices for quick lookup
  const oldPriceMap = new Map<string, { input: number; output: number }>();

  for (const provider of oldData.providers) {
    for (const model of provider.models) {
      const key = `${provider.name}|${model.name}`;
      oldPriceMap.set(key, {
        input: model.input_per_million,
        output: model.output_per_million,
      });
    }
  }

  // Compare with new data
  for (const result of newResults) {
    for (const model of result.models) {
      const key = `${result.provider}|${model.name}`;
      const oldPrices = oldPriceMap.get(key);

      if (!oldPrices) {
        // New model detected
        console.log(`🆕 New model: ${result.provider} ${model.name}`);
        continue;
      }

      // Check input price
      if (oldPrices.input !== model.input_per_million) {
        const change = model.input_per_million - oldPrices.input;
        const changePercent = ((change / oldPrices.input) * 100).toFixed(1);

        changes.push({
          provider: result.provider,
          model: model.name,
          field: 'input_per_million',
          old_value: oldPrices.input,
          new_value: model.input_per_million,
          change_percent: parseFloat(changePercent),
          confidence: result.confidence,
          source: result.source_url,
        });
      }

      // Check output price
      if (oldPrices.output !== model.output_per_million) {
        const change = model.output_per_million - oldPrices.output;
        const changePercent = ((change / oldPrices.output) * 100).toFixed(1);

        changes.push({
          provider: result.provider,
          model: model.name,
          field: 'output_per_million',
          old_value: oldPrices.output,
          new_value: model.output_per_million,
          change_percent: parseFloat(changePercent),
          confidence: result.confidence,
          source: result.source_url,
        });
      }
    }
  }

  return changes;
}

export function formatChangesForEmail(changes: PriceChange[]): string {
  if (changes.length === 0) {
    return '<p>No pricing changes detected today.</p>';
  }

  let html = `
    <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
      <thead>
        <tr style="background: #f3f4f6;">
          <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Provider</th>
          <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Model</th>
          <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Field</th>
          <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">Old</th>
          <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">New</th>
          <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">Change</th>
          <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">Conf.</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (const change of changes) {
    const color = change.change_percent > 0 ? '#ef4444' : '#10b981';
    const arrow = change.change_percent > 0 ? '↑' : '↓';

    html += `
      <tr>
        <td style="padding: 10px; border: 1px solid #e5e7eb;">${change.provider}</td>
        <td style="padding: 10px; border: 1px solid #e5e7eb;">${change.model}</td>
        <td style="padding: 10px; border: 1px solid #e5e7eb;">${change.field.replace('_per_million', '')}</td>
        <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">$${change.old_value.toFixed(2)}</td>
        <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right; font-weight: bold;">$${change.new_value.toFixed(2)}</td>
        <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right; color: ${color}; font-weight: bold;">
          ${arrow} ${Math.abs(change.change_percent)}%
        </td>
        <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">${(change.confidence * 100).toFixed(0)}%</td>
      </tr>
    `;
  }

  html += '</tbody></table>';

  html += `
    <div style="margin-top: 20px; padding: 15px; background: #eff6ff; border-left: 4px solid #3b82f6;">
      <strong>Next Steps:</strong>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Review changes above</li>
        <li>Verify against source URLs</li>
        <li>Approve to update the pricing database</li>
      </ul>
    </div>
  `;

  return html;
}

export function generateEmailSubject(changes: PriceChange[]): string {
  if (changes.length === 0) {
    return '✅ LLM Pricing Check - No Changes Today';
  }

  const highConfidence = changes.filter(c => c.confidence > 0.9).length;
  return `🚨 LLM Pricing Update: ${changes.length} change${changes.length > 1 ? 's' : ''} (${highConfidence} high-confidence)`;
}

// If run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  import('./scrape-providers').then(async ({ scrapeAllProviders }) => {
    const oldData = await loadExistingPricing();
    const newResults = await scrapeAllProviders();
    const changes = comparePricing(oldData, newResults);

    console.log(`\nFound ${changes.length} changes:\n`);
    console.log(JSON.stringify(changes, null, 2));
  });
}
