# LLM PriceCheck 🎯

A smart LLM pricing comparison tool that helps you find the best AI model prices instantly.

## Architecture

This is a **frontend-only** Next.js application with automated daily pricing updates.

### How It Works

```
┌─────────────────────────────────────────┐
│  Daily GitHub Action (Cron)             │
│  1. Fetches from llm-prices.com API     │
│  2. Compares with verified data         │
│  3. Flags changes for review            │
│  4. Sends email alerts                  │
│  5. Creates PR or auto-publishes        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Frontend (Vercel/Netlify)              │
│  - Reads pricing.json                   │
│  - Client-side search/filter            │
│  - Cost calculator                      │
│  - Theme toggle (light/dark)            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Email Alerts (Resend)                  │
│  - Daily changes notification           │
│  - Review & approval workflow           │
└─────────────────────────────────────────┘
```

**Note**: The scraper uses **verified pricing constants** for core providers (OpenAI, Anthropic, Google, Meta, Mistral) as the source of truth, with llm-prices.com API for change detection and to gather pricing data for all other providers. The API has inconsistent units (some per 1K tokens, some per million), so we convert all values to per-million tokens for consistency. This approach gives us 32 models from 9 providers instead of just 12 models from 5 providers.

## Features

- ✅ **Zero Backend** - No database server needed
- ✅ **Daily Updates** - Automated pricing scraping
- ✅ **Email Alerts** - Get notified of price changes
- ✅ **Smart Comparison** - Best value, best free, hidden gems
- ✅ **Cost Calculator** - Estimate your monthly bill
- ✅ **Dark Mode** - System-based theme switching
- ✅ **Search** - Find models by provider or name

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

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main page
│   ├── layout.tsx         # Root layout with ThemeProvider
│   └── submit/            # Submission page
├── components/            # React components
│   ├── ThemeProvider.tsx  # Theme context
│   ├── ThemeToggle.tsx    # Theme switcher
│   ├── SearchBar.tsx      # Search functionality
│   ├── CostCalculator.tsx # Cost estimation
│   ├── ComparisonView.tsx # Price comparison
│   ├── SubmitButton.tsx   # Submit CTA
│   └── SubmitForm.tsx     # User submission form
├── lib/                   # Utilities
│   └── pricing.ts         # Pricing utilities & data access
├── data/                  # Pricing data
│   ├── pricing.json       # Current prices
│   └── types.ts           # TypeScript types
└── scripts/               # Automation scripts
    ├── daily-update.ts    # Main update script
    ├── scrape-providers.ts # Web scraper
    ├── compare-pricing.ts  # Change detection
    └── send-email.ts       # Email alerts
.github/
└── workflows/
    └── daily-pricing-update.yml  # GitHub Actions
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

## Email Alerts

When pricing changes are detected, you'll receive an email with:

- Summary of changes
- Table showing old vs new prices
- Confidence scores
- Links to review and approve

### Confidence Levels

- **90-100%**: High confidence, auto-publish ready
- **70-89%**: Medium confidence, review recommended
- **<70%**: Low confidence, manual verification needed

## User Submissions

Users can submit pricing via `/submit` page:
- Form collects provider, model, pricing info
- Sends email to you for review
- You manually verify and update

## Theme System

- **System Default**: Follows OS preference
- **User Override**: Click toggle to switch
- **Persistent**: Saved to localStorage
- **No Flash**: Hydration-safe rendering

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

For email alerts:

```bash
# .env.local
RESEND_API_KEY="re_..."
ALERT_EMAIL="sumitlubal@hotmail.com"
```

For GitHub Actions, add these to repository secrets:
- `RESEND_API_KEY`
- `ALERT_EMAIL`

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

## License

MIT

## Built For

Sumeet - Beta v0.1
