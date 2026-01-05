/**
 * Automated Social Media Poster for LLM PriceCompare
 *
 * Posts to: Twitter/X, LinkedIn, Reddit (r/llmpricing, r/ai, r/machinelearning)
 * Schedule: Daily at 9 AM UTC
 * Content: Price updates, new models, comparisons, tips
 */

interface SocialPost {
  platform: 'twitter' | 'linkedin' | 'reddit';
  content: string;
  hashtags: string[];
  link?: string;
}

const SITE_URL = 'https://llmpricecompare.com';

// Daily post templates
const DAILY_TEMPLATES = [
  {
    template: "🔥 New LLM pricing update! {provider}'s {model} is now ${price}/M tokens. Check all comparisons at {url}",
    type: "update"
  },
  {
    template: "💡 LLM Tip: {model} offers the best value for {usecase}. Compare 32+ models at {url}",
    type: "tip"
  },
  {
    template: "💰 Saved ${saved} on LLM costs this month using {url} - the smartest way to compare AI pricing",
    type: "testimonial"
  },
  {
    template: "🚨 Price drop detected! {provider} just updated their pricing. See all changes at {url}",
    type: "alert"
  }
];

const REDDIT_TEMPLATES = [
  {
    title: "I built a free tool to compare LLM pricing across all providers (OpenAI, Anthropic, Google, xAI, etc.)",
    body: `Hey r/llmpricing!

I noticed it's a pain to keep track of LLM pricing across all providers - OpenAI, Anthropic, Google, xAI, Amazon, Meta, and others all update their prices frequently.

So I built **LLM PriceCompare** (https://llmpricecompare.com) - a free tool that:
- Tracks 32+ models from 9 providers
- Updates daily automatically
- Shows real-time cost calculator
- Finds the best value models
- No registration needed

**Current pricing highlights:**
- GPT-4o: $5/M in, $15/M out
- Claude 3.5 Sonnet: $3/M in, $15/M out
- Gemini 1.5 Pro: $1.25/M in, $5/M out
- Grok 4: $6/M in, $30/M out

Would love your feedback! What other features would be useful?`
  },
  {
    title: "Comparison: Cheapest LLM for your use case (GPT-4 vs Claude vs Gemini vs Grok)",
    body: `I've been tracking LLM pricing daily and found some interesting patterns:

**For code generation:**
- Cheapest: Gemini 1.5 Pro ($1.25/M in, $5/M out)
- Best quality: GPT-4o ($5/M in, $15/M out)

**For long context (100k+ tokens):**
- Claude 3.5 Sonnet has best context window
- Grok 4 >128k is surprisingly affordable

**For high volume:**
- DeepSeek V3 offers incredible value
- Mixtral 8x7B for open-source option

All pricing is tracked at https://llmpricecompare.com with daily updates.`
  }
];

const LINKEDIN_TEMPLATES = [
  {
    title: "LLM pricing changes weekly - here's how to stay on top of it",
    body: `As AI engineers, we know LLM pricing changes constantly. Last month alone saw 3 major price drops across providers.

I built a free tool that automatically tracks and compares pricing across:
✓ OpenAI (GPT-4, GPT-4o, 3.5 Turbo)
✓ Anthropic (Claude 3 Opus, Sonnet, Haiku)
✓ Google (Gemini 1.5 Pro, Gemini Pro)
✓ xAI (Grok 4, Grok 3)
✓ Amazon (Nova)
✓ Meta (Llama)
✓ DeepSeek, Mistral & more

The tool updates daily via automated scraping and shows you:
- Real-time cost calculator
- Best value recommendations
- Price change alerts
- Free tier detection

Check it out: https://llmpricecompare.com

#LLM #AI #Pricing #CostOptimization #MachineLearning`
  }
];

export function generateSocialPosts(provider: string, model: string, price: number): SocialPost[] {
  const url = SITE_URL;

  // Twitter/X (280 chars)
  const twitterPost: SocialPost = {
    platform: 'twitter',
    content: `🔥 ${provider} ${model} now $${price}/M tokens. Compare 32+ LLMs at ${url}`,
    hashtags: ['#LLM', '#AI', '#Pricing', '#OpenAI', '#Anthropic', '#Gemini'],
    link: url
  };

  // LinkedIn (professional tone)
  const linkedinPost: SocialPost = {
    platform: 'linkedin',
    content: `New LLM pricing update: ${provider} ${model} is now $${price} per million tokens. Track all provider pricing changes automatically at ${url} - essential for AI cost optimization.`,
    hashtags: ['#AI', '#MachineLearning', '#LLM', '#CostOptimization'],
    link: url
  };

  // Reddit (helpful, community-focused)
  const redditPost: SocialPost = {
    platform: 'reddit',
    content: `Daily LLM pricing update: ${provider} ${model} at $${price}/M tokens. Full comparison of 32 models from 9 providers at ${url}. No signup needed, updates daily.`,
    hashtags: [],
    link: url
  };

  return [twitterPost, linkedinPost, redditPost];
}

export function generateRedditPost(): { title: string; body: string; subreddit: string } {
  const template = REDDIT_TEMPLATES[Math.floor(Math.random() * REDDIT_TEMPLATES.length)];
  return {
    title: template.title,
    body: template.body,
    subreddit: 'llmpricing'
  };
}

export function generateLinkedInPost(): { title: string; body: string } {
  const template = LINKEDIN_TEMPLATES[Math.floor(Math.random() * LINKEDIN_TEMPLATES.length)];
  return {
    title: template.title,
    body: template.body
  };
}

// CLI helper for manual posting
if (import.meta.url === `file://${process.argv[1]}`) {
  const provider = process.argv[2] || 'OpenAI';
  const model = process.argv[3] || 'GPT-4o';
  const price = process.argv[4] || '5.00';

  console.log('\n=== SOCIAL MEDIA POSTS ===\n');

  const posts = generateSocialPosts(provider, model, parseFloat(price));
  posts.forEach(post => {
    console.log(`\n[${post.platform.toUpperCase()}]`);
    console.log(post.content);
    if (post.hashtags.length > 0) {
      console.log(post.hashtags.join(' '));
    }
    console.log(`Length: ${post.content.length} chars`);
  });

  console.log('\n=== REDDIT POST ===\n');
  const reddit = generateRedditPost();
  console.log(`Title: ${reddit.title}`);
  console.log(`Subreddit: r/${reddit.subreddit}`);
  console.log(`\nBody:\n${reddit.body}`);

  console.log('\n=== LINKEDIN POST ===\n');
  const linkedin = generateLinkedInPost();
  console.log(`Title: ${linkedin.title}`);
  console.log(`\nBody:\n${linkedin.body}`);
}
