#!/usr/bin/env node

import Database from 'better-sqlite3';

console.log('🧪 Testing LLM PriceCheck setup...\n');

let allPassed = true;

// Test 1: Check dependencies
console.log('1. Checking dependencies...');
try {
  const db = new Database('llm-pricing.db');
  console.log('   ✅ better-sqlite3 works');
  db.close();
} catch (e) {
  console.log('   ❌ better-sqlite3 failed:', e.message);
  allPassed = false;
}

// Test 2: Check database structure
console.log('\n2. Checking database structure...');
try {
  const db = new Database('llm-pricing.db');

  const tables = ['providers', 'pricing', 'submissions', 'price_history'];
  for (const table of tables) {
    const result = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(table);
    if (result) {
      console.log(`   ✅ ${table} table exists`);
    } else {
      console.log(`   ❌ ${table} table missing`);
      allPassed = false;
    }
  }

  db.close();
} catch (e) {
  console.log('   ❌ Database check failed:', e.message);
  allPassed = false;
}

// Test 3: Check if seeded
console.log('\n3. Checking if seeded...');
try {
  const db = new Database('llm-pricing.db');
  const count = db.prepare('SELECT COUNT(*) as count FROM providers').get().count;

  if (count > 0) {
    console.log(`   ✅ ${count} providers found`);

    // Show them
    const providers = db.prepare('SELECT name FROM providers').all();
    providers.forEach(p => console.log(`      - ${p.name}`));
  } else {
    console.log('   ⚠️  No providers found. Run: npm run db:seed');
  }

  db.close();
} catch (e) {
  console.log('   ❌ Seed check failed:', e.message);
  allPassed = false;
}

// Test 4: Check environment
console.log('\n4. Checking environment...');
const hasEnv = process.env.EXTRACTION_API_KEY ? '✅ EXTRACTION_API_KEY set' : '⚠️  EXTRACTION_API_KEY not set (needed for scraping)';
console.log(`   ${hasEnv}`);

// Test 5: File structure
console.log('\n5. Checking file structure...');
const fs = await import('fs');
const requiredFiles = [
  'src/app/page.tsx',
  'src/lib/db.ts',
  'src/lib/pricing.ts',
  'src/lib/extractor.ts',
  'src/lib/scrape.ts',
  'scripts/seed.js',
  'scripts/scrape.js'
];

for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} missing`);
    allPassed = false;
  }
}

// Summary
console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('✅ All checks passed! You\'re ready to launch.');
  console.log('\nNext steps:');
  console.log('1. npm run dev');
  console.log('2. Visit http://localhost:3000');
  console.log('3. Test the features');
  console.log('4. Deploy to Vercel');
} else {
  console.log('❌ Some checks failed. Please fix issues above.');
}
console.log('='.repeat(50));