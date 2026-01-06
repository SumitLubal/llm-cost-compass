import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | LLM PriceCheck',
  description: 'The page you are looking for does not exist. Compare LLM pricing across OpenAI, Anthropic, Google, xAI, and more.',
  metadataBase: new URL('https://llmpricecompare.com'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-black flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 p-12">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
            >
              Go Home
            </a>
            <a
              href="/submit"
              className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition"
            >
              Submit Pricing
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
