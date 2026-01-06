import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  content: string;
  difficulty?: string;
  readingTime?: string;
}

const BLOG_DIR = path.join(process.cwd(), 'src/app/blog');

// Calculate reading time from content
function calculateReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

// Get all blog posts
export function getAllBlogPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter(file =>
    file.endsWith('.md') && file !== 'README.md'
  );

  return files.map(file => {
    const slug = file.replace('.md', '');
    const filePath = path.join(BLOG_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      author: data.author,
      tags: data.tags || [],
      content,
      difficulty: data.difficulty || 'Beginner',
      readingTime: calculateReadingTime(content),
    };
  });
}

// Get single blog post by slug
export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author,
    tags: data.tags || [],
    content,
    difficulty: data.difficulty || 'Beginner',
    readingTime: calculateReadingTime(content),
  };
}

// Get blog posts by tag
export function getBlogPostsByTag(tag: string): BlogPost[] {
  const posts = getAllBlogPosts();
  return posts.filter(post => post.tags.includes(tag));
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Get all unique tags
export function getAllTags(): string[] {
  const posts = getAllBlogPosts();
  const allTags = posts.flatMap(post => post.tags);
  return [...new Set(allTags)];
}

// Get related posts (by tag)
export function getRelatedPosts(currentSlug: string, tags: string[]): BlogPost[] {
  const posts = getAllBlogPosts();

  return posts
    .filter(post => post.slug !== currentSlug)
    .filter(post => post.tags.some(tag => tags.includes(tag)))
    .slice(0, 3);
}
