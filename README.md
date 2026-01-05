# LLM PriceCheck 💎

**Smart LLM pricing comparison that always shows you better alternatives.**

## Features

✅ **Always Show Better/Free Options** - Never overpay again
✅ **Auto-Updated Pricing** - Daily scraping with LLM extraction
✅ **Smart Comparisons** - Find hidden gems and best value
✅ **User Submissions** - Community-driven accuracy
✅ **Email Alerts** - Get notified of price changes
✅ **No Hiding Providers** - All pricing visible, always

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

**Required:**
- `EXTRACTION_API_KEY` - Your OpenAI or compatible API key
- `RESEND_API_KEY` - For email alerts (optional for beta)
- `ALERT_EMAIL` - Your email for notifications

### 3. Seed Database
```bash
npm run db:seed
```

This populates the initial 5 providers:
- OpenAI (GPT-4o, GPT-4 Turbo, GPT-3.5)
- Anthropic (Claude 3 Opus, Sonnet, Haiku)
- Google (Gemini 1.5 Pro, Gemini Pro)
- Meta (Llama 3 70B, 8B)
- Mistral (Mixtral 8x7B, Mistral 7B)

### 4. Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## Usage

### Daily Updates
```bash
# Run manually
npm run db:scrape

# Or setup cron job (Vercel handles this automatically)
```

### Add New Providers
1. Submit via web form at `/submit`
2. Or manually add to database
3. System will scrape and auto-publish if confidence > 85%

## Architecture

```
┌─────────────────────────────────────┐
│  Next.js Frontend (App Router)      │
│  - Comparison Table                 │
│  - Smart Suggestions                │
│  - Submission Form                  │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  SQLite Database                    │
│  - providers                        │
│  - pricing                          │
│  - submissions                      │
│  - price_history                    │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  LLM Extraction Pipeline            │
│  - Web scraping                     │
│  - LLM-assisted parsing             │
│  - Auto-publish (confidence > 0.85) │
│  - Email alerts                     │
└─────────────────────────────────────┘
```

## API Configuration

The system uses any OpenAI-compatible API for extraction:

```bash
# OpenAI
EXTRACTION_BASE_URL=https://api.openai.com/v1
EXTRACTION_MODEL=gpt-4-turbo

# Azure OpenAI
EXTRACTION_BASE_URL=https://your-resource.openai.azure.com
EXTRACTION_MODEL=gpt-4

# Together AI
EXTRACTION_BASE_URL=https://api.together.xyz/v1
EXTRACTION_MODEL=meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo
```

## Deployment

### Vercel (Recommended)
```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Initial commit"
git push origin main

# 2. Import to Vercel
# 3. Add environment variables in Vercel dashboard
# 4. Deploy
```

### Environment Variables on Vercel:
- `EXTRACTION_API_KEY`
- `EXTRACTION_BASE_URL` (optional)
- `EXTRACTION_MODEL` (optional)
- `RESEND_API_KEY` (optional)
- `ALERT_EMAIL` (optional)

## Beta Testing Checklist

- [ ] Clone and install
- [ ] Add your API key to `.env.local`
- [ ] Run `npm run db:seed`
- [ ] Start dev server: `npm run dev`
- [ ] Test search functionality
- [ ] Submit test pricing data
- [ ] Verify comparison logic
- [ ] Test on mobile/responsive

## Roadmap

- [ ] Web monitoring for new providers
- [ ] Historical price trends
- [ ] Cost calculator for specific tasks
- [ ] Bulk CSV upload for comparison
- [ ] API access for developers
- [ ] Slack/Discord notifications
- [ ] More providers (100+)

## Contributing

Found a pricing error? Submit via the form or open an issue!

## License

MIT - Built for Sumeet's beta launch