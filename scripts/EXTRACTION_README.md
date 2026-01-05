# LLM Pricing Extraction

Extract pricing from documentation URLs using LLM and merge into the database.

## Setup

Add to `.env`:
```bash
EXTRACTION_API_KEY=your_key
EXTRACTION_BASE_URL=https://api.openai.com/v1
EXTRACTION_MODEL=gpt-4-turbo
```

## Local Usage

```bash
# Preview only
npm run extract -- "https://docs.x.ai/docs/models/grok-4-1-fast-reasoning"

# Extract and merge
npm run extract-and-merge -- "https://docs.x.ai/docs/models/grok-4-1-fast-reasoning"

# Batch from file
npm run extract -- scripts/urls.json --batch
```

## GitHub Actions

**Required Secrets:**
- `EXTRACTION_API_KEY`
- `EXTRACTION_BASE_URL`
- `EXTRACTION_MODEL`

**Usage:**
1. Go to: GitHub → Actions → LLM Pricing Extraction → Run workflow
2. Enter URL OR batch file path (e.g., `scripts/urls.json`)
3. Auto-merge defaults to `true` (writes to pricing.json)

**Batch file format:**
```json
[
  {"url": "https://docs.x.ai/docs/models/grok-4-1-fast-reasoning", "provider": "xAI"},
  {"url": "https://openai.com/pricing", "provider": "OpenAI"}
]
```

## How It Works

1. Fetches HTML from URL
2. Cleans and extracts text
3. LLM extracts pricing data
4. Merges into `src/data/pricing.json`
5. Creates PR with changes (if auto-merge enabled)

## Files

- `llm-extract.ts` - Extraction engine
- `merge-pricing.ts` - Merge utility
- `extract-and-merge.ts` - Combined workflow
- `urls.example.json` - Batch template
- `.github/workflows/llm-extract.yml` - GitHub Actions
