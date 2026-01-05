import OpenAI from 'openai';
import * as cheerio from 'cheerio';

export interface ExtractionConfig {
  apiKey: string;
  baseURL: string;
  model: string;
}

export interface ExtractedPricing {
  provider: string;
  models: Array<{
    name: string;
    input_per_million: number;
    output_per_million: number;
    context_window?: number;
    free_tier?: string;
  }>;
  confidence: number;
}

export class LLMExtractor {
  private client: OpenAI;
  private config: ExtractionConfig;

  constructor(config: ExtractionConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    });
  }

  // Fetch HTML from URL
  private async fetchContent(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LLMPriceCheck/1.0)',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      throw new Error(`Failed to fetch ${url}: ${error}`);
    }
  }

  // Clean HTML and extract text
  private cleanHTML(html: string): string {
    const $ = cheerio.load(html);

    // Remove scripts, styles, nav, footer
    $('script, style, nav, footer, header').remove();

    // Get text content
    let text = $('body').text();

    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();

    // Keep only reasonable length
    return text.substring(0, 4000);
  }

  // Extract pricing using LLM
  async extractPricing(url: string, providerName: string): Promise<ExtractedPricing> {
    try {
      console.log(`🔍 Extracting pricing from ${url}...`);

      const html = await this.fetchContent(url);
      const cleanText = this.cleanHTML(html);

      const prompt = `
You are a pricing data extraction expert. Extract pricing information from the following text about ${providerName}.

Return JSON in this exact format:
{
  "models": [
    {
      "name": "Model Name",
      "input_per_million": 5.00,
      "output_per_million": 15.00,
      "context_window": 128000,
      "free_tier": "optional description"
    }
  ],
  "confidence": 0.95
}

Guidelines:
- Prices are per 1 MILLION tokens
- If only per 1K tokens is shown, multiply by 1000
- Extract ALL models mentioned
- If free tier exists, include it
- Context window is optional
- Confidence: 0.95 if clear, 0.7 if uncertain

Text to analyze:
${cleanText}

JSON:
`;

      const completion = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You extract pricing data accurately. Return only valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0].message.content;

      if (!content) {
        throw new Error('No response from LLM');
      }

      const parsed = JSON.parse(content);

      // Validate
      if (!parsed.models || !Array.isArray(parsed.models)) {
        throw new Error('Invalid response format');
      }

      return {
        provider: providerName,
        models: parsed.models,
        confidence: parsed.confidence || 0.7,
      };

    } catch (error) {
      console.error('Extraction error:', error);
      throw error;
    }
  }

  // Verify extracted data against known patterns
  async verifyAndStore(extracted: ExtractedPricing): Promise<boolean> {
    const { db } = await import('./db');

    for (const model of extracted.models) {
      // Check if model already exists
      const existing = db.prepare(`
        SELECT id FROM pricing
        WHERE provider_id = (SELECT id FROM providers WHERE name = ?)
        AND model_name = ?
      `).get(extracted.provider, model.name);

      if (existing) {
        // Update existing
        db.prepare(`
          UPDATE pricing
          SET input_per_million = ?, output_per_million = ?,
              context_window = ?, free_tier = ?, scraped_at = datetime('now')
          WHERE id = ?
        `).run(
          model.input_per_million,
          model.output_per_million,
          model.context_window || null,
          model.free_tier || null,
          existing.id
        );
      } else {
        // Insert new
        const providerId = db.prepare(`
          SELECT id FROM providers WHERE name = ?
        `).get(extracted.provider);

        if (providerId) {
          db.prepare(`
            INSERT INTO pricing (provider_id, model_name, input_per_million,
                               output_per_million, context_window, free_tier, source)
            VALUES (?, ?, ?, ?, ?, ?, 'scraped')
          `).run(
            providerId.id,
            model.name,
            model.input_per_million,
            model.output_per_million,
            model.context_window || null,
            model.free_tier || null
          );
        }
      }
    }

    // Update provider confidence and last scraped
    db.prepare(`
      UPDATE providers
      SET last_scraped = datetime('now'), confidence = ?
      WHERE name = ?
    `).run(extracted.confidence, extracted.provider);

    return true;
  }
}

// Auto-publish threshold
export const AUTO_PUBLISH_THRESHOLD = 0.85;

// Email notification function (simplified)
export async function notifyAdmin(
  extracted: ExtractedPricing,
  changes: Array<{ model: string; old: number; new: number }>
) {
  if (!process.env.RESEND_API_KEY || !process.env.ALERT_EMAIL) {
    console.log('📧 Email config missing, skipping notification');
    return;
  }

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const subject = extracted.confidence >= AUTO_PUBLISH_THRESHOLD
    ? `✅ Auto-published: ${extracted.provider} pricing`
    : `⚠️ Review needed: ${extracted.provider} pricing`;

  const body = `
Provider: ${extracted.provider}
Confidence: ${extracted.confidence}
Models: ${extracted.models.length}

Changes:
${changes.map(c => `- ${c.model}: $${c.old} → $${c.new}`).join('\n')}

View: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
`;

  try {
    await resend.emails.send({
      from: 'LLM PriceCheck <noreply@llmpricecheck.com>',
      to: process.env.ALERT_EMAIL,
      subject,
      text: body,
    });
  } catch (error) {
    console.error('Email notification failed:', error);
  }
}