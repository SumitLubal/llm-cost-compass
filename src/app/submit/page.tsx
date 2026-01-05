import { SubmitForm } from '@/components/SubmitForm';

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-black py-12 px-4">
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

        <div className="mt-8 text-center">
          <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            ← Back to comparison
          </a>
        </div>
      </div>
    </div>
  );
}
