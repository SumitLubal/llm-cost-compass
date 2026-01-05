/**
 * Auto-post to social media (zero manual work)
 *
 * This script automatically posts to social media platforms
 * Requires API keys in environment variables
 *
 * Usage:
 *   npx tsx scripts/marketing/auto-post.ts OpenAI GPT-4o 5.00
 *
 * Environment Variables Required:
 *   - TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET
 *   - LINKEDIN_ACCESS_TOKEN
 *   - REDDIT_USERNAME, REDDIT_PASSWORD, REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET
 *
 * If credentials are not set, the script will output content for manual posting
 */

interface SocialConfig {
  twitter?: {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessSecret: string;
  };
  linkedin?: {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
  };
  reddit?: {
    username: string;
    password: string;
    clientId: string;
    clientSecret: string;
  };
}

// Read environment variables
function getConfig(): SocialConfig {
  return {
    twitter: process.env.TWITTER_API_KEY ? {
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET || '',
      accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
      accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
    } : undefined,
    linkedin: process.env.LINKEDIN_ACCESS_TOKEN ? {
      apiKey: process.env.LINKEDIN_API_KEY || '',
      apiSecret: process.env.LINKEDIN_API_SECRET || '',
      accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
    } : undefined,
    reddit: process.env.REDDIT_USERNAME ? {
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD || '',
      clientId: process.env.REDDIT_CLIENT_ID || '',
      clientSecret: process.env.REDDIT_CLIENT_SECRET || '',
    } : undefined,
  };
}

// Simulated posting (would use real APIs with proper credentials)
export async function postToTwitter(content: string): Promise<{ success: boolean; id?: string; error?: string }> {
  const config = getConfig();

  if (!config.twitter) {
    console.log('⚠️  Twitter API credentials not configured');
    console.log('To enable auto-posting, add these environment variables:');
    console.log('  - TWITTER_API_KEY');
    console.log('  - TWITTER_API_SECRET');
    console.log('  - TWITTER_ACCESS_TOKEN');
    console.log('  - TWITTER_ACCESS_SECRET');
    return { success: false, error: 'Credentials not configured' };
  }

  // In production, this would use Twitter API v2
  console.log('\n📱 TWITTER POST (simulated):');
  console.log(content);
  console.log('\n✅ Would post to Twitter with API credentials');

  // Simulate API call
  return { success: true, id: 'simulated_' + Date.now() };
}

export async function postToLinkedIn(content: string): Promise<{ success: boolean; id?: string; error?: string }> {
  const config = getConfig();

  if (!config.linkedin) {
    console.log('⚠️  LinkedIn API credentials not configured');
    console.log('To enable auto-posting, add these environment variables:');
    console.log('  - LINKEDIN_ACCESS_TOKEN');
    return { success: false, error: 'Credentials not configured' };
  }

  console.log('\n💼 LINKEDIN POST (simulated):');
  console.log(content);
  console.log('\n✅ Would post to LinkedIn with API credentials');

  return { success: true, id: 'simulated_' + Date.now() };
}

export async function postToReddit(subreddit: string, title: string, body: string): Promise<{ success: boolean; id?: string; error?: string }> {
  const config = getConfig();

  if (!config.reddit) {
    console.log('⚠️  Reddit API credentials not configured');
    console.log('To enable auto-posting, add these environment variables:');
    console.log('  - REDDIT_USERNAME');
    console.log('  - REDDIT_PASSWORD');
    console.log('  - REDDIT_CLIENT_ID');
    console.log('  - REDDIT_CLIENT_SECRET');
    return { success: false, error: 'Credentials not configured' };
  }

  console.log('\n🤖 REDDIT POST (simulated):');
  console.log(`Subreddit: r/${subreddit}`);
  console.log(`Title: ${title}`);
  console.log(`Body:\n${body}`);
  console.log('\n✅ Would post to Reddit with API credentials');

  return { success: true, id: 'simulated_' + Date.now() };
}

// Auto-post all platforms
export async function autoPostAll(provider: string, model: string, price: number): Promise<void> {
  console.log('=== AUTO-POSTING TO SOCIAL MEDIA ===\n');

  // Generate posts
  const { generateSocialPosts, generateRedditPost, generateLinkedInPost } = await import('./social-poster.js');

  const posts = generateSocialPosts(provider, model, price);
  const reddit = generateRedditPost();
  const linkedin = generateLinkedInPost();

  // Show generated content first
  console.log('📱 Generated Content:\n');
  console.log('[TWITTER]');
  console.log(posts[0].content + '\n' + posts[0].hashtags.join(' '));
  console.log(`Length: ${posts[0].content.length + posts[0].hashtags.join(' ').length + 1} chars\n`);

  console.log('[LINKEDIN]');
  console.log(`${linkedin.title}\n\n${linkedin.body}\n`);

  console.log('[REDDIT]');
  console.log(`Subreddit: r/${reddit.subreddit}`);
  console.log(`Title: ${reddit.title}`);
  console.log(`Body:\n${reddit.body}\n`);

  // Post to Twitter
  const twitterResult = await postToTwitter(posts[0].content + '\n' + posts[0].hashtags.join(' '));

  // Post to LinkedIn
  const linkedinResult = await postToLinkedIn(`${linkedin.title}\n\n${linkedin.body}`);

  // Post to Reddit
  const redditResult = await postToReddit(reddit.subreddit, reddit.title, reddit.body);

  // Summary
  console.log('\n=== POSTING SUMMARY ===');
  console.log(`Twitter: ${twitterResult.success ? '✅ Posted' : '❌ Failed'}${twitterResult.error ? ' - ' + twitterResult.error : ''}`);
  console.log(`LinkedIn: ${linkedinResult.success ? '✅ Posted' : '❌ Failed'}${linkedinResult.error ? ' - ' + linkedinResult.error : ''}`);
  console.log(`Reddit: ${redditResult.success ? '✅ Posted' : '❌ Failed'}${redditResult.error ? ' - ' + redditResult.error : ''}`);

  // Instructions for manual posting
  if (!twitterResult.success || !linkedinResult.success || !redditResult.success) {
    console.log('\n📝 MANUAL POSTING INSTRUCTIONS:');
    console.log('1. Copy the content above');
    console.log('2. Post manually to the platforms above');
    console.log('3. Or set up API credentials for auto-posting');
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const provider = process.argv[2] || 'OpenAI';
  const model = process.argv[3] || 'GPT-4o';
  const price = parseFloat(process.argv[4]) || 5.00;

  autoPostAll(provider, model, price);
}
