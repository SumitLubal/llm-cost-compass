import { runScraping } from '../src/lib/scrape.js';

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runScraping().catch(console.error);
}

export { runScraping };