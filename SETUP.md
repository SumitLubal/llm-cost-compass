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
ALERT_EMAIL="your-email@example.com"
```

### 2.3 Test Email Sending
```bash
# Test with sample changes
npm run email:test your-email@example.com
```

## Step 3: Set Up Automated Daily Updates

### Option A: GitHub Actions (Recommended - Zero Maintenance)

#### 3.1 Fork the Repository
1. Go to GitHub and fork this repository
2. Clone your fork locally

#### 3.2 Add GitHub Secrets
1. Go to your repository on GitHub
2. Settings → Secrets and variables → Actions
3. Add these secrets:

| Secret | Description | Example |
|--------|-------------|---------|
| `RESEND_API_KEY` | Your Resend API key | `re_123456...` |
| `ALERT_EMAIL` | Your email for alerts | `you@example.com` |

#### 3.3 Enable GitHub Actions
1. Go to Actions tab
2. Click "I understand my workflows"
3. The daily job will run automatically at 9 AM UTC

#### 3.4 Manual Trigger
You can also trigger it manually:
1. Go to Actions → Daily Pricing Update
2. Click "Run workflow"
3. Choose auto-publish option

### Option B: Run Manually

```bash
# Just scrape and compare (no email)
npm run scrape

# Full update with email
npm run daily:update your@email.com

# Auto-publish high-confidence changes
npm run daily:update your@email.com --auto-publish
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

## Step 5: Understanding the Workflow

### Daily Update Flow

```
9 AM UTC (GitHub Actions)
    ↓
Scrape providers for pricing
    ↓
Compare with existing data
    ↓
Changes detected?
    ├─ YES → Send email with diff
    │         ├─ Auto-publish if confidence > 90%
    │         └─ OR create PR for review
    └─ NO → Skip (no action needed)
```

### Email You'll Receive

```
Subject: 🚨 LLM Pricing Update: 3 changes (2 high-confidence)

📊 LLM PriceCheck Daily Report

Found 3 pricing changes across providers (2 high-confidence).

┌─────────┬──────────┬────────┬───────┬───────┬────────┬──────┐
│ Provider│ Model    │ Type   │ Old   │ New   │ Change │ Conf │
├─────────┼──────────┼────────┼───────┼───────┼────────┼──────┤
│ OpenAI  │ GPT-4o   │ Input  │ $5.00 │ $4.50 │ ↓ 10%  │ 95%  │
│ Google  │ Gemini...│ Output │ $1.50 │ $1.25 │ ↓ 17%  │ 90%  │
│ Anthropic│ Claude...│ Input │ $15.00│ $14.50│ ↓ 3%   │ 75%  │
└─────────┴──────────┴────────┴───────┴───────┴────────┴──────┘

[Review on GitHub] [View Live Site]
```

## Step 6: User Submissions

Users can submit pricing at `yourdomain.com/submit`:
- Form collects provider, model, pricing info
- Sends email to you
- You manually verify and update

### To Enable User Submissions

1. Ensure `RESEND_API_KEY` is set
2. The form at `/submit` will work automatically
3. Submissions go to your `ALERT_EMAIL`

## Step 7: Customizing Scraping

The default scraper uses mock data. To scrape real prices:

### 7.1 Update `scripts/scrape-providers.ts`

```typescript
// Example: Using Playwright for dynamic sites
import { chromium } from 'playwright';

async function scrapeOpenAI() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://openai.com/pricing');

  // Extract pricing data
  const prices = await page.evaluate(() => {
    // Your scraping logic here
    return {
      provider: 'OpenAI',
      models: [...]
    };
  });

  await browser.close();
  return prices;
}
```

### 7.2 Or Use LLM-Assisted Extraction

```typescript
import OpenAI from 'openai';

async function extractPricingFromURL(url: string) {
  const openai = new OpenAI();

  // Fetch page content
  const content = await fetch(url).then(r => r.text());

  // Ask LLM to extract pricing
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
