'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, BookOpen, BookMarked, FileText, Layers, Trophy, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { adminApi, type AdminStats, type AdminUser, type AdminBlog } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.users.list(), adminApi.blogs.list()])
      .then(([s, u, b]) => { setStats(s); setUsers(u); setBlogs(b); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Users', value: stats?.users ?? 0, icon: Users, color: 'bg-blue-500', iconBg: 'bg-blue-50 text-blue-600', trend: '+12%' },
    { label: 'Lessons', value: stats?.lessons ?? 0, icon: BookOpen, color: 'bg-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600', trend: '+3' },
    { label: 'Chapters', value: stats?.chapters ?? 0, icon: Layers, color: 'bg-purple-500', iconBg: 'bg-purple-50 text-purple-600', trend: '+8' },
    { label: 'Blog Posts', value: stats?.blogs ?? 0, icon: BookMarked, color: 'bg-amber-500', iconBg: 'bg-amber-50 text-amber-600', trend: '+5' },
    { label: 'Submissions', value: stats?.submissions ?? 0, icon: FileText, color: 'bg-rose-500', iconBg: 'bg-rose-50 text-rose-600', trend: '+24' },
  ];

  const topUsers = [...users].sort((a, b) => b.xp - a.xp).slice(0, 5);
  const recentBlogs = blogs.slice(0, 5);
  const recentUsers = users.slice(0, 5);
  const publishedBlogs = blogs.filter(b => b.isPublished).length;
  const draftBlogs = blogs.filter(b => !b.isPublished).length;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s your platform overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <card.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{card.trend}</span>
            </div>
            {loading ? (
              <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Link href="/admin/blogs" className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-5 text-white hover:shadow-lg transition-shadow group">
          <BookMarked className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-bold text-lg">Create Blog Post</h3>
          <p className="text-blue-100 text-sm mt-1">Write and publish a new article</p>
          <div className="flex items-center gap-1 mt-3 text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
            Go to Blogs <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link href="/admin/lessons" className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-5 text-white hover:shadow-lg transition-shadow group">
          <BookOpen className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-bold text-lg">Manage Lessons</h3>
          <p className="text-purple-100 text-sm mt-1">Add chapters, problems & content</p>
          <div className="flex items-center gap-1 mt-3 text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
            Go to Lessons <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link href="/admin/users" className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white hover:shadow-lg transition-shadow group">
          <Award className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-bold text-lg">Issue Certificates</h3>
          <p className="text-amber-100 text-sm mt-1">Award certificates to top learners</p>
          <div className="flex items-center gap-1 mt-3 text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
            Go to Users <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-gray-900">Top Performers</h3>
            </div>
            <Link href="/admin/users"><Button variant="ghost" size="sm" className="text-xs gap-1">View all <ArrowRight className="w-3 h-3" /></Button></Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? [...Array(5)].map((_, i) => <div key={i} className="px-5 py-3"><div className="h-5 bg-gray-100 rounded animate-pulse" /></div>) :
              topUsers.map((user, i) => (
                <div key={user.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-400'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.displayName || user.username}</p>
                    <p className="text-xs text-gray-400">@{user.username}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-blue-600">{user.xp} XP</p>
                    <p className="text-xs text-gray-400">{user._count.submissions} solved</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-gray-900">Recent Blogs</h3>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-xs">{publishedBlogs} live</Badge>
              <Badge className="bg-amber-50 text-amber-700 border-amber-100 text-xs">{draftBlogs} drafts</Badge>
            </div>
            <Link href="/admin/blogs"><Button variant="ghost" size="sm" className="text-xs gap-1">View all <ArrowRight className="w-3 h-3" /></Button></Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? [...Array(5)].map((_, i) => <div key={i} className="px-5 py-3"><div className="h-5 bg-gray-100 rounded animate-pulse" /></div>) :
              recentBlogs.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-400 text-sm">No blog posts yet</div>
              ) : recentBlogs.map((blog) => (
                <div key={blog.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{blog.title}</p>
                    <p className="text-xs text-gray-400">by @{blog.author.username}</p>
                  </div>
                  <Badge className={`text-xs shrink-0 ${blog.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              ))
            }
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-gray-900">Recent Users</h3>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? [...Array(5)].map((_, i) => <div key={i} className="px-5 py-3"><div className="h-5 bg-gray-100 rounded animate-pulse" /></div>) :
              recentUsers.map((user) => (
                <div key={user.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {(user.displayName || user.username).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.displayName || user.username}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <Badge className={`text-xs ${user.role === 'ADMIN' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-500'}`}>{user.role}</Badge>
                </div>
              ))
            }
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> Platform Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Content Coverage</span><span className="font-medium text-gray-900">{stats ? Math.min(100, Math.round((stats.chapters / Math.max(stats.lessons, 1)) * 20)) : 0}%</span></div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${stats ? Math.min(100, Math.round((stats.chapters / Math.max(stats.lessons, 1)) * 20)) : 0}%` }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">User Engagement</span><span className="font-medium text-gray-900">{stats ? Math.min(100, Math.round((stats.submissions / Math.max(stats.users, 1)) * 10)) : 0}%</span></div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${stats ? Math.min(100, Math.round((stats.submissions / Math.max(stats.users, 1)) * 10)) : 0}%` }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Blog Activity</span><span className="font-medium text-gray-900">{stats ? Math.min(100, stats.blogs * 10) : 0}%</span></div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${stats ? Math.min(100, stats.blogs * 10) : 0}%` }} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
