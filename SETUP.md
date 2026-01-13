# Setup Guide - LLM PriceCheck

This guide will help you get LLM PriceCheck running with automated daily updates.

## Step 1: Local Development Setup

### 1.1 Install Dependencies
```bash
npm install
```

### 1.2 Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

**Note:** The app will work immediately with the pre-loaded pricing data in `src/data/pricing.json`.

## Step 2: Set Up Email Alerts (Optional but Recommended)

### 2.1 Get a Resend API Key
1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Copy the key (starts with `re_`)

### 2.2 Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# .env.local
RESEND_API_KEY="re_1234567890abcdef..."
ALERT_EMAIL="sumitlubal@hotmail.com"
```

### 2.3 Test Email Sending
```bash
# Test with sample changes
npm run email:test sumitlubal@hotmail.com
```



## Step 4: Deploy to Production

### Option A: Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Add environment variables (if using email)
vercel env add RESEND_API_KEY
vercel env add ALERT_EMAIL
```

### Option B: Netlify

```bash
# 1. Install Netlify CLI
npm i -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy --prod
```

### Option C: Push to GitHub + Vercel Auto-Deploy

1. Push your code to GitHub
2. Connect repository to Vercel
3. Vercel will auto-deploy on every push



## Step 6: User Submissions

Users can submit pricing at `yourdomain.com/submit`:
- Form collects provider, model, pricing info
- Sends email to you
- You manually verify and update

### To Enable User Submissions

1. Ensure `RESEND_API_KEY` is set
2. The form at `/submit` will work automatically
3. Submissions go to your `ALERT_EMAIL`

## Step 7: Scraping & Data Sources

### How Scraping Works

The scraper uses a **hybrid approach**:

1. **Primary Source**: Verified mock data (always accurate)
2. **Monitoring**: llm-prices.com API for change detection
3. **Fallback**: If API fails, uses verified data

### Why This Approach?

The llm-prices.com API has inconsistent units:
- Some models: per 1,000 tokens
- Others: per 1 million tokens

This makes direct use risky. Instead:
- ✅ Use verified data for actual pricing
- ✅ Use API to detect potential changes
- ✅ Flag discrepancies for manual review

### 7.1 Customizing Scraping

To add real scraping:

#### Option A: Use Playwright for dynamic sites

```typescript
import { chromium } from 'playwright';

async function scrapeOpenAI() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://openai.com/pricing');

  const prices = await page.evaluate(() => {
    // Extract pricing from page
    return { /* ... */ };
  });

  await browser.close();
  return prices;
}
```

#### Option B: LLM-assisted extraction

```typescript
import OpenAI from 'openai';

async function extractPricing(url: string) {
  const openai = new OpenAI();
  const content = await fetch(url).then(r => r.text());

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{
      role: 'user',
      content: `Extract pricing from this HTML: ${content}`
    }]
  });

  return JSON.parse(response.choices[0].message.content);
}
```

#### Option C: Update verified data directly

Edit `VERIFIED_PRICING` in `scripts/scrape-providers.ts` to update prices manually.

## Step 8: Monitoring & Maintenance

### Check Daily Updates
1. GitHub Actions → Daily Pricing Update
2. Look for green checkmarks
3. Review any PRs created

### Troubleshooting

**No emails received?**
```bash
# Check if API key is set
echo $RESEND_API_KEY

# Test email manually
npm run email:test your@email.com
```

**Scraping failing?**
- Some sites use JavaScript rendering
- Update scraper to use Playwright/Puppeteer
- Or use LLM-assisted extraction

**Data not updating?**
- Check GitHub Actions logs
- Verify cron schedule is correct
- Manual trigger to test

## Step 9: Scaling Up

### Add More Providers

1. Add to `src/data/pricing.json`
2. Update scraper in `scripts/scrape-providers.ts`
3. Daily job will handle the rest

### Increase Update Frequency

Edit `.github/workflows/daily-pricing-update.yml`:
```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
```

### Add More Email Recipients

Modify `scripts/send-email.ts` to send to multiple addresses.

## Summary

✅ **Done!** Your LLM PriceCheck is now:
- Running locally for development
- Deployed to production (if you deployed)
- Updating daily via GitHub Actions
- Sending email alerts
- Accepting user submissions

**Next Steps:**
- Test the search functionality
- Try the cost calculator
- Submit test pricing data
- Verify dark mode works

**Questions?** Check `README.md` or open an issue!
