/**
 * Automated Backlink Outreach Generator
 *
 * Generates personalized outreach emails for backlinks
 * Targets: AI blogs, tech sites, LLM comparison articles
 */

interface OutreachTarget {
  name: string;
  website: string;
  email?: string;
  twitter?: string;
  type: 'blog' | 'directory' | 'article';
  pitchAngle: string;
}

const SITE_INFO = {
  name: 'LLM PriceCompare',
  url: 'https://llmpricecompare.com',
  description: 'Free LLM pricing comparison tool',
  uniqueValue: 'Daily automated updates via GitHub Actions + 32 models from 9 providers'
};

// Outreach targets (curated list)
export const OUTREACH_TARGETS: OutreachTarget[] = [
  // AI/ML blogs
  {
    name: 'The Batch by DeepLearning.AI',
    website: 'https://www.deeplearning.ai/the-batch',
    type: 'blog',
    pitchAngle: 'Resource for your readers on LLM pricing'
  },
  {
    name: 'AI Breakfast',
    website: 'https://aibreakfast.beehiiv.com',
    type: 'blog',
    pitchAngle: 'Daily LLM pricing updates for your newsletter'
  },
  {
    name: 'Last Week in AI',
    website: 'https://lastweekin.ai',
    type: 'blog',
    pitchAngle: 'Comprehensive LLM pricing comparison tool'
  },

  // Tech blogs
  {
    name: 'Hacker News Newsletter',
    website: 'https://news.ycombinator.com',
    type: 'blog',
    pitchAngle: 'Show HN: Free LLM pricing comparison tool'
  },
  {
    name: 'Indie Hackers',
    website: 'https://www.indiehackers.com',
    type: 'blog',
    pitchAngle: 'Tool for indie developers to save on AI costs'
  },
  {
    name: 'Product Hunt Blog',
    website: 'https://www.producthunt.com/blog',
    type: 'blog',
    pitchAngle: 'Featured tool for AI developers'
  },

  // AI tool directories (for backlinks)
  {
    name: 'Futurepedia',
    website: 'https://www.futurepedia.io',
    type: 'directory',
    pitchAngle: 'Add to your LLM tools directory'
  },
  {
    name: 'There Is An AI For That',
    website: 'https://theresanaiforthat.com',
    type: 'directory',
    pitchAngle: 'Comprehensive pricing comparison tool'
  },

  // LLM comparison articles (guest post opportunities)
  {
    name: 'Medium AI Publications',
    website: 'https://medium.com/tag/ai',
    type: 'article',
    pitchAngle: 'Guest post: "The Complete Guide to LLM Pricing in 2026"'
  },
  {
    name: 'Dev.to AI Community',
    website: 'https://dev.to/t/ai',
    type: 'article',
    pitchAngle: 'Technical article on LLM cost optimization'
  },

  // GitHub READMEs (link exchange)
  {
    name: 'Awesome LLMs',
    website: 'https://github.com/llm-projects/awesome-llms',
    type: 'directory',
    pitchAngle: 'Add to LLM resources list'
  },
  {
    name: 'Awesome Open Source AI',
    website: 'https://github.com/awesome-ai/awesome-open-source-ai',
    type: 'directory',
    pitchAngle: 'Open source AI tool directory'
  },

  // Reddit communities (for organic mentions)
  {
    name: 'r/llmpricing',
    website: 'https://www.reddit.com/r/llmpricing',
    type: 'article',
    pitchAngle: 'Community resource for pricing discussions'
  },
  {
    name: 'r/machinelearning',
    website: 'https://www.reddit.com/r/machinelearning',
    type: 'article',
    pitchAngle: 'Tool for ML practitioners'
  },

  // Tech news sites
  {
    name: 'TechCrunch AI',
    website: 'https://techcrunch.com/category/ai',
    type: 'blog',
    pitchAngle: 'New tool for AI cost management'
  },
  {
    name: 'VentureBeat AI',
    website: 'https://venturebeat.com/category/ai',
    type: 'blog',
    pitchAngle: 'AI pricing transparency tool'
  },

  // Developer newsletters
  {
    name: 'TLDR AI',
    website: 'https://tldr.tech/ai',
    type: 'blog',
    pitchAngle: 'Daily LLM pricing updates for your readers'
  },
  {
    name: 'The AI Breakdown',
    website: 'https://theaibreakdown.com',
    type: 'blog',
    pitchAngle: 'Resource for AI cost comparisons'
  },

  // Niche AI communities
  {
    name: 'LlamaIndex Blog',
    website: 'https://www.llamaindex.ai/blog',
    type: 'blog',
    pitchAngle: 'Tool for LlamaIndex users to compare LLM costs'
  },
  {
    name: 'LangChain Community',
    website: 'https://github.com/langchain-ai/langchain',
    type: 'directory',
    pitchAngle: 'Useful tool for LangChain developers'
  }
];

// Email templates
export const EMAIL_TEMPLATES = {
  guestPost: (target: OutreachTarget) => ({
    subject: `Guest Post: "The Complete Guide to LLM Pricing in 2026" for ${target.name}`,
    body: `Hi,

I'm the creator of LLM PriceCompare (https://llmpricecompare.com), a free tool that helps developers compare LLM pricing across OpenAI, Anthropic, Google, xAI, and more.

I'd love to contribute a guest post for your blog:

Title: "The Complete Guide to LLM Pricing in 2026: How to Save 80% on AI Costs"

Content outline:
- Why LLM pricing matters (real cost examples)
- Comparison of 9 providers (32 models)
- Hidden costs to watch for
- Cost optimization strategies
- How our tool helps (with daily updates)

The post would be 1500-2000 words, fully researched, with actionable insights.

Would you be interested in publishing this?

Best,
LLM PriceCompare
https://llmpricecompare.com`
  }),

  resourceLink: (target: OutreachTarget) => ({
    subject: `Free resource for your ${target.name} readers`,
    body: `Hi,

I noticed you cover AI/LLM topics at ${target.website}.

I built a free tool that might be valuable for your audience: LLM PriceCompare (https://llmpricecompare.com).

It's a comprehensive LLM pricing comparison tool with:
• 32+ models from 9 providers
• Daily automated updates
• Real-time cost calculator
• Smart value recommendations

Would you consider adding it to your resources/tools page? It's completely free and helps developers save money on AI costs.

Thanks for your time!

Best,
LLM PriceCompare`
  }),

  directoryAdd: (target: OutreachTarget) => ({
    subject: `Add LLM PriceCompare to ${target.name}`,
    body: `Hello ${target.name} team,

I'd like to submit LLM PriceCompare to your directory.

Tool Details:
Name: LLM PriceCompare
URL: https://llmpricecompare.com
Description: Free tool to compare LLM pricing across OpenAI, Anthropic, Google, xAI, Amazon, Meta, DeepSeek, Mistral, and more.

Key Features:
• Daily automated price updates
• Real-time cost calculator
• Smart value scoring
• 32+ models tracked
• No registration required

Category: Developer Tools / AI

Would love to be listed in your directory!

Best,
LLM PriceCompare`
  }),

  showHN: (target: OutreachTarget) => ({
    subject: `Show HN: LLM PriceCompare - Free LLM pricing comparison tool`,
    body: `Show HN: LLM PriceCompare - Free tool to compare LLM pricing across all providers

I built a free tool to solve a problem I had: keeping track of LLM pricing across all providers.

Website: https://llmpricecompare.com
GitHub: https://github.com/SumitLubal/llm-cost-compass

Features:
• Tracks 32+ models from 9 providers (OpenAI, Anthropic, Google, xAI, Amazon, Meta, DeepSeek, Mistral)
• Daily automated updates via GitHub Actions
• Real-time cost calculator for monthly estimates
• Smart value scoring system
• Dark mode support
• 100% frontend, no backend required

The pricing data is scraped daily from official sources and verified. The tool is built with Next.js, TypeScript, and Tailwind CSS.

Would love your feedback!`
  }),

  redditPost: (target: OutreachTarget) => ({
    subject: `New tool for ${target.name} - LLM pricing comparison`,
    body: `Hey ${target.name} community,

I built a free tool that might be useful: LLM PriceCompare (https://llmpricecompare.com)

It compares LLM pricing across:
- OpenAI (GPT-4, GPT-4o, 3.5 Turbo)
- Anthropic (Claude 3 Opus, Sonnet, Haiku)
- Google (Gemini 1.5 Pro, Gemini Pro)
- xAI (Grok 4, Grok 3)
- Amazon (Nova)
- Meta (Llama)
- DeepSeek, Mistral & more

Features:
✓ Daily price updates
✓ Cost calculator
✓ Value recommendations
✓ Free tier detection

No signup needed. Would love your feedback!`
  })
};

// Generate outreach plan
export function generateOutreachPlan(): string {
  let plan = '# LLM PriceCompare Outreach Plan\n\n';
  plan += '## Priority Order\n\n';

  const byPriority = OUTREACH_TARGETS.sort((a, b) => {
    const priority = { 'article': 1, 'blog': 2, 'directory': 3 };
    return priority[a.type] - priority[b.type];
  });

  let blogCount = 0, articleCount = 0, dirCount = 0;

  byPriority.forEach((target, index) => {
    const template = target.type === 'article' ? 'guestPost' :
                     target.type === 'blog' ? 'resourceLink' : 'directoryAdd';

    plan += `${index + 1}. **${target.name}** (${target.type})\n`;
    plan += `   Website: ${target.website}\n`;
    plan += `   Angle: ${target.pitchAngle}\n`;
    plan += `   Template: ${template}\n\n`;

    if (target.type === 'blog') blogCount++;
    if (target.type === 'article') articleCount++;
    if (target.type === 'directory') dirCount++;
  });

  plan += `## Summary\n`;
  plan += `- Total targets: ${OUTREACH_TARGETS.length}\n`;
  plan += `- Blogs/Newsletters: ${blogCount}\n`;
  plan += `- Article/Guest Post: ${articleCount}\n`;
  plan += `- Directories: ${dirCount}\n\n`;

  plan += `## Strategy\n`;
  plan += `1. Week 1: Submit to directories (quick wins)\n`;
  plan += `2. Week 2: Reach out to blogs with resource link\n`;
  plan += `3. Week 3: Pitch guest posts\n`;
  plan += `4. Week 4: Community engagement (Reddit, Indie Hackers)\n\n`;

  plan += `## Success Metrics\n`;
  plan += `- 10+ directory listings\n`;
  plan += `- 5+ blog mentions\n`;
  plan += `- 2+ guest posts published\n`;
  plan += `- 50+ backlinks total\n`;

  return plan;
}

// Generate personalized email for a specific target
export function generateOutreachEmail(targetName: string): { subject: string; body: string } | null {
  const target = OUTREACH_TARGETS.find(t => t.name.toLowerCase().includes(targetName.toLowerCase()));

  if (!target) {
    console.error(`Target "${targetName}" not found`);
    return null;
  }

  let template: keyof typeof EMAIL_TEMPLATES;

  if (target.type === 'article') template = 'guestPost';
  else if (target.type === 'blog') template = 'resourceLink';
  else template = 'directoryAdd';

  return EMAIL_TEMPLATES[template](target);
}

// CLI helper
if (import.meta.url === `file://${process.argv[1]}`) {
  const mode = process.argv[2];
  const targetName = process.argv[3];

  if (mode === 'plan') {
    console.log(generateOutreachPlan());
  } else if (mode === 'email' && targetName) {
    const email = generateOutreachEmail(targetName);
    if (email) {
      console.log('\n=== OUTREACH EMAIL ===\n');
      console.log(`Subject: ${email.subject}\n`);
      console.log(email.body);
    }
  } else {
    console.log('Usage:');
    console.log('  tsx backlink-outreach.ts plan              # Generate outreach plan');
    console.log('  tsx backlink-outreach.ts email <target>    # Generate email for target');
    console.log('\nExample:');
    console.log('  tsx backlink-outreach.ts email "Futurepedia"');
  }
}
