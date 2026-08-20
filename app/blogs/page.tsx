'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, BookMarked, Heart, Clock, Eye } from 'lucide-react';
import { api, getDemoUser, type Blog, type Profile } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type BlogWithAuthor = Blog & { author?: Profile | null };

const TAGS = ['All', 'JavaScript', 'Python', 'C', 'C++', 'Java', 'TypeScript', 'Learning', 'Tips', 'Projects'];

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogWithAuthor[]>([]);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const demoUser = getDemoUser();
    if (demoUser) setUserId(demoUser.id);

    Promise.all([api.blogs.list(), api.users.list()])
      .then(([blogData, users]) => {
        const authorMap = new Map(users.map((u) => [u.id, u]));
        const withAuthors = blogData.map((b) => ({
          ...b,
          author: authorMap.get(b.authorId) ?? null,
        }));
        setBlogs(withAuthors);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = blogs.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchTag = activeTag === 'All' || b.tags.includes(activeTag);
    return matchSearch && matchTag;
  });

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const displayPosts = filtered;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Blog</h1>
          <p className="text-gray-500 mt-1">Learn from the community. Share your journey.</p>
        </div>
        {userId && (
          <Link href="/blogs/new">
            <Button className="text-white gap-2" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
              <Plus className="w-4 h-4" /> Write a post
            </Button>
          </Link>
        )}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeTag === tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-4">
              <div className="h-4 bg-gray-100 rounded w-1/4" />
              <div className="h-6 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPosts.map((post) => (
            <Link key={post.id} href={`/blogs/${post.id}`}>
              <article className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  {post.tags?.slice(0, 2).map((tag) => (
                    <Badge key={tag} className="bg-blue-50 text-blue-700 border-blue-100 text-xs font-medium">{tag}</Badge>
                  ))}
                </div>
                <h2 className="font-bold text-gray-900 text-lg leading-snug mb-3 group-hover:text-blue-600 transition-colors flex-1">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(post.author?.displayName || post.author?.username || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{post.author?.displayName || post.author?.username || 'Anonymous'}</p>
                    <p className="text-xs text-gray-400">{post.createdAt ? formatDate(post.createdAt) : ''}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 shrink-0">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post.likesCount}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime}m</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {!loading && displayPosts.length === 0 && (
        <div className="text-center py-16">
          <BookMarked className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No posts found</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to write about this topic!</p>
          {userId && (
            <Link href="/blogs/new" className="mt-4 inline-block">
              <Button className="text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
                Write a post
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

