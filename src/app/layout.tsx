import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Viewport configuration (moved from metadata)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export const metadata: Metadata = {
  // Basic metadata
  title: {
    template: "%s | LLM PriceCheck",
    default: "LLM PriceCheck - Compare LLM Pricing Across All Providers",
  },
  description: "Compare LLM pricing across OpenAI, Anthropic, Google, xAI, and more. Real-time cost calculator, smart recommendations, and daily price updates. Find the cheapest AI models.",

  // Keywords (for legacy SEO)
  keywords: [
    // Core terms
    "LLM pricing", "AI model costs", "LLM comparison", "AI pricing comparison",
    "language model pricing", "large language model pricing", "AI API pricing",
    "LLM cost calculator", "AI cost calculator", "monthly AI cost",

    // Provider-specific pricing
    "OpenAI pricing", "GPT-4 pricing", "GPT-4o pricing", "GPT-3.5 Turbo pricing",
    "Anthropic pricing", "Claude pricing", "Claude 3 Opus pricing", "Claude 3 Sonnet pricing", "Claude 3 Haiku pricing",
    "Google pricing", "Gemini pricing", "Gemini 1.5 Pro pricing", "Gemini Pro pricing",
    "xAI pricing", "Grok pricing", "Grok 4 pricing", "Grok 3 pricing",
    "Amazon pricing", "Nova pricing", "AWS Bedrock pricing",
    "Meta pricing", "Llama pricing",
    "DeepSeek pricing", "Mistral pricing",

    // Search intent terms
    "cheapest LLM", "cheapest AI model", "best value LLM", "most affordable AI",
    "compare LLM prices", "LLM price comparison tool", "AI model comparison",
    "LLM pricing API", "LLM pricing database", "daily LLM price updates",

    // Feature terms
    "LLM cost estimator", "token cost calculator", "AI token pricing",
    "input output cost", "per million tokens pricing",

    // User intent
    "find cheapest AI", "compare AI costs", "LLM pricing tool",
    "AI pricing database", "LLM price tracker"
  ],

  // Open Graph
  openGraph: {
    title: "LLM PriceCompare - Compare LLM Pricing",
    description: "Compare LLM pricing across all providers. Real-time cost calculator and smart recommendations.",
    url: "https://llmpricecompare.com",
    siteName: "LLM PriceCompare",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LLM PriceCompare - Smart LLM Pricing Comparison",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "LLM PriceCompare - Compare LLM Pricing",
    description: "Compare LLM pricing across all providers. Real-time cost calculator and smart recommendations.",
    images: ["/og-image.png"],
  },

  // App manifest
  manifest: "/manifest.json",

  // Authors
  authors: [{ name: "LLM PriceCheck" }],

  // Classification
  classification: "Business",

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Alternates (for multilingual in future)
  alternates: {
    canonical: "https://llmpricecompare.com",
  },

  // Referrer policy
  referrer: "origin-when-cross-origin",

  // Other
  category: "technology",

  // Metadata base for social images
  metadataBase: new URL('https://llmpricecompare.com'),
};

// JSON-LD Structured Data for Organization
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "LLM PriceCompare",
  "alternateName": ["LLM Pricing Tool", "AI Cost Calculator", "LLM Comparison", "LLM PriceCheck"],
  "description": "Compare LLM pricing across OpenAI, Anthropic, Google, xAI, Amazon, Meta, DeepSeek, Mistral, and more. Real-time cost calculator, smart recommendations, and daily price updates.",
  "url": "https://llmpricecompare.com",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Any",
  "genre": ["AI", "LLM", "Pricing", "Comparison Tool"],
  "keywords": "LLM pricing, AI model costs, OpenAI, Anthropic, Google, xAI, cost calculator",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2029-12-31",
  },
  "creator": {
    "@type": "Organization",
    "name": "LLM PriceCheck",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "100",
    "bestRating": "5",
    "worstRating": "1",
  },
  "featureList": [
    "Real-time LLM pricing comparison",
    "Cost calculator for monthly estimates",
    "Smart recommendations by value score",
    "Daily automated price updates",
    "Free tier detection",
    "Dark mode support"
  ],
  "applicationSuite": "LLM PriceCheck Suite",
  "softwareVersion": "0.1.0",
  "datePublished": "2026-01-01",
  "dateModified": "2026-01-05",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Debug log for GA
  if (typeof window === 'undefined') {
    console.log('[GA] Server-side - NEXT_PUBLIC_GA_MEASUREMENT_ID:', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Additional meta tags for SEO */}
        <meta name="application-name" content="LLM PriceCheck" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LLM PriceCheck" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Additional SEO meta tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="LLM PriceCheck" />
        <meta name="generator" content="Next.js" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="1 days" />

        {/* Open Graph additional tags */}
        <meta property="og:site_name" content="LLM PriceCheck" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />

        {/* Twitter additional tags */}
        <meta name="twitter:site" content="@llmpricecheck" />
        <meta name="twitter:creator" content="@llmpricecheck" />

        {/* Theme color for browsers */}
        <meta name="theme-color" content="#6366f1" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#111827" media="(prefers-color-scheme: dark)" />

        {/* Favicon variants */}
        <link rel="icon" type="image/png" sizes="any" href="/logg-price.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://llmpricecompare.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>

        {/* Google Analytics */}
        <GoogleAnalytics
          measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''}
        />
      </body>
    </html>
  );
}
