import { Metadata } from 'next';
import Link from 'next/link';
import { BlogPost, getAllBlogPosts, formatDate } from '@/lib/blog';
import { ThemeToggle } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Learn LLM Pricing & Optimization | LLM PriceCheck Blog',
  description: 'Simple guides to understand LLM costs, optimize your AI spending, and build cost-effective applications. From beginner to advanced.',
  alternates: {
    canonical: 'https://llmpricecompare.com/blog',
  },
  openGraph: {
    title: 'LLM PriceCheck Blog - Learn AI Cost Optimization',
    description: 'Simple, practical guides for LLM pricing and cost optimization',
    url: 'https://llmpricecompare.com/blog',
    type: 'website',
    images: ['/og-image.png'],
  },
};

// Difficulty badge component
function DifficultyBadge({ level }: { level: 'Beginner' | 'Intermediate' | 'Advanced' }) {
  const styles = {
    Beginner: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    Intermediate: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    Advanced: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${styles[level]}`}>
      {level}
    </span>
  );
}

// Reading time calculator
function ReadingTime({ content }: { content: string }) {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export default function BlogIndex() {
  const posts: BlogPost[] = getAllBlogPosts();

  // Sort by date (newest first)
  const sortedPosts = posts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Categorize posts
  const beginnerPosts = sortedPosts.filter(p => p.tags.includes('Education'));
  const optimizationPosts = sortedPosts.filter(p => p.tags.includes('Optimization'));
  const advancedPosts = sortedPosts.filter(p => p.tags.includes('Advanced'));
  const marketPosts = sortedPosts.filter(p => p.tags.includes('Xiaomi') || p.tags.includes('DeepSeek') || p.tags.includes('Market Analysis'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
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

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Learn LLM Pricing <span className="text-purple-600 dark:text-purple-400">Without the Headache</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Simple guides that actually explain things. From "what's a token?" to advanced cost optimization strategies.
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-16">
          <Link href="#basics" className="group p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:-translate-y-1">
            <div className="text-3xl mb-2">📚</div>
            <div className="font-bold text-gray-900 dark:text-gray-100 mb-1 text-sm">Start Here</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">New to LLMs</div>
          </Link>
          <Link href="#optimization" className="group p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:-translate-y-1">
            <div className="text-3xl mb-2">💰</div>
            <div className="font-bold text-gray-900 dark:text-gray-100 mb-1 text-sm">Save Money</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Cost optimization</div>
          </Link>
          <Link href="#advanced" className="group p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:-translate-y-1">
            <div className="text-3xl mb-2">🚀</div>
            <div className="font-bold text-gray-900 dark:text-gray-100 mb-1 text-sm">Level Up</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Advanced techniques</div>
          </Link>
          <Link href="#market" className="group p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:-translate-y-1">
            <div className="text-3xl mb-2">🌏</div>
            <div className="font-bold text-gray-900 dark:text-gray-100 mb-1 text-sm">Market News</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Chinese AI models</div>
          </Link>
        </div>

        {/* All Posts List - Cleaner Design */}
        <div className="space-y-6 mb-16">
          {sortedPosts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <DifficultyBadge level={post.difficulty as 'Beginner' | 'Intermediate' | 'Advanced'} />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(post.date)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {post.readingTime || '5 min read'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2 leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-3">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Category Sections */}
        <div id="basics" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">📚 Start Here</h2>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {beginnerPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="p-5 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-green-500 dark:hover:border-green-500 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <DifficultyBadge level="Beginner" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{post.readingTime || '5 min'}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{post.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{post.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div id="optimization" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">💰 Save Money</h2>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {optimizationPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="p-5 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-yellow-500 dark:hover:border-yellow-500 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <DifficultyBadge level="Intermediate" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{post.readingTime || '5 min'}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{post.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{post.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div id="advanced" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">🚀 Level Up</h2>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {advancedPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="p-5 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-red-500 dark:hover:border-red-500 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <DifficultyBadge level="Advanced" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{post.readingTime || '5 min'}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{post.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{post.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div id="market" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">🌏 Market News</h2>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {marketPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="p-5 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <DifficultyBadge level={post.difficulty as 'Beginner' | 'Intermediate' | 'Advanced'} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{post.readingTime || '5 min'}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{post.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{post.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 text-center border border-purple-200 dark:border-purple-800">
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              📧 Weekly LLM Tips
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Get one practical tip every week on saving money with LLMs. No spam, just value.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">© 2026 LLM PriceCheck Blog</p>
          <p className="text-xs">Learn smart. Spend less. Build better.</p>
        </div>
      </footer>
    </div>
  );
}
