# LLM PriceCheck 🎯

A smart LLM pricing comparison tool that helps you find the best AI model prices instantly.

## Architecture

This is a **frontend-only** Next.js application with automated daily pricing updates.

**Note**: The scraper uses **verified pricing constants** for core providers (OpenAI, Anthropic, Google, Meta, Mistral) as the source of truth, with llm-prices.com API for change detection and to gather pricing data for all other providers. The API has inconsistent units (some per 1K tokens, some per million), so we convert all values to per-million tokens for consistency. This approach gives us 32 models from 9 providers instead of just 12 models from 5 providers.

## GitHub Actions Workflows

### Daily Pricing Update
**File**: `.github/workflows/daily-pricing-update.yml`

**Manual Run**:
```bash
gh workflow run daily-pricing-update.yml
```

**Auto-merge**: `true` (writes directly to pricing.json)

**What it does**:
1. Scrapes pricing from llm-prices.com API
2. Compares with existing data
3. Sends email alerts for changes
4. Commits directly to main branch

### LLM Extraction Workflow
**File**: `.github/workflows/llm-extract.yml`

**Manual Run**:
```bash
# Single URL
gh workflow run llm-extract.yml -f url="https://docs.x.ai/docs/models/grok-4-1-fast-reasoning"

# Batch file
gh workflow run llm-extract.yml -f batch_file="urls.json"
```

**Auto-merge**: `true` (writes directly to pricing.json)

**What it does**:
1. Fetches pricing page content
2. Uses LLM to extract structured pricing
3. Formats data correctly
4. Merges into pricing.json
5. Commits directly to main branch

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 3. Daily Updates (Optional)

For automated daily updates with email alerts:

#### Option A: GitHub Actions (Recommended)

1. **Fork this repository**
2. **Add secrets to GitHub:**
   - `RESEND_API_KEY` - Your Resend API key
   - `ALERT_EMAIL` - Your email address
3. **Enable GitHub Actions**
4. **Daily updates run automatically at 9 AM UTC**

#### Option B: Manual Run

```bash
# Scrape and compare (no email)
npm run scrape

# Run full daily update with email
npm run daily:update sumitlubal@hotmail.com

# Auto-publish if confidence > 90%
npm run daily:update sumitlubal@hotmail.com --auto-publish
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run daily:update email@domain.com` | Run daily update with email |
| `npm run daily:update:auto` | Auto-publish high-confidence changes |
| `npm run scrape` | Scrape current pricing |
| `npm run compare` | Compare with existing data |
| `npm run email:test email@domain.com` | Test email sending |
| `npm run marketing:social` | Generate social media posts |
| `npm run marketing:directories` | Generate directory checklist |
| `npm run marketing:blog` | Generate content calendar |
| `npm run marketing:outreach` | Generate outreach plan |
| `npm run marketing:setup` | Setup marketing system |

## Marketing Scripts

All marketing scripts are in `scripts/marketing/`:

- **social-poster.ts** - Twitter/X, LinkedIn, Reddit posts
- **directory-submitter.ts** - 20+ directory submission checklist
- **blog-ideas.ts** - 30-day content calendar with SEO
- **backlink-outreach.ts** - Email templates for backlinks

## Data Architecture

### Verified Pricing Constants

The scraper contains `VERIFIED_PRICING` constants in `scripts/scrape-providers.ts`:

```typescript
const VERIFIED_PRICING = {
  'OpenAI': {
    'GPT-4o': {
      name: 'GPT-4o',
      input_per_million: 5.00,    // $5 per million tokens
      output_per_million: 15.00,  // $15 per million tokens
      context_window: 128000
    },
    // ... more models
  },
  // ... more providers
}
```

**Why this approach?**
- llm-prices.com API has inconsistent units (per 1K vs per million)
- Verified constants ensure accurate pricing
- API is only used for **change detection**
- You can easily update constants when prices change

### Pricing Data Format

Pricing data is stored in `src/data/pricing.json`:

```json
{
  "providers": [
    {
      "id": "openai",
      "name": "OpenAI",
      "models": [
        {
          "name": "GPT-4o",
          "input_per_million": 5.00,
          "output_per_million": 15.00,
          "context_window": 128000,
          "free_tier": null,
          "last_updated": "2026-01-04T00:00:00Z"
        }
      ]
    }
  ],
  "metadata": {
    "last_updated": "2026-01-04T00:00:00Z",
    "source": "scraped",
    "total_models": 12
  }
}
```

## User Submissions

Users can submit pricing via `/submit` page:
- Form collects provider, model, pricing info
- Sends email to you for review
- You manually verify and update

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## Environment Variables

### Required for Full Functionality

```bash
# .env.local

# Google Analytics 4 (Optional but recommended)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Email alerts (Optional - for daily updates)
NEXT_PUBLIC_RESEND_API_KEY="re_..."
NEXT_PUBLIC_ALERT_EMAIL="your-email@example.com"

# LLM Extraction (Optional - for LLM-based scraper)
EXTRACTION_API_KEY=sk-...
EXTRACTION_BASE_URL=https://api.openai.com/v1
EXTRACTION_MODEL=gpt-4-turbo
```

### GitHub Actions Secrets

For GitHub Actions workflows, add these to repository secrets:
- `RESEND_API_KEY` - For email alerts
- `ALERT_EMAIL` - Where to send notifications
- `EXTRACTION_API_KEY` - For LLM extraction workflow (optional)

### Minimal Setup

For basic local development without email/analytics:
```bash
# No .env file needed - the app works without these!
# Just run: npm run dev
```

### Production Deployment

For production, set these in your hosting provider:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Build & Deploy → Environment
- **Other**: Use your platform's env var management

## Cost

**Monthly Cost: $0**

- Frontend hosting: Free tier (Vercel/Netlify)
- GitHub Actions: 2,000 min/month free
- Email: Resend free tier (100 emails/day)
- Storage: Included in GitHub repo

## Troubleshooting

### No data showing
```bash
# Check if pricing.json exists
ls src/data/pricing.json

# If not, run the update script
npm run daily:update sumitlubal@hotmail.com
```

### Email not sending
- Check `RESEND_API_KEY` is set
- Verify email address format
- Check Resend dashboard for errors

### Scraping not working
- Some providers require JavaScript rendering
- Update `scripts/scrape-providers.ts` with actual scraping logic
- Use Playwright/Puppeteer for dynamic sites

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request
