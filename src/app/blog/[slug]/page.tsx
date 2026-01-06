import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPost, getRelatedPosts, formatDate } from '@/lib/blog';
import { BlogPost } from '@/lib/blog';
import { marked } from 'marked';
import { ThemeToggle } from '@/components/ThemeToggle';

interface PageProps {
  params: {
    slug: string;
  };
}

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

// Generate static params for all blog posts
export async function generateStaticParams() {
  const fs = require('fs');
  const path = require('path');

  const blogDir = path.join(process.cwd(), 'src/app/blog');
  const files = fs.readdirSync(blogDir).filter((file: string) =>
    file.endsWith('.md') && file !== 'README.md'
  );

  return files.map((file: string) => ({
    slug: file.replace('.md', ''),
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const url = `https://llmpricecompare.com/blog/${post.slug}`;

  return {
    title: `${post.title} | LLM PriceCheck Blog`,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: url,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ['/og-image.png'],
    },
    keywords: post.tags,
  };
}

// Markdown to HTML converter using marked
async function markdownToHtml(markdown: string): Promise<string> {
  return await marked.parse(markdown);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug, post.tags);
  const htmlContent = await markdownToHtml(post.content);

  // Determine difficulty level
  const difficulty = (post.difficulty || 'Beginner') as 'Beginner' | 'Intermediate' | 'Advanced';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/blog" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition">
              ← Back to blog
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Article Header - More engaging */}
        <article className="mb-12">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <DifficultyBadge level={difficulty} />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(post.date)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {post.readingTime}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              by {post.author}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-6 max-w-3xl">
            {post.description}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded">
                {tag}
              </span>
            ))}
          </div>
        </article>

        {/* Article Content - Enhanced typography with storytelling flow */}
        <div className="prose prose-lg prose-purple dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
          prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
          prose-h1:mt-12 prose-h2:mt-10 prose-h3:mt-8 prose-h4:mt-6
          prose-h1:mb-4 prose-h2:mb-3 prose-h3:mb-2 prose-h4:mb-2
          prose-p:text-gray-800 dark:prose-p:text-gray-300 prose-p:leading-8 prose-p:text-[1.1rem] prose-p:mb-4
          prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-bold
          prose-code:bg-purple-50 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-purple-700 dark:prose-code:text-purple-300 prose-code:font-mono prose-code:text-[0.95em]
          prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:font-mono prose-pre:text-[0.9em] prose-pre:mb-5
          prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:text-gray-800 dark:prose-ul:text-gray-300 prose-ul:text-[1.1rem]
          prose-ol:my-4 prose-ol:pl-6 prose-ol:text-gray-800 dark:prose-ol:text-gray-300 prose-ol:text-[1.1rem]
          prose-li:my-2 prose-li:leading-8
          prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:my-6 prose-blockquote:bg-purple-50 dark:prose-blockquote:bg-gray-900/30 prose-blockquote:p-3 prose-blockquote:rounded-r-lg
          prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline prose-a:font-semibold
          prose-hr:border-purple-200 dark:prose-hr:border-purple-800 prose-hr:my-8 prose-hr:border-2
          prose-table:w-full prose-table:border-collapse prose-table:my-6
          prose-th:border-b prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-bold prose-th:text-gray-900 dark:prose-th:text-gray-100 prose-th:text-[1rem]
          prose-td:border-b prose-td:border-gray-200 dark:prose-td:border-gray-800 prose-td:px-4 prose-td:py-3 prose-td:text-gray-700 dark:prose-td:text-gray-300 prose-td:text-[1rem]
          prose-img:rounded-xl prose-img:my-6 prose-img:border prose-img:border-gray-200 dark:prose-img:border-gray-800
          first:prose-h1:mt-0"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* What You Learned Section */}
        <div className="mt-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            🎯 Key Takeaways
          </h3>
          <div className="text-gray-700 dark:text-gray-300">
            <p className="mb-2">After reading this article, you now understand:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>How LLM pricing actually works (no jargon, just facts)</li>
              <li>Practical ways to reduce your AI costs immediately</li>
              <li>When to use which model for maximum value</li>
            </ul>
          </div>
        </div>

        {/* Related Posts - More engaging */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              📚 Keep Learning
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedPosts.map(related => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group block p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <DifficultyBadge level={related.difficulty as 'Beginner' | 'Intermediate' | 'Advanced'} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {related.readingTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1 text-lg">
                    {related.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {related.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter - More engaging */}
        <div className="mt-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white">
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-2">
              📧 Get Weekly LLM Tips
            </h3>
            <p className="text-purple-100 mb-4">
              Join 500+ developers saving money on AI costs. One practical tip every week.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-white/90 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-purple-700 font-bold rounded-lg hover:bg-gray-100 transition">
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
