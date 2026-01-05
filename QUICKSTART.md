# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install & Run
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### 2. (Optional) Set Up Email Alerts
```bash
# Get API key from resend.com
# Create .env.local:
RESEND_API_KEY="re_..."
ALERT_EMAIL="you@example.com"
```

### 3. (Optional) Deploy
```bash
# Vercel
vercel --prod

# Or Netlify
netlify deploy --prod
```

---

## 📋 Daily Updates

### GitHub Actions (Recommended)
1. Fork repository
2. Add secrets: `RESEND_API_KEY`, `ALERT_EMAIL`
3. Done! Updates run daily at 9 AM UTC

### Manual
```bash
npm run daily:update your@email.com
```

---

## 🎯 Key Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start dev server |
| `npm run scrape` | Scrape current prices |
| `npm run daily:update email` | Full update with email |
| `npm run email:test email` | Test email sending |

---

## 📁 Files to Know

- `src/data/pricing.json` - Current pricing data
- `scripts/daily-update.ts` - Main automation script
- `.github/workflows/daily-pricing-update.yml` - GitHub Actions

---

## ✅ It Works When...

- ✅ `npm run dev` starts without errors
- ✅ You see pricing table at localhost:3000
- ✅ Search works
- ✅ Dark mode toggle works
- ✅ Cost calculator works

---

## 🔧 Troubleshooting

**No data?**
```bash
npm run daily:update your@email.com
```

**Email not sending?**
- Check `RESEND_API_KEY` is set
- Run: `npm run email:test your@email.com`

**Build fails?**
```bash
npm install
npm run build
```

---

## 🎨 Features

- 💡 **Search**: Find models by name/provider
- 🧮 **Calculator**: Token → $ conversion
- 🌓 **Dark Mode**: System-based theme
- 📧 **Email Alerts**: Daily change notifications
- 📤 **Submissions**: User pricing submissions

---

## 📚 More Info

- Full setup: `SETUP.md`
- Architecture: `ARCHITECTURE.md`
- All docs: `README.md`
