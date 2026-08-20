'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Clock, Eye, Share2 } from 'lucide-react';
import { api, getDemoUser, type Blog, type Profile } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<(Partial<Blog> & { author?: string; authorInitial?: string; content?: string; authorProfile?: Profile | null }) | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load from DB first, fall back to placeholder
    api.blogs.getById(id)
      .then(async (data) => {
        const authorProfile = data.authorId ? await api.users.getById(data.authorId).catch(() => null) : null;
        setBlog({ ...data, authorProfile });
      })
      .catch(() => null)
      .finally(() => setLoading(false));

    api.bookmarks.getAll()
      .then((bookmarks) => {
        setBookmarked(bookmarks.some((b: any) => b.blogId === id));
      })
      .catch(() => null);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-8 bg-gray-100 rounded w-48" />
        <div className="h-10 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        {[...Array(8)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded" />)}
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Post not found</p>
        <Link href="/blogs" className="mt-4 inline-block">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/blogs" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-medium mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to blog
      </Link>

      <article>
        {/* Tags */}
        <div className="flex gap-2 mb-4">
          {blog.tags?.map((tag) => (
            <Badge key={tag} className="bg-blue-50 text-blue-700 border-blue-100 text-xs">{tag}</Badge>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
          {blog.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
              {blog.authorProfile?.displayName?.charAt(0).toUpperCase()
                || blog.authorProfile?.username?.charAt(0).toUpperCase()
                || (blog as { authorInitial?: string }).authorInitial
                || '?'}
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">
                {blog.authorProfile?.displayName
                  || blog.authorProfile?.username
                  || (blog as { author?: string }).author
                  || 'Anonymous'}
              </p>
              <p className="text-xs text-gray-400">
                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto text-sm text-gray-400">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{blog.readingTime} min</span>
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{blog.views}</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-4">
          {blog.content?.split('\n').map((line, i) => {
            if (line.startsWith('## ')) {
              return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">{line.slice(3)}</h2>;
            }
            if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={i} className="font-semibold text-gray-900">{line.slice(2, -2)}</p>;
            }
            if (line.startsWith('- ')) {
              return <li key={i} className="ml-4 text-gray-700">{line.slice(2)}</li>;
            }
            if (line.startsWith('```')) return null;
            if (line === '') return <br key={i} />;
            return <p key={i} className="text-gray-700">{line}</p>;
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-10 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const demoUser = getDemoUser();
              if (!demoUser) {
                toast.error('Please log in to save posts');
                return;
              }
              try {
                const res = await api.bookmarks.toggleBlog(id);
                setBookmarked(res.bookmarked);
                toast.success(res.bookmarked ? 'Saved to favorites!' : 'Removed from favorites');
              } catch (e) {
                toast.error('Failed to update favorites');
                console.error(e);
              }
            }}
            className={`gap-2 ${bookmarked ? 'border-red-200 bg-red-50 text-red-600' : ''}`}
          >
            <Heart className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            {(blog.likesCount ?? 0) + (bookmarked ? 1 : 0)}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            {blog.commentsCount ?? 0}
          </Button>
          <Button variant="outline" size="sm" className="gap-2 ml-auto">
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </div>
      </article>
    </div>
  );
}
