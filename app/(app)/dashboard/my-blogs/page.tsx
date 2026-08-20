'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, getDemoUser, type Blog } from '@/lib/api';
import { BookOpen, PenTool, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function MyBlogsPage() {
  const router = useRouter();
  const [myBlogs, setMyBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const demoUser = getDemoUser();
    if (!demoUser) {
      router.push('/auth');
      return;
    }
    api.blogs.getMyBlogs().then(data => setMyBlogs(data || [])).finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Blogs</h1>
          <p className="text-gray-500 mt-1">Manage your created blog posts.</p>
        </div>
        <Link href="/blogs/new">
          <Button className="rounded-xl gap-2 text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
            <PenTool className="w-4 h-4" /> Write a new post
          </Button>
        </Link>
      </div>

      {myBlogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No blogs yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You haven't written any blog posts yet. Share your knowledge and experiences with the community!
          </p>
          <Link href="/blogs/new">
            <Button className="gap-2">Write your first post</Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myBlogs.map((blog) => (
            <div key={blog.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <Badge variant={blog.isPublished ? 'default' : 'secondary'} className={blog.isPublished ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}>
                  {blog.isPublished ? 'Published' : 'Draft'}
                </Badge>
                <p className="text-xs text-gray-400">{new Date(blog.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2" title={blog.title}>{blog.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1">{blog.excerpt || 'No excerpt available.'}</p>
              
              <div className="flex items-center justify-between gap-2 border-t border-gray-50 pt-4 mt-auto">
                <Link href={`/blogs/${blog.id}`} className="text-blue-600 text-sm font-semibold hover:underline">
                  View Post
                </Link>
                <div className="flex gap-2">
                  <Link href={`/blogs/${blog.id}/edit`}>
                    <Button size="sm" variant="outline" className="h-8 text-xs font-medium">Edit</Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs font-medium"
                    onClick={async () => {
                      try {
                        await api.blogs.update(blog.id, { isPublished: !blog.isPublished });
                        setMyBlogs(await api.blogs.getMyBlogs());
                        toast.success(blog.isPublished ? 'Blog unpublished' : 'Blog published successfully');
                      } catch (e) {
                        toast.error('Failed to update blog');
                      }
                    }}
                  >
                    {blog.isPublished ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 text-xs font-medium"
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this blog post?')) {
                        try {
                          await api.blogs.delete(blog.id);
                          setMyBlogs(await api.blogs.getMyBlogs());
                          toast.success('Blog deleted successfully');
                        } catch (e) {
                          toast.error('Failed to delete blog');
                        }
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
