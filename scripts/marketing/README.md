# 🚀 Marketing Automation System

**100% Free & Automated Marketing for LLM PriceCompare**

---

## ⚡ Quick Start (Zero Manual Work)

```bash
# Setup (one-time)
npm run marketing:setup

# Enable GitHub Actions (go to Actions tab, enable workflows)
# That's it! Everything runs daily at 9 AM UTC automatically
```

### Manual Commands (Optional)
```bash
# Auto-post to all platforms (requires API credentials)
npm run marketing:auto-post -- OpenAI GPT-4o 5.00

# Generate posts only (no posting)
npm run marketing:social -- OpenAI GPT-4o 5.00

# Generate all materials
npm run marketing:social        # Social media posts
npm run marketing:directories   # Directory checklist
npm run marketing:blog          # Content calendar
npm run marketing:outreach      # Outreach plan
```

---

## 📁 What's Included

### 1. **Auto-Post to Social Media** (`auto-post.ts`)
Automatically posts to Twitter/X, LinkedIn, and Reddit (zero manual work).

**Usage:**
```bash
# Auto-post to all platforms (requires API credentials)
npm run marketing:auto-post -- OpenAI GPT-4o 5.00

# Or use tsx directly
npx tsx scripts/marketing/auto-post.ts OpenAI GPT-4o 5.00
```

**Features:**
- Auto-posts to Twitter/X (if credentials configured)
- Auto-posts to LinkedIn (if credentials configured)
- Auto-posts to Reddit (if credentials configured)
- Falls back to manual posting instructions if no credentials

### 2. **Social Media Poster** (`social-poster.ts`)
Generates platform-specific posts for Twitter/X, LinkedIn, and Reddit.

**Usage:**
```bash
# Generate posts for a specific model
npm run marketing:social -- OpenAI GPT-4o 5.00

# Or use tsx directly
npx tsx scripts/marketing/social-poster.ts OpenAI GPT-4o 5.00
```

**Output:**
- Twitter/X post (280 chars, hashtags)
- LinkedIn post (professional tone)
- Reddit post (community-focused)

---

### 3. **Directory Submitter** (`directory-submitter.ts`)
Generates checklist for 20+ free directory submissions.

**Usage:**
```bash
# Generate checklist
npm run marketing:directories checklist

# Generate submission data
npm run marketing:directories data
```

**Directories Include:**
- Product Hunt, BetaList, Futurepedia
- AI tool directories (10+)
- Developer tool sites
- Tech news aggregators

---

### 4. **Blog Content Generator** (`blog-ideas.ts`)
30-day content calendar with SEO-optimized blog post ideas.

**Usage:**
```bash
# View calendar
npm run marketing:blog calendar

# Get content brief for post #1
npm run marketing:blog brief 1

# Generate keyword clusters
npm run marketing:blog keywords

# Meta descriptions
npm run marketing:blog meta

# Internal linking plan
npm run marketing:blog linking
```

**Output:**
- 30 blog post ideas
- SEO keywords
- Content outlines
- Publishing schedule

---

### 5. **Backlink Outreach** (`backlink-outreach.ts`)
Generates outreach emails for backlinks and guest posts.

**Usage:**
```bash
# Generate outreach plan
npm run marketing:outreach plan

# Generate email for specific target
npm run marketing:outreach email "Futurepedia"
```

**Targets Include:**
- AI newsletters (The Batch, AI Breakfast)
- Tech blogs (Hacker News, Indie Hackers)
- Tool directories
- Guest post opportunities

---

## 🤖 GitHub Actions Automation (Zero Manual Work)

### Daily Marketing Workflow
**File:** `.github/workflows/daily-marketing.yml`

**Automatically runs:** Daily at 9 AM UTC

**What it does:**
- ✅ Auto-posts to social media (if API credentials set)
- ✅ Generates social media posts (backup)
- ✅ Creates content calendar (30 days)
- ✅ Updates directory checklist (21 directories)
- ✅ Generates outreach plan (20 targets)
- ✅ Creates daily report

**Manual trigger:**
```bash
gh workflow run daily-marketing.yml
```

---

### Weekly Marketing Summary
**File:** `.github/workflows/weekly-marketing-summary.yml`

**Automatically runs:** Every Monday at 10 AM UTC

**What it does:**
- ✅ Weekly marketing plan
- ✅ Progress report
- ✅ GitHub issue with tasks

**Manual trigger:**
```bash
gh workflow run weekly-marketing-summary.yml
```

---

## 🎯 Marketing Strategy

### The Complete Plan
See `MARKETING_STRATEGY.md` for:
- 30-day launch plan
- Traffic projections
- KPI tracking
- Free marketing channels
- Success metrics

---

## 📊 Expected Results

### Month 1
- 450+ visitors
- 5+ backlinks
- 10+ directory listings

### Month 3
- 1,000+ visitors
- 30+ backlinks
- 4+ blog posts

### Month 6
- 2,000+ visitors
- 50+ backlinks
- Strong SEO presence

---

## 💡 Pro Tips

### 1. Leverage Your Data
Your daily pricing updates are unique content:
```bash
# Generate posts when prices change
npm run marketing:auto-post -- OpenAI GPT-4o 4.50
```

### 2. Consistency is Key
- Daily workflow runs automatically
- Just review artifacts
- Execute when ready

### 3. Track Everything
- Use Google Analytics (free)
- Track referral sources
- Double down on what works

### 4. Be Helpful
- Answer questions on Reddit
- Help people choose models
- Build trust first

---

## 🔧 Customization

### Edit Social Media Templates
Open `scripts/marketing/social-poster.ts` and modify:
- `DAILY_TEMPLATES`
- `REDDIT_TEMPLATES`
- `LINKEDIN_TEMPLATES`

### Add More Directories
Open `scripts/marketing/directory-submitter.ts` and add to `DIRECTORIES` array.

### Add Outreach Targets
Open `scripts/marketing/backlink-outreach.ts` and add to `OUTREACH_TARGETS` array.

### Update Content Calendar
Open `scripts/marketing/blog-ideas.ts` and modify `CONTENT_CALENDAR`.

---

## 📈 Zero Manual Workflow

### Fully Automated (Recommended)
1. GitHub Actions runs daily at 9 AM UTC
2. Auto-posts to social media (if credentials set)
3. Generates all marketing materials
4. Uploads artifacts
5. Creates summary

**You don't need to do anything!**

### Optional: Manual Commands
```bash
# Auto-post now
npm run marketing:auto-post -- OpenAI GPT-4o 5.00

# Generate posts only
npm run marketing:social -- OpenAI GPT-4o 5.00

# View content
npm run marketing:blog calendar
npm run marketing:directories checklist
npm run marketing:outreach plan
```

---

## 🎯 Success Metrics

### Track Weekly
| Metric | Target | Tool |
|--------|--------|------|
| New Backlinks | 5+ | Google Search Console |
| Referral Traffic | 100+ | Google Analytics |
| Social Posts | 7+ | Auto-generated |
| Blog Posts | 1+ | Website |
| Directory Listings | 5+ | Checklist |

---

## 🚀 Start Now

```bash
# 1. Setup (one-time)
npm run marketing:setup

# 2. Enable GitHub Actions
# Go to: Repository Settings > Actions > Enable workflows

# 3. Add API credentials (optional)
# Add GitHub secrets for auto-posting

# 4. Done! Everything runs automatically
```

---

## 📞 Need Help?

### Check These Files
- `MARKETING_STRATEGY.md` - Complete strategy guide
- `MARKETING_QUICKSTART.md` - Quick setup guide
- `scripts/marketing/README.md` - This file

### Common Issues
1. **Script not found:** Run `npm install`
2. **Type errors:** Update TypeScript
3. **GitHub Actions fail:** Check logs in Actions tab
4. **Auto-posting not working:** Add API credentials to GitHub secrets

---

## ✅ Checklist

- [ ] Run `npm run marketing:setup`
- [ ] Enable GitHub Actions
- [ ] (Optional) Add API credentials
- [ ] Done! System runs automatically

---

**Total Cost: $0 | Time Required: 0 min/day (fully automated)**

**Ready to grow? Let's go! 🚀**
