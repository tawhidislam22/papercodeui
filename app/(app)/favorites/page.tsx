'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, getDemoUser } from '@/lib/api';
import { Heart, BookOpen, BookMarked, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'lessons' | 'blogs'>('lessons');
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const demoUser = getDemoUser();
    if (!demoUser) {
      router.push('/auth');
      return;
    }
    setUserId(demoUser.id);
    api.bookmarks.getAll()
      .then((data) => setBookmarks(Array.isArray(data) ? data : []))
      .catch((e) => {
        console.error(e);
        setBookmarks([]);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const lessonBookmarks = bookmarks.filter(b => b.lesson);
  const blogBookmarks = bookmarks.filter(b => b.blog);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Favorites</h1>
        <p className="text-gray-500 mt-1">Your saved lessons and blogs.</p>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`pb-4 px-2 text-sm font-semibold transition-colors ${
            activeTab === 'lessons'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Lessons ({lessonBookmarks.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('blogs')}
          className={`pb-4 px-2 text-sm font-semibold transition-colors ${
            activeTab === 'blogs'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4" />
            Blogs ({blogBookmarks.length})
          </div>
        </button>
      </div>

      {activeTab === 'lessons' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessonBookmarks.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-500">
              <Heart className="w-12 h-12 mx-auto text-gray-200 mb-3" />
              <p>No saved lessons found.</p>
              <Link href="/lessons">
                <Button variant="outline" className="mt-4">Browse Lessons</Button>
              </Link>
            </div>
          ) : (
            lessonBookmarks.map((bookmark) => (
              <Link key={bookmark.id} href={`/lessons/${bookmark.lesson.slug}`}>
                <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all h-full flex flex-col">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'radial-gradient(circle at top left, rgba(59,130,246,0.08), transparent 55%)' }} />
                  <div className="relative z-10 flex items-center gap-2 mb-3">
                    <Badge className="bg-blue-50 text-blue-700 border-blue-100 text-xs font-medium uppercase">{bookmark.lesson.language.name}</Badge>
                    {bookmark.lesson.difficulty && (
                      <Badge variant="outline" className="text-xs capitalize">{bookmark.lesson.difficulty.toLowerCase()}</Badge>
                    )}
                  </div>
                  <h3 className="relative z-10 text-xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                    {bookmark.lesson.title}
                  </h3>
                  <p className="relative z-10 text-sm text-gray-500 line-clamp-3">{bookmark.lesson.description}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {activeTab === 'blogs' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogBookmarks.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-500">
              <Heart className="w-12 h-12 mx-auto text-gray-200 mb-3" />
              <p>No saved blogs found.</p>
              <Link href="/blogs">
                <Button variant="outline" className="mt-4">Browse Blogs</Button>
              </Link>
            </div>
          ) : (
            blogBookmarks.map((bookmark) => (
              <Link key={bookmark.id} href={`/blogs/${bookmark.blog.id}`}>
                <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all h-full flex flex-col">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'radial-gradient(circle at top left, rgba(16,185,129,0.08), transparent 55%)' }} />
                  <div className="relative z-10 flex items-center gap-2 mb-3">
                    {bookmark.blog.tags && bookmark.blog.tags.length > 0 ? (
                      bookmark.blog.tags.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} className="bg-emerald-50 text-emerald-700 border-emerald-100 text-xs font-medium">{tag}</Badge>
                      ))
                    ) : (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-xs font-medium">Post</Badge>
                    )}
                  </div>
                  <h3 className="relative z-10 text-xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-emerald-600 transition-colors flex-1">
                    {bookmark.blog.title}
                  </h3>
                  <p className="relative z-10 text-sm text-gray-500 line-clamp-3 mb-4">{bookmark.blog.excerpt}</p>
                  
                  <div className="relative z-10 mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {(bookmark.blog.author?.displayName || bookmark.blog.author?.username || '?').charAt(0).toUpperCase()}
                      </div>
                      <div className="text-xs font-semibold text-gray-700">
                        {bookmark.blog.author?.displayName || 'Anonymous'}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
