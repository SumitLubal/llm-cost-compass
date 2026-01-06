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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Simple Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm z-50">
        <div className="max-w-3xl mx-auto px-4 py-4">
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

      {/* Main Content - Compact, readable */}
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Article Header */}
        <article className="mb-10">
          <div className="mb-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-purple-600 dark:text-purple-400">
              {post.tags[0]}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
            {post.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {post.description}
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-gray-100">{post.author}</span>
            <span>•</span>
            <span>{formatDate(post.date)}</span>
          </div>
        </article>

        {/* Article Content - Compact typography */}
        <div className="prose prose-gray dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg
          prose-h1:mt-8 prose-h2:mt-6 prose-h3:mt-5 prose-h4:mt-4
          prose-h1:mb-2 prose-h2:mb-2 prose-h3:mb-2 prose-h4:mb-2
          prose-p:text-gray-800 dark:prose-p:text-gray-300 prose-p:leading-7 prose-p:text-[1.05rem] prose-p:mb-3
          prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
          prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-gray-900 dark:prose-code:text-gray-100 prose-code:font-mono prose-code:text-[0.9em]
          prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-3 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:font-mono prose-pre:text-[0.875em] prose-pre:mb-4
          prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5 prose-ul:text-gray-800 dark:prose-ul:text-gray-300 prose-ul:text-[1.05rem]
          prose-ol:my-3 prose-ol:pl-5 prose-ol:text-gray-800 dark:prose-ol:text-gray-300 prose-ol:text-[1.05rem]
          prose-li:my-1 prose-li:leading-7
          prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:my-4 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-900/30 prose-blockquote:p-2 prose-blockquote:rounded-r
          prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
          prose-hr:border-gray-200 dark:prose-hr:border-gray-800 prose-hr:my-5
          prose-table:w-full prose-table:border-collapse prose-table:my-4
          prose-th:border-b prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900 dark:prose-th:text-gray-100 prose-th:text-[0.95rem]
          prose-td:border-b prose-td:border-gray-200 dark:prose-td:border-gray-800 prose-td:px-3 prose-td:py-2 prose-td:text-gray-700 dark:prose-td:text-gray-300 prose-td:text-[0.95rem]
          prose-img:rounded-lg prose-img:my-4
          first:prose-h1:mt-0"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Divider */}
        <div className="my-10 border-t border-gray-200 dark:border-gray-800"></div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Read next
            </h2>
            <div className="grid gap-4">
              {relatedPosts.map(related => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group block p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-purple-500 dark:hover:border-purple-500 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {related.title}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(related.date)}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {related.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Enjoyed this article?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            Get weekly insights on LLM pricing and optimization.
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
