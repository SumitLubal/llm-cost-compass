import { SubmitForm } from '@/components/SubmitForm';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Submit LLM Pricing | LLM PriceCheck',
  description: 'Submit new LLM pricing information to LLM PriceCheck. Help keep our database accurate and up-to-date with the latest pricing from OpenAI, Anthropic, Google, xAI, Amazon, Meta, and more.',
  keywords: [
    'submit LLM pricing',
    'contribute pricing data',
    'LLM price submission',
    'AI model pricing update',
    'OpenAI pricing submission',
    'Anthropic pricing submission',
    'Google Gemini pricing',
    'xAI Grok pricing',
    'LLM pricing database',
    'crowdsourced LLM pricing',
  ],
  alternates: {
    canonical: 'https://llmpricecompare.com/submit',
  },
  openGraph: {
    title: 'Submit LLM Pricing | LLM PriceCheck',
    description: 'Help keep our database accurate. Submit new pricing for OpenAI, Anthropic, Google, xAI, and more.',
    url: 'https://llmpricecompare.com/submit',
    type: 'website',
  },
  twitter: {
    title: 'Submit LLM Pricing',
    description: 'Help keep our database accurate with new pricing submissions',
  },
  metadataBase: new URL('https://llmpricecompare.com'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-black py-12 px-4">
      {/* Trackers removed for build fix */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 text-white">
            <h1 className="text-3xl font-bold">Submit LLM Pricing</h1>
            <p className="text-purple-100 mt-1">Help keep our database accurate and up-to-date</p>
          </div>

          <div className="p-8">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>How it works:</strong> Your submission goes into our review queue.
                We'll verify it against the provider's website and auto-publish if confidence is high.
                You'll get notified when it goes live!
              </p>
            </div>

            <SubmitForm />

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Questions? Email: your-email@example.com
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center flex gap-4 justify-center">
          <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            ← Back to comparison
          </a>
          <a href="/blog" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
            📚 Read our blog
          </a>
        </div>
      </div>
    </div>
  );
}
