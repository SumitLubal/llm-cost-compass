# Architecture Overview - LLM PriceCheck

## High-Level Design

This is a **frontend-only** Next.js application with automated daily pricing updates via GitHub Actions.

### Why Frontend-Only?

✅ **No backend server needed** - Everything runs on Vercel/Netlify
✅ **Zero database costs** - JSON file in repo
✅ **Simple deployment** - Just push to GitHub
✅ **Scalable** - CDN handles millions of users
✅ **Separate concerns** - Scraping job doesn't affect users

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Daily Update Job                         │
│  (GitHub Actions - Runs at 9 AM UTC daily)                  │
│                                                             │
│  1. scrape-providers.ts                                     │
│     ├─ Scrapes pricing from 5 providers                     │
│     └─ Returns ScrapingResult[]                             │
│                                                             │
│  2. compare-pricing.ts                                      │
│     ├─ Loads existing pricing.json                          │
│     ├─ Compares old vs new                                  │
│     └─ Returns PriceChange[]                                │
│                                                             │
│  3. send-email.ts                                           │
│     ├─ Generates HTML email                                 │
│     ├─ Sends via Resend API                                 │
│     └─ Alerts you of changes                                │
│                                                             │
│  4. daily-update.ts                                         │
│     ├─ Orchestrates all steps                               │
│     ├─ Auto-publishes if confidence > 90%                   │
│     └─ OR creates PR for review                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ┌─────────────┐
                    │ GitHub Repo │
                    │ pricing.json│
                    └─────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                       │
│  (Vercel/Netlify - User visits yoursite.com)                │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ page.tsx                                             │  │
│  │  ├─ Imports comparePricing / searchModels           │  │
│  │  ├─ Reads from src/data/pricing.json                │  │
│  │  └─ Renders components                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↓                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Components:                                          │  │
│  │  ├─ SearchBar (search functionality)                │  │
│  │  ├─ CostCalculator (token → $ conversion)           │  │
│  │  ├─ ComparisonView (smart cards + table)            │  │
│  │  ├─ ThemeToggle (light/dark switch)                 │  │
│  │  └─ SubmitForm (user submissions)                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Email Alerts (Resend)                    │
│  - Daily change notifications                               │
│  - User submission alerts                                   │
│  - Review & approval workflow                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Daily Update Flow

```
GitHub Actions (9 AM UTC)
    ↓
scripts/scrape-providers.ts
    ↓ ScrapingResult[]
    ↓
scripts/compare-pricing.ts
    ↓ PriceChange[]
    ↓
scripts/send-email.ts
    ↓ Email sent
    ↓
scripts/daily-update.ts
    ├─ If confidence > 90% → Commit to main
    └─ Else → Create PR for review
```

### User Request Flow

```
User visits site
    ↓
Next.js reads src/data/pricing.json
    ↓
lib/pricing-json.ts flattens data
    ↓
Search/Filter applied
    ↓
Components render with dark mode
    ↓
User sees pricing comparison
```

---

## File Structure

```
llm-cost-compass/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main page (uses JSON data)
│   │   ├── layout.tsx            # ThemeProvider wrapper
│   │   └── submit/
│   │       └── page.tsx          # Submission form
│   │
│   ├── components/
│   │   ├── ThemeProvider.tsx     # Theme context
│   │   ├── ThemeToggle.tsx       # Theme switcher
│   │   ├── SearchBar.tsx         # Search input
│   │   ├── CostCalculator.tsx    # Token → $ calculator
│   │   ├── ComparisonView.tsx    # Price comparison
│   │   ├── SubmitButton.tsx      # Submit CTA
│   │   └── SubmitForm.tsx        # User submission form
│   │
│   ├── lib/
│   │   └── pricing-json.ts       # JSON data utilities
│   │
│   ├── data/
│   │   ├── pricing.json          # Current pricing data
│   │   └── types.ts              # TypeScript types
│   │
│   └── styles/
│       └── globals.css           # Dark mode CSS
│
├── scripts/
│   ├── daily-update.ts           # Main orchestration
│   ├── scrape-providers.ts       # Web scraper
│   ├── compare-pricing.ts        # Change detection
│   └── send-email.ts             # Email alerts
│
├── .github/
│   └── workflows/
│       └── daily-pricing-update.yml  # GitHub Actions
│
├── public/
│   └── pricing.json              # (Optional: serve from CDN)
│
├── package.json
├── README.md
├── SETUP.md
└── ARCHITECTURE.md
```

---

## Key Design Decisions

### 1. JSON vs Database

**Decision:** JSON file in repo
**Why:**
- No database server needed
- Version controlled
- Can be served from CDN
- Zero cost
- Simple to understand

**Trade-off:** Manual updates require git commit (solved by automation)

### 2. GitHub Actions vs Vercel Cron

**Decision:** GitHub Actions
**Why:**
- Free (2,000 min/month)
- More powerful (can commit, create PRs)
- Better logging
- No vendor lock-in

**Alternative:** Vercel Cron + Edge Functions (paid)

### 3. Mock Scraping vs Real Scraping

**Decision:** Mock data in initial scraper
**Why:**
- Works immediately
- Easy to test
- Can be replaced later

**Upgrade path:** Add Playwright/Puppeteer or LLM extraction

### 4. Email via Resend vs SendGrid

**Decision:** Resend
**Why:**
- Simple API
- Good free tier (100 emails/day)
- Modern developer experience
- No complex setup

---

## Component Architecture

### ThemeProvider (Client Component)

```typescript
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Read from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
    setMounted(true);
  }, []);

  // Update HTML class for Tailwind
  useEffect(() => {
    if (!mounted) return;
    const actualTheme = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    setResolvedTheme(actualTheme);
    document.documentElement.classList.toggle('dark', actualTheme === 'dark');
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### PricingJSON Library

```typescript
// Flattens nested data for easy manipulation
function flattenModels(data: PricingData): FlatModel[] {
  return data.providers.flatMap(provider =>
    provider.models.map(model => ({
      provider: provider.name,
      model: model.name,
      ...model,
      total_cost: model.input_per_million + model.output_per_million,
      score: calculateScore(model)
    }))
  );
}

// Main exports
export function searchModels(query: string): FlatModel[] { ... }
export function comparePricing(): ComparisonResult { ... }
```

---

## Security Considerations

### What's Public
- ✅ All pricing data (intentionally public)
- ✅ Frontend code
- ✅ GitHub Actions logs (if public repo)

### What's Private
- 🔒 Resend API key (GitHub secret)
- 🔒 Your email address (GitHub secret)
- 🔒 Any API keys for scraping

### Best Practices
1. Never commit `.env.local` to git
2. Use GitHub Secrets for sensitive data
3. Rate limit user submissions
4. Validate all form inputs
5. Don't expose internal APIs

---

## Scaling Considerations

### Current Scale (Free Tier)
- Frontend: Vercel/Netlify free
- GitHub Actions: 2,000 min/month
- Email: 100/day via Resend
- Storage: GitHub repo

### Scaling to 100+ Providers
1. **Storage**: Move pricing.json to S3/R2
2. **Scraping**: Parallelize GitHub Actions jobs
3. **Frontend**: Add pagination/virtualization
4. **Email**: Upgrade Resend plan

### Scaling to Millions of Users
1. **CDN**: Cloudflare for edge caching
2. **Search**: Algolia for instant search
3. **Analytics**: Vercel Analytics
4. **Cost**: Still under $50/month

---

## Future Enhancements

### Immediate
- [ ] Real scraping with Playwright
- [ ] Historical price charts
- [ ] Provider comparison tool

### Short-term
- [ ] Slack/Discord notifications
- [ ] CSV export
- [ ] Bulk upload

### Long-term
- [ ] API for developers
- [ ] Mobile app
- [ ] Price prediction
- [ ] 100+ providers

---

## Testing Strategy

### Unit Tests
```bash
npm run test:compare    # Test comparison logic
npm run test:scrape     # Test scraping
npm run test:email      # Test email formatting
```

### Integration Tests
- Daily job runs successfully
- Email sends when changes detected
- PR created when confidence low

### Manual Testing
- Search functionality
- Cost calculator
- Theme toggle
- Submit form

---

## Deployment Checklist

- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Verify app works at localhost:3000
- [ ] Set up Resend API key (optional)
- [ ] Configure GitHub Secrets (for automation)
- [ ] Deploy to Vercel/Netlify
- [ ] Test daily job manually
- [ ] Verify email alerts work

---

## Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| Frontend Hosting | $0 | Vercel/Netlify free tier |
| GitHub Actions | $0 | 2,000 min/month free |
| Email (Resend) | $0 | 100 emails/day free |
| Storage | $0 | GitHub repo |
| **Total** | **$0/month** | |

---

## Summary

This architecture achieves all your requirements:

✅ **No backend server** - Frontend only
✅ **Daily updates** - GitHub Actions cron
✅ **Email alerts** - Resend integration
✅ **User submissions** - Form → Email
✅ **Auto-publish** - Confidence-based
✅ **Never hide providers** - All data visible
✅ **Easy to update** - JSON file + automation

**Ready for beta launch!** 🚀
