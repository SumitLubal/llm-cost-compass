'use client';

import { useState } from 'react';

export function SubmitForm() {
  const [formData, setFormData] = useState({
    providerName: '',
    website: '',
    modelName: '',
    inputPrice: '',
    outputPrice: '',
    userEmail: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setStatus('success');
      setFormData({
        providerName: '',
        website: '',
        modelName: '',
        inputPrice: '',
        outputPrice: '',
        userEmail: '',
      });
    } catch (err) {
      setStatus('error');
      setError('Failed to submit. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Submitted Successfully!</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your pricing submission is in our review queue. We'll verify it and notify you when it's live.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Provider Name *
        </label>
        <input
          type="text"
          name="providerName"
          required
          value={formData.providerName}
          onChange={handleChange}
          placeholder="e.g., OpenAI, Anthropic, Google"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Website URL *
        </label>
        <input
          type="url"
          name="website"
          required
          value={formData.website}
          onChange={handleChange}
          placeholder="https://provider.com/pricing"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Model Name
        </label>
        <input
          type="text"
          name="modelName"
          value={formData.modelName}
          onChange={handleChange}
          placeholder="e.g., GPT-4, Claude 3 Opus"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Input Price (per 1M tokens)
          </label>
          <input
            type="number"
            name="inputPrice"
            step="0.01"
            value={formData.inputPrice}
            onChange={handleChange}
            placeholder="e.g., 5.00"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Output Price (per 1M tokens)
          </label>
          <input
            type="number"
            name="outputPrice"
            step="0.01"
            value={formData.outputPrice}
            onChange={handleChange}
            placeholder="e.g., 15.00"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Your Email (optional)
        </label>
        <input
          type="email"
          name="userEmail"
          value={formData.userEmail}
          onChange={handleChange}
          placeholder="Get notified when published"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
        />
      </div>

      {status === 'error' && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit Pricing'}
      </button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        * Required fields. All submissions are reviewed before publishing.
      </p>
    </form>
  );
}
