import { Metadata } from 'next';
import Link from 'next/link';
import { BlogPost, getAllBlogPosts, formatDate } from '@/lib/blog';
import { ThemeToggle } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Blog | LLM PriceCheck',
  description: 'Learn about LLM pricing, cost optimization, embeddings, and best practices for AI development.',
  alternates: {
    canonical: 'https://llmpricecompare.com/blog',
  },
  openGraph: {
    title: 'LLM PriceCheck Blog',
    description: 'Educational content about LLM pricing, optimization, and best practices',
    url: 'https://llmpricecompare.com/blog',
    type: 'website',
    images: ['/og-image.png'],
  },
};

export default function BlogIndex() {
  const posts: BlogPost[] = getAllBlogPosts();

  // Sort by date (newest first)
  const sortedPosts = posts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Simple Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm z-50">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition">
              ← Back to calculator
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/" className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition">
                LLM PriceCheck
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Compact */}
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Insights on LLM pricing, cost optimization, and building cost-effective AI applications.
          </p>
        </div>

        {/* Blog Posts List - Compact */}
        <div className="space-y-10 mb-12">
          {sortedPosts.map((post) => (
            <article key={post.slug} className="group">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    {post.tags[0]}
                  </span>
                  <span>•</span>
                  <span>{formatDate(post.date)}</span>
                </div>
                <Link href={`/blog/${post.slug}`} className="block">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-2">
                    {post.description}
                  </p>
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:underline">
                    Read article →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Categories */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Browse by Topic</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: 'Education', count: 4, emoji: '📚' },
              { name: 'Optimization', count: 2, emoji: '💰' },
              { name: 'Advanced', count: 1, emoji: '🚀' }
            ].map(category => (
              <div key={category.name} className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-purple-500 dark:hover:border-purple-500 transition-colors">
                <div className="text-xl mb-1">{category.emoji}</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{category.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{category.count} articles</div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter - Compact */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Subscribe to the blog
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            Get weekly insights on LLM pricing and optimization strategies.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="px-4 py-2 bg-purple-600 text-white font-medium text-sm rounded-lg hover:bg-purple-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="max-w-3xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2026 LLM PriceCheck Blog</p>
        </div>
      </footer>
    </div>
  );
}
