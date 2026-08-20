'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, getDemoUser } from '@/lib/api';
import { Heart, BookOpen, BookMarked, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      router.push('/login');
      return;
    }
    setUserId(demoUser.id);
    api.bookmarks.getAll()
      .then(setBookmarks)
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
                <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all h-full flex flex-col cursor-pointer">
                  <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wide">
                    {bookmark.lesson.language.name}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{bookmark.lesson.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-3">{bookmark.lesson.description}</p>
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
                <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all h-full flex flex-col cursor-pointer">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{bookmark.blog.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">{bookmark.blog.excerpt}</p>
                  <div className="mt-auto text-xs font-semibold text-gray-400">
                    By {bookmark.blog.author?.displayName || 'Anonymous'}
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
