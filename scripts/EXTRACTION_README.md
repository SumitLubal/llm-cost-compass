# LLM-Based Pricing Extraction System

This system uses LLMs to extract pricing information from provider documentation URLs and automatically merge it into the pricing database.

## Setup

### Environment Variables

Add these to your `.env` file:

```bash
# LLM Extraction API Configuration
# Use any OpenAI-compatible API (OpenAI, Azure, Together, xAI, etc.)
EXTRACTION_API_KEY=your_api_key_here
EXTRACTION_BASE_URL=https://api.openai.com/v1
EXTRACTION_MODEL=gpt-4-turbo
```

For xAI's API:
```bash
EXTRACTION_API_KEY=your_xai_key
EXTRACTION_BASE_URL=https://api.xiaomimimo.com/v1
EXTRACTION_MODEL=mimo-v2-flash
```

## Usage

### 1. Extract Pricing from a Single URL

```bash
# Basic extraction (shows results, doesn't modify files)
npm run extract -- "https://docs.x.ai/docs/models/grok-4-1-fast-reasoning"

# With provider hint
npm run extract -- "https://openai.com/pricing" --provider OpenAI
```

**Output:**
- Displays extracted pricing data
- Shows JSON format for pricing.json
- Does NOT modify any files

### 2. Extract and Merge into pricing.json

```bash
# Extract and automatically merge
npm run extract-and-merge -- "https://docs.x.ai/docs/models/grok-4-1-fast-reasoning"

# With provider hint
npm run extract-and-merge -- "https://openai.com/pricing" --provider OpenAI
```

**What it does:**
1. Extracts pricing from the URL
2. Shows the extracted data
3. Merges into `src/data/pricing.json`
4. Shows what changed

### 3. Batch Extraction from Multiple URLs

Create a JSON file with URLs:

```json
[
  {
    "url": "https://docs.x.ai/docs/models/grok-4-1-fast-reasoning",
    "provider": "xAI"
  },
  {
    "url": "https://openai.com/pricing",
    "provider": "OpenAI"
  },
  {
    "url": "https://www.anthropic.com/pricing",
    "provider": "Anthropic"
  }
]
```

Then run:

```bash
npm run extract -- urls.json --batch
```

### 4. Manual Merge

If you already have JSON data and want to merge it:

```bash
npm run merge -- xai '{"id":"xai","name":"xAI","models":[{"name":"Grok 4","input_per_million":3,"output_per_million":15,"context_window":128000}]}'
```

## How It Works

### Extraction Process

1. **Fetch**: Downloads the HTML from the documentation URL
2. **Clean**: Extracts text content, removes HTML tags
3. **LLM Analysis**: Sends cleaned text to LLM with structured output prompt
4. **Validation**: Validates and normalizes the extracted data
5. **Display**: Shows results in human-readable format

### LLM Prompt

The system uses a carefully crafted prompt that:
- Explains the task clearly
- Defines the expected JSON structure
- Handles different pricing formats (per 1K vs per 1M tokens)
- Extracts multiple models from one page
- Handles edge cases

### Merge Process

1. **Load**: Reads current pricing.json
2. **Compare**: Checks for existing provider/model
3. **Update**: Updates prices if changed
4. **Add**: Adds new models/providers
5. **Save**: Writes updated data back

## Supported Pricing Formats

The LLM can extract from various formats:

| Format | Example | Extracted |
|--------|---------|-----------|
| Per 1M tokens | `$0.20 per 1M tokens` | $0.20 |
| Per 1K tokens | `$0.20 per 1K tokens` | $200 |
| Per million | `$0.20 per million` | $0.20 |
| Table format | Input: $0.20<br>Output: $0.50 | Both values |

## Example Output

```
🔍 Starting LLM extraction from: https://docs.x.ai/docs/models/grok-4-1-fast-reasoning
  📡 Fetching content from: https://docs.x.ai/docs/models/grok-4-1-fast-reasoning
  ✓ Retrieved 76620 characters
  📄 Cleaned text: 852 characters
  🤖 Sending to LLM for extraction...
  ✓ LLM response received

============================================================
Provider: xAI
Source: https://docs.x.ai/docs/models/grok-4-1-fast-reasoning
============================================================

1. Grok 4 Fast Reasoning ≤128k
   Input:  $0.20 per M tokens
   Output: $0.50 per M tokens
   Context: 128,000 tokens

2. Grok 4 Fast Reasoning >128k
   Input:  $0.40 per M tokens
   Output: $1.00 per M tokens
   Context: 256,000 tokens

📋 JSON for pricing.json:
{
  "id": "xai",
  "name": "xAI",
  "models": [
    {
      "name": "Grok 4 Fast Reasoning ≤128k",
      "input_per_million": 0.2,
      "output_per_million": 0.5,
      "context_window": 128000,
      "free_tier": null,
      "last_updated": "2026-01-05T08:30:06.870Z"
    }
  ]
}

✅ Extraction complete!
```

## Tips

### Best Practices

1. **Always verify**: Review extracted data before merging
2. **Use provider hints**: Helps the LLM with context
3. **Check for changes**: Use `npm run compare` to see differences
4. **Batch mode**: Process multiple URLs at once for efficiency

### Troubleshooting

**Issue**: "Missing EXTRACTION_API_KEY"
- Solution: Add the environment variable to `.env`

**Issue**: Extraction returns wrong prices
- Try adding `--provider <name>` hint
- Check the source URL is current
- Verify the LLM response is correct

**Issue**: Merge doesn't update
- Check provider ID matches
- Verify model names are exact matches
- Check for typos in JSON

## Integration with Daily Updates

You can integrate LLM extraction into the daily update workflow:

```bash
# 1. Extract from new URLs
npm run extract-and-merge -- "https://new-provider.com/pricing"

# 2. Compare with existing
npm run compare

# 3. Run daily update
npm run daily:update your@email.com
```

## Advanced: Custom Extraction

You can also use the functions programmatically:

```typescript
import { extractPricingFromURL } from './scripts/llm-extract';
import { mergePricingData } from './scripts/merge-pricing';

const result = await extractPricingFromURL('https://...');
const json = {
  id: result.provider.toLowerCase().replace(/\s+/g, '-'),
  name: result.provider,
  models: result.models.map(m => ({
    name: m.name,
    input_per_million: m.input_per_million,
    output_per_million: m.output_per_million,
    context_window: m.context_window,
    free_tier: m.free_tier,
    last_updated: new Date().toISOString(),
  })),
};
await mergePricingData(json.id, JSON.stringify(json));
```

## GitHub Actions Integration

### Workflow: `.github/workflows/llm-extract.yml`

A GitHub Actions workflow is included for automated LLM extraction via the GitHub UI.

**Setup Required:**
Add these secrets in GitHub repository settings:
- `EXTRACTION_API_KEY` - Your LLM API key
- `EXTRACTION_BASE_URL` - API endpoint (e.g., `https://api.openai.com/v1`)
- `EXTRACTION_MODEL` - Model name (e.g., `gpt-4-turbo`)
- `RESEND_API_KEY` - (Optional) For email notifications
- `ALERT_EMAIL` - (Optional) Default alert email

**Usage - Single URL:**
1. Go to GitHub → Actions → LLM Pricing Extraction
2. Click "Run workflow"
3. Fill in:
   - **URL**: Documentation URL to extract from
   - **Provider Hint**: (Optional) Provider name
   - **Auto-merge**: `true` to create PR, `false` for preview only
   - **Alert Email**: (Optional) Email for results

**Usage - Batch File:**
1. Create a batch file in your repo (e.g., `scripts/urls.json`):
   ```json
   [
     {"url": "https://docs.x.ai/docs/models/grok-4-1-fast-reasoning", "provider": "xAI"},
     {"url": "https://openai.com/pricing", "provider": "OpenAI"}
   ]
   ```
2. Commit the file to your repository
3. Go to GitHub → Actions → LLM Pricing Extraction
4. Click "Run workflow"
5. Fill in:
   - **Batch File**: `scripts/urls.json`
   - **Auto-merge**: `false` (preview first), then run again with `true`

**What happens:**
- **Preview mode** (`auto_merge=false`): Shows extracted data, no changes made
- **Merge mode** (`auto_merge=true`): Creates a PR with the extracted pricing data
- **Batch mode**: Always runs preview first for safety

### Workflow: `.github/workflows/daily-pricing-update.yml`

The existing daily update workflow scrapes llm-prices.com. You can add LLM extraction as a manual step:
```bash
# In daily-update.ts, add:
# npx tsx scripts/extract-and-merge.ts <url> --provider <name>
```

## Files

- `llm-extract.ts` - Main extraction script
- `merge-pricing.ts` - Merge utility
- `extract-and-merge.ts` - Combined workflow
- `urls.example.json` - Example batch file
- `EXTRACTION_README.md` - This file
- `.github/workflows/llm-extract.yml` - GitHub Actions workflow
