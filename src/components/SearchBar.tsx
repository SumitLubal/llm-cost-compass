'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchBar({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search providers (OpenAI, Claude, Gemini, Llama, Mistral)..."
          className="w-full px-6 py-4 pl-12 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none shadow-sm transition-all"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          🔍
        </div>
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {initialQuery && (
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            ← Clear search
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">Showing results for "{initialQuery}"</span>
        </div>
      )}
    </div>
  );
}
