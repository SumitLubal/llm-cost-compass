/**
 * Automated Directory Submitter for LLM PriceCompare
 *
 * Submits to free product directories and AI tool listings
 * All free platforms that accept manual submissions
 */

interface Directory {
  name: string;
  url: string;
  submissionUrl: string;
  description: string;
  category: string;
  tags: string[];
  requiresAccount: boolean;
  estimatedTime: string;
}

const PRODUCT_INFO = {
  name: 'LLM PriceCompare',
  url: 'https://llmpricecompare.com',
  description: 'Free tool to compare LLM pricing across OpenAI, Anthropic, Google, xAI, Amazon, Meta, and more. Real-time cost calculator, daily updates, and smart recommendations.',
  longDescription: `LLM PriceCompare is a comprehensive pricing comparison tool for large language models. We track 32+ models from 9 providers including OpenAI (GPT-4, GPT-4o), Anthropic (Claude 3), Google (Gemini), xAI (Grok), Amazon (Nova), Meta (Llama), DeepSeek, Mistral, and more.

Features:
✓ Daily automated price updates
✓ Real-time cost calculator
✓ Smart value recommendations
✓ Free tier detection
✓ Dark mode support
✓ No registration required

Perfect for developers, startups, and enterprises looking to optimize their AI costs.`,
  keywords: ['LLM', 'AI', 'pricing', 'comparison', 'OpenAI', 'Anthropic', 'Google', 'xAI', 'cost calculator', 'AI tools'],
  category: 'Developer Tools',
  twitter: '@llmpricecompare',
  github: 'https://github.com/SumitLubal/llm-cost-compass'
};

// Free directories that accept submissions
export const DIRECTORIES: Directory[] = [
  // Product Hunt style platforms
  {
    name: 'Product Hunt',
    url: 'https://www.producthunt.com',
    submissionUrl: 'https://www.producthunt.com/submit',
    description: 'Discover the latest apps and tech products',
    category: 'Developer Tools',
    tags: ['AI', 'LLM', 'Developer Tools', 'Pricing'],
    requiresAccount: true,
    estimatedTime: '15 min'
  },
  {
    name: 'BetaList',
    url: 'https://betalist.com',
    submissionUrl: 'https://betalist.com/submit',
    description: 'Discover new products before launch',
    category: 'Developer Tools',
    tags: ['AI', 'SaaS', 'Developer Tools'],
    requiresAccount: true,
    estimatedTime: '10 min'
  },
  {
    name: '10WordStory',
    url: 'https://10wordstory.com',
    submissionUrl: 'https://10wordstory.com/submit',
    description: 'Describe your product in 10 words',
    category: 'Tools',
    tags: ['AI', 'Developer'],
    requiresAccount: false,
    estimatedTime: '2 min'
  },

  // AI/ML specific directories
  {
    name: 'Futurepedia',
    url: 'https://www.futurepedia.io',
    submissionUrl: 'https://www.futurepedia.io/submit',
    description: 'Largest AI tools directory',
    category: 'AI Tools',
    tags: ['LLM', 'AI', 'Pricing'],
    requiresAccount: true,
    estimatedTime: '10 min'
  },
  {
    name: 'ThereIsAnAIForThat',
    url: 'https://theresanaiforthat.com',
    submissionUrl: 'https://theresanaiforthat.com/submit',
    description: 'AI tools directory',
    category: 'Developer',
    tags: ['AI', 'LLM', 'Tools'],
    requiresAccount: true,
    estimatedTime: '10 min'
  },
  {
    name: 'AIHub',
    url: 'https://aihub.org',
    submissionUrl: 'https://aihub.org/contact/',
    description: 'AI resources and tools',
    category: 'Tools',
    tags: ['AI', 'Machine Learning', 'LLM'],
    requiresAccount: false,
    estimatedTime: '15 min'
  },

  // Developer tool directories
  {
    name: 'DevHunt',
    url: 'https://devhunt.org',
    submissionUrl: 'https://devhunt.org/submit',
    description: 'Weekly launch of new dev tools',
    category: 'Developer Tools',
    tags: ['Developer', 'Tools', 'AI'],
    requiresAccount: true,
    estimatedTime: '10 min'
  },
  {
    name: 'OpenSourceBuild',
    url: 'https://opensourcebuild.com',
    submissionUrl: 'https://opensourcebuild.com/submit',
    description: 'Open source projects showcase',
    category: 'Developer Tools',
    tags: ['Open Source', 'AI', 'Tools'],
    requiresAccount: true,
    estimatedTime: '8 min'
  },

  // Tech directories
  {
    name: 'SaaSHub',
    url: 'https://saashub.com',
    submissionUrl: 'https://saashub.com/add',
    description: 'Alternative to SaaS products',
    category: 'Developer Tools',
    tags: ['SaaS', 'AI', 'Developer Tools'],
    requiresAccount: true,
    estimatedTime: '12 min'
  },
  {
    name: 'AlternativeTo',
    url: 'https://alternativeto.net',
    submissionUrl: 'https://alternativeto.net/software/llm-pricecompare/add/',
    description: 'Find alternatives to software',
    category: 'Developer Tools',
    tags: ['AI', 'Tools', 'Alternative'],
    requiresAccount: true,
    estimatedTime: '10 min'
  },

  // Startup directories
  {
    name: 'StartupBase',
    url: 'https://startupbase.io',
    submissionUrl: 'https://startupbase.io/submit',
    description: 'Showcase your startup',
    category: 'Developer Tools',
    tags: ['Startup', 'AI', 'B2B'],
    requiresAccount: true,
    estimatedTime: '8 min'
  },
  {
    name: 'Betabound',
    url: 'https://betabound.com',
    submissionUrl: 'https://betabound.com/submit',
    description: 'Beta product announcements',
    category: 'Technology',
    tags: ['Beta', 'AI', 'Tools'],
    requiresAccount: true,
    estimatedTime: '10 min'
  },

  // Tech news aggregators
  {
    name: 'Hacker News (Show HN)',
    url: 'https://news.ycombinator.com',
    submissionUrl: 'https://news.ycombinator.com/submit',
    description: 'Show HN: Community tech news',
    category: 'Technology',
    tags: ['Show HN', 'AI', 'Developer'],
    requiresAccount: true,
    estimatedTime: '5 min'
  },
  {
    name: 'Reddit r/llmpricing',
    url: 'https://www.reddit.com/r/llmpricing',
    submissionUrl: 'https://www.reddit.com/r/llmpricing/submit',
    description: 'LLM pricing discussions',
    category: 'Community',
    tags: ['Reddit', 'LLM', 'Pricing'],
    requiresAccount: true,
    estimatedTime: '5 min'
  },
  {
    name: 'Reddit r/ai',
    url: 'https://www.reddit.com/r/ai',
    submissionUrl: 'https://www.reddit.com/r/ai/submit',
    description: 'AI community',
    category: 'Community',
    tags: ['Reddit', 'AI', 'Tools'],
    requiresAccount: true,
    estimatedTime: '5 min'
  },
  {
    name: 'Reddit r/machinelearning',
    url: 'https://www.reddit.com/r/machinelearning',
    submissionUrl: 'https://www.reddit.com/r/machinelearning/submit',
    description: 'Machine learning community',
    category: 'Community',
    tags: ['Reddit', 'ML', 'AI'],
    requiresAccount: true,
    estimatedTime: '5 min'
  },

  // GitHub related
  {
    name: 'GitHub Explore',
    url: 'https://github.com/explore',
    submissionUrl: 'https://github.com/new',
    description: 'GitHub repositories',
    category: 'Code',
    tags: ['GitHub', 'Open Source', 'AI'],
    requiresAccount: true,
    estimatedTime: '10 min'
  },
  {
    name: 'Awesome Lists',
    url: 'https://github.com/sindresorhus/awesome',
    submissionUrl: 'https://github.com/sindresorhus/awesome/pulls',
    description: 'Curated awesome lists',
    category: 'Resources',
    tags: ['Awesome', 'AI', 'LLM'],
    requiresAccount: true,
    estimatedTime: '15 min'
  },

  // AI tool aggregators (newer/smaller = easier to get in)
  {
    name: 'AI Scout',
    url: 'https://aiscout.io',
    submissionUrl: 'https://aiscout.io/submit',
    description: 'AI tools directory',
    category: 'AI',
    tags: ['AI', 'Tools', 'LLM'],
    requiresAccount: true,
    estimatedTime: '5 min'
  },
  {
    name: 'AI Finder',
    url: 'https://aifinder.io',
    submissionUrl: 'https://aifinder.io/submit',
    description: 'Find AI tools',
    category: 'AI',
    tags: ['AI', 'Search', 'Tools'],
    requiresAccount: true,
    estimatedTime: '5 min'
  },
  {
    name: 'ToolsPedia',
    url: 'https://toolspedia.io',
    submissionUrl: 'https://toolspedia.io/submit',
    description: 'AI tools encyclopedia',
    category: 'AI',
    tags: ['AI', 'Tools', 'Directory'],
    requiresAccount: true,
    estimatedTime: '5 min'
  }
];

// Submission templates
export const SUBMISSION_TEMPLATES = {
  shortDescription: `LLM PriceCompare - Free tool to compare LLM pricing across OpenAI, Anthropic, Google, xAI, Amazon, Meta, and more. Daily updates, cost calculator, smart recommendations.`,

  longDescription: `LLM PriceCompare is a free, open-source tool that helps developers and businesses compare LLM pricing across all major providers.

We track 32+ models from 9 providers:
• OpenAI (GPT-4, GPT-4o, GPT-3.5 Turbo)
• Anthropic (Claude 3 Opus, Sonnet, Haiku)
• Google (Gemini 1.5 Pro, Gemini Pro)
• xAI (Grok 4, Grok 3)
• Amazon (Nova)
• Meta (Llama)
• DeepSeek, Mistral & more

Features:
✓ Daily automated price updates via GitHub Actions
✓ Real-time cost calculator for monthly estimates
✓ Smart value scoring system
✓ Free tier detection
✓ Dark mode support
✓ SEO optimized with structured data
✓ Google Analytics integration

Perfect for developers, startups, and enterprises looking to optimize their AI costs.

Built with Next.js, TypeScript, and Tailwind CSS. 100% frontend, no backend required.`,

  tagline: 'Compare LLM pricing across all providers. Free. Daily updates.',

  keywords: [
    'LLM pricing',
    'AI cost calculator',
    'OpenAI pricing',
    'Claude pricing',
    'Gemini pricing',
    'Grok pricing',
    'AI comparison',
    'LLM comparison',
    'AI tools',
    'developer tools'
  ]
};

// Generate submission checklist
export function generateSubmissionChecklist(): string {
  let checklist = '# Directory Submission Checklist\n\n';

  DIRECTORIES.forEach((dir, index) => {
    checklist += `${index + 1}. **${dir.name}** (${dir.submissionUrl})\n`;
    checklist += `   - Category: ${dir.category}\n`;
    checklist += `   - Tags: ${dir.tags.join(', ')}\n`;
    checklist += `   - Account required: ${dir.requiresAccount ? 'Yes' : 'No'}\n`;
    checklist += `   - Estimated time: ${dir.estimatedTime}\n`;
    checklist += `   - Description: ${dir.description}\n\n`;
  });

  return checklist;
}

// Generate submission data for each directory
export function generateSubmissions(): Record<string, any>[] {
  return DIRECTORIES.map(dir => ({
    directory: dir.name,
    url: dir.submissionUrl,
    title: PRODUCT_INFO.name,
    description: SUBMISSION_TEMPLATES.shortDescription,
    longDescription: SUBMISSION_TEMPLATES.longDescription,
    website: PRODUCT_INFO.url,
    category: dir.category,
    tags: [...PRODUCT_INFO.keywords, ...dir.tags],
    twitter: PRODUCT_INFO.twitter,
    github: PRODUCT_INFO.github,
    requiresAccount: dir.requiresAccount,
    estimatedTime: dir.estimatedTime
  }));
}

// CLI helper
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('\n=== LLM PriceCompare Directory Submission Guide ===\n');

  const mode = process.argv[2];

  if (mode === 'checklist') {
    console.log(generateSubmissionChecklist());
  } else if (mode === 'data') {
    const submissions = generateSubmissions();
    console.log(JSON.stringify(submissions, null, 2));
  } else {
    console.log('Usage:');
    console.log('  tsx directory-submitter.ts checklist  # Generate submission checklist');
    console.log('  tsx directory-submitter.ts data       # Generate submission data JSON');
    console.log('\nTotal directories:', DIRECTORIES.length);
    console.log('\nRecommended order: Start with AI-specific directories (Futurepedia, ThereIsAnAIForThat)');
    console.log('Then move to dev tools (DevHunt, Product Hunt)');
    console.log('Finally, community sites (Reddit, Hacker News)');
  }
}
