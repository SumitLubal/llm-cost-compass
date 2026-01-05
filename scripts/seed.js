import Database from 'better-sqlite3';

const db = new Database('llm-pricing.db');

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize all tables
db.exec(`
  CREATE TABLE IF NOT EXISTS providers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    website TEXT NOT NULL,
    last_scraped TIMESTAMP,
    confidence REAL DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pricing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider_id INTEGER NOT NULL,
    model_name TEXT NOT NULL,
    input_per_million REAL,
    output_per_million REAL,
    context_window INTEGER,
    free_tier TEXT,
    source TEXT,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id)
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider_name TEXT NOT NULL,
    website TEXT,
    input_price REAL,
    output_price REAL,
    user_email TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS price_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider_id INTEGER NOT NULL,
    model_name TEXT NOT NULL,
    input_per_million REAL,
    output_per_million REAL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id)
  );
`);

// Initial data for top 5 providers (as of Jan 2025)
const providers = [
  {
    name: 'OpenAI',
    website: 'https://openai.com/pricing',
    models: [
      { name: 'GPT-4o', input: 5.00, output: 15.00, context: 128000 },
      { name: 'GPT-4 Turbo', input: 10.00, output: 30.00, context: 128000 },
      { name: 'GPT-3.5 Turbo', input: 0.50, output: 1.50, context: 16385 },
    ]
  },
  {
    name: 'Anthropic',
    website: 'https://www.anthropic.com/pricing',
    models: [
      { name: 'Claude 3 Opus', input: 15.00, output: 75.00, context: 200000 },
      { name: 'Claude 3 Sonnet', input: 3.00, output: 15.00, context: 200000 },
      { name: 'Claude 3 Haiku', input: 0.25, output: 1.25, context: 200000, free_tier: '1M tokens/month' },
    ]
  },
  {
    name: 'Google',
    website: 'https://cloud.google.com/vertex-ai/pricing',
    models: [
      { name: 'Gemini 1.5 Pro', input: 5.00, output: 15.00, context: 1000000 },
      { name: 'Gemini Pro', input: 0.50, output: 1.50, context: 32000 },
    ]
  },
  {
    name: 'Meta',
    website: 'https://www.llama.com/pricing', // Placeholder
    models: [
      { name: 'Llama 3 70B', input: 2.50, output: 10.00, context: 8192 },
      { name: 'Llama 3 8B', input: 0.30, output: 0.60, context: 8192 },
    ]
  },
  {
    name: 'Mistral',
    website: 'https://mistral.ai/pricing',
    models: [
      { name: 'Mixtral 8x7B', input: 0.70, output: 2.80, context: 32000 },
      { name: 'Mistral 7B', input: 0.15, output: 0.30, context: 8192 },
    ]
  }
];

console.log('🌱 Seeding database...\n');

let totalInserted = 0;

for (const provider of providers) {
  // Insert provider
  const providerStmt = db.prepare(`
    INSERT OR IGNORE INTO providers (name, website, last_scraped, confidence)
    VALUES (?, ?, datetime('now'), 0.95)
  `);

  const providerResult = providerStmt.run(provider.name, provider.website);
  const providerId = providerResult.lastInsertRowid ||
    db.prepare('SELECT id FROM providers WHERE name = ?').get(provider.name).id;

  console.log(`📦 ${provider.name} (ID: ${providerId})`);

  // Insert models
  for (const model of provider.models) {
    const pricingStmt = db.prepare(`
      INSERT INTO pricing (provider_id, model_name, input_per_million, output_per_million, context_window, free_tier, source)
      VALUES (?, ?, ?, ?, ?, ?, 'seed')
    `);

    pricingStmt.run(
      providerId,
      model.name,
      model.input,
      model.output,
      model.context,
      model.free_tier || null
    );

    // Also add to history
    const historyStmt = db.prepare(`
      INSERT INTO price_history (provider_id, model_name, input_per_million, output_per_million)
      VALUES (?, ?, ?, ?)
    `);

    historyStmt.run(providerId, model.name, model.input, model.output);

    console.log(`  ✓ ${model.name}: $${model.input}/$${model.output} per 1M`);
    totalInserted++;
  }
  console.log('');
}

console.log(`✅ Seeding complete! Added ${totalInserted} models from ${providers.length} providers.`);
console.log('\nNext steps:');
console.log('1. Run: npm run dev');
console.log('2. Visit: http://localhost:3000');
console.log('3. Configure your extraction API in .env.local');