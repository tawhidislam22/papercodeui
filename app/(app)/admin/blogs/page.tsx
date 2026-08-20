'use client';

import { useEffect, useState, useCallback } from 'react';
import { Trash2, Eye, EyeOff, Search, BookMarked, Plus, X } from 'lucide-react';
import { adminApi, type AdminBlog } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  // Blog creation fields
  const [newTitle, setNewTitle] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newPublish, setNewPublish] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminApi.blogs.list().then(setBlogs).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function togglePublish(blog: AdminBlog) {
    try {
      await adminApi.blogs.update(blog.id, { isPublished: !blog.isPublished });
      toast.success(blog.isPublished ? 'Blog unpublished' : 'Blog published');
      load();
    } catch {
      toast.error('Failed to update blog');
    }
  }

  async function removeBlog(id: string) {
    if (!confirm('Delete this blog post?')) return;
    try {
      await adminApi.blogs.remove(id);
      toast.success('Blog deleted');
      load();
    } catch {
      toast.error('Failed to delete blog');
    }
  }

  async function createBlog() {
    setCreating(true);
    try {
      await adminApi.blogs.create({
        title: newTitle,
        excerpt: newExcerpt,
        content: newContent,
        tags: newTags.split(',').map((t) => t.trim()),
        isPublished: newPublish,
      });
      setShowCreate(false);
      setNewTitle(''); setNewExcerpt(''); setNewContent(''); setNewTags('');
      toast.success('Blog created successfully');
      load();
    } catch (e) {
      toast.error('Failed to create blog');
      console.error(e);
    }
    setCreating(false);
  }

  const filtered = blogs.filter(
    (b) => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
          <p className="text-gray-500 mt-1">{blogs.filter((b) => b.isPublished).length} published · {blogs.filter((b) => !b.isPublished).length} drafts</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)} className="gap-2 rounded-xl text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
          {showCreate ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Create Blog</>}
        </Button>
      </div>

      {/* Create Blog Form */}
      {showCreate && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">New Blog Post</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Title</label>
              <Input placeholder="My awesome article..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="rounded-xl text-base" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Excerpt</label>
              <Input placeholder="A short summary of the post..." value={newExcerpt} onChange={(e) => setNewExcerpt(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Content (Markdown)</label>
              <textarea
                placeholder="Write your blog post content here... Supports markdown formatting."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={12}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-y font-mono leading-relaxed focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Tags (comma separated)</label>
                <Input placeholder="javascript, python, tutorial" value={newTags} onChange={(e) => setNewTags(e.target.value)} className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Status</label>
                <div className="flex items-center gap-3 h-10">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newPublish} onChange={(e) => setNewPublish(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                    <span className="text-sm text-gray-700">Publish immediately</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={createBlog} disabled={creating || !newTitle.trim()} className="rounded-xl gap-2 text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
              {creating ? 'Publishing...' : newPublish ? 'Publish Blog' : 'Save as Draft'}
            </Button>
            <Button variant="outline" onClick={() => setShowCreate(false)} className="rounded-xl">Cancel</Button>
          </div>
        </div>
      )}

      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search blogs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10 rounded-xl" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Author</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600">Views</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600">Likes</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? [...Array(4)].map((_, i) => (<tr key={i} className="border-b border-gray-50"><td colSpan={6} className="px-4 py-4"><div className="h-5 bg-gray-100 rounded animate-pulse" /></td></tr>))
            : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400"><BookMarked className="w-8 h-8 mx-auto mb-2 opacity-40" /> No blogs found</td></tr>
            ) : filtered.map((blog) => (
              <tr key={blog.id} onClick={() => router.push(`/blogs/${blog.id}`)} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                <td className="px-4 py-3"><p className="font-medium text-gray-900 truncate max-w-xs">{blog.title}</p><p className="text-xs text-gray-400 truncate max-w-xs">{blog.excerpt}</p></td>
                <td className="px-4 py-3 text-gray-600">@{blog.author.username}</td>
                <td className="px-4 py-3 text-center"><Badge className={blog.isPublished ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}>{blog.isPublished ? 'Published' : 'Draft'}</Badge></td>
                <td className="px-4 py-3 text-center text-gray-600">{blog.views}</td>
                <td className="px-4 py-3 text-center text-gray-600">{blog.likesCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); togglePublish(blog); }} className="gap-1 text-xs h-8 rounded-lg">{blog.isPublished ? <><EyeOff className="w-3 h-3" /> Unpublish</> : <><Eye className="w-3 h-3" /> Publish</>}</Button>
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); removeBlog(blog.id); }} className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
