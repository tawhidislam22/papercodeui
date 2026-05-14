'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, Plus, BookMarked, Heart, MessageCircle, Clock,
  Bookmark, TrendingUp, Filter, Eye
} from 'lucide-react';
import { supabase, type Blog } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type BlogWithAuthor = Blog & { profiles: { username: string; display_name: string; avatar_url: string } | null };

const TAGS = ['All', 'JavaScript', 'Python', 'C', 'C++', 'Java', 'TypeScript', 'Learning', 'Tips', 'Projects'];

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogWithAuthor[]>([]);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });

    supabase
      .from('blogs')
      .select('*, profiles(username, display_name, avatar_url)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setBlogs(data as BlogWithAuthor[]);
        setLoading(false);
      });
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

  // Static placeholder posts for demo when no DB posts
  const placeholderPosts: Partial<BlogWithAuthor>[] = [
    {
      id: 'p1',
      title: 'Why Writing Code by Hand Actually Works',
      excerpt: 'Research shows that handwriting activates deeper cognitive processing. Here is the science behind Paper Code and why it helps you learn faster.',
      tags: ['Learning'],
      likes_count: 42,
      comments_count: 8,
      reading_time: 5,
      created_at: new Date().toISOString(),
      views: 320,
      profiles: { username: 'alexj', display_name: 'Alex Johnson', avatar_url: '' },
    },
    {
      id: 'p2',
      title: 'Python Lists vs Tuples: When to Use Which',
      excerpt: 'A comprehensive guide to understanding the difference between Python lists and tuples, with practical examples and performance benchmarks.',
      tags: ['Python'],
      likes_count: 28,
      comments_count: 5,
      reading_time: 7,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      views: 211,
      profiles: { username: 'pythonjunkie', display_name: 'Sam Chen', avatar_url: '' },
    },
    {
      id: 'p3',
      title: 'Understanding Pointers in C — The Visual Way',
      excerpt: 'Pointers confuse everyone at first. This guide uses memory diagrams and handwritten examples to make them click forever.',
      tags: ['C'],
      likes_count: 67,
      comments_count: 14,
      reading_time: 12,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      views: 589,
      profiles: { username: 'clowlevel', display_name: 'Mike P.', avatar_url: '' },
    },
    {
      id: 'p4',
      title: 'My First 30 Days Learning JavaScript',
      excerpt: 'I documented everything I learned in my first month with JavaScript. From variables to closures — my honest experience.',
      tags: ['JavaScript', 'Learning'],
      likes_count: 35,
      comments_count: 22,
      reading_time: 10,
      created_at: new Date(Date.now() - 259200000).toISOString(),
      views: 445,
      profiles: { username: 'newdev99', display_name: 'Jordan K.', avatar_url: '' },
    },
    {
      id: 'p5',
      title: 'Building a Calculator in C++: Step by Step',
      excerpt: 'A hands-on project tutorial for C++ beginners. We build a command-line calculator from scratch, explaining every concept.',
      tags: ['C++', 'Projects'],
      likes_count: 19,
      comments_count: 7,
      reading_time: 15,
      created_at: new Date(Date.now() - 345600000).toISOString(),
      views: 167,
      profiles: { username: 'cppdev', display_name: 'Lisa T.', avatar_url: '' },
    },
    {
      id: 'p6',
      title: '10 JavaScript Tips That Will Level Up Your Code',
      excerpt: 'From destructuring to optional chaining — these 10 modern JavaScript patterns will make your code cleaner and more expressive.',
      tags: ['JavaScript', 'Tips'],
      likes_count: 93,
      comments_count: 31,
      reading_time: 8,
      created_at: new Date(Date.now() - 432000000).toISOString(),
      views: 1024,
      profiles: { username: 'jshero', display_name: 'Ryan B.', avatar_url: '' },
    },
  ];

  const displayPosts = filtered.length > 0 ? filtered : (loading ? [] : placeholderPosts as BlogWithAuthor[]);

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
                    {(post.profiles?.display_name || post.profiles?.username || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{post.profiles?.display_name || post.profiles?.username}</p>
                    <p className="text-xs text-gray-400">{post.created_at ? formatDate(post.created_at) : ''}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 shrink-0">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post.likes_count}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.reading_time}m</span>
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
