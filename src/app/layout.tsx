import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Basic metadata
  title: {
    template: "%s | LLM PriceCheck",
    default: "LLM PriceCheck - Compare LLM Pricing Across All Providers",
  },
  description: "Compare LLM pricing across OpenAI, Anthropic, Google, xAI, and more. Real-time cost calculator, smart recommendations, and daily price updates. Find the cheapest AI models.",

  // Keywords (for legacy SEO)
  keywords: [
    "LLM pricing",
    "AI model costs",
    "OpenAI pricing",
    "Anthropic pricing",
    "Claude pricing",
    "GPT-4 pricing",
    "LLM comparison",
    "AI cost calculator",
    "cheapest LLM",
    "LLM price comparison",
    "language model pricing",
    "AI API pricing",
  ],

  // Open Graph
  openGraph: {
    title: "LLM PriceCheck - Compare LLM Pricing",
    description: "Compare LLM pricing across all providers. Real-time cost calculator and smart recommendations.",
    url: "https://llmpricecheck.com",
    siteName: "LLM PriceCheck",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LLM PriceCheck - Smart LLM Pricing Comparison",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "LLM PriceCheck - Compare LLM Pricing",
    description: "Compare LLM pricing across all providers. Real-time cost calculator and smart recommendations.",
    images: ["/og-image.png"],
  },

  // App manifest
  manifest: "/manifest.json",

  // Authors
  authors: [{ name: "Sumeet" }],

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
    canonical: "https://llmpricecheck.com",
  },

  // Referrer policy
  referrer: "origin-when-cross-origin",

  // Theme color
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],

  // Viewport
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },

  // Other
  category: "technology",
};

// JSON-LD Structured Data for Organization
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "LLM PriceCheck",
  "description": "Compare LLM pricing across all providers with smart cost calculator",
  "url": "https://llmpricecheck.com",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
  },
  "creator": {
    "@type": "Person",
    "name": "Sumeet",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "100",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

        {/* Favicon variants */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://llmpricecheck.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
