'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, BookOpen, BookMarked, FileText, Layers, Trophy, TrendingUp, Award, ArrowRight, Star, MessageSquare, Shield } from 'lucide-react';
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
      .then(([s, u, b]) => {
        setStats(s);
        setUsers(Array.isArray(u) ? u : []);
        setBlogs(Array.isArray(b) ? b : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Users', value: stats?.users ?? 0, icon: Users, iconBg: 'bg-blue-50 text-blue-600', trend: '+12%', href: '/admin/users' },
    { label: 'Lessons', value: stats?.lessons ?? 0, icon: BookOpen, iconBg: 'bg-emerald-50 text-emerald-600', trend: '+3', href: '/admin/lessons' },
    { label: 'Chapters', value: stats?.chapters ?? 0, icon: Layers, iconBg: 'bg-purple-50 text-purple-600', trend: '+8', href: '/admin/lessons' },
    { label: 'Blog Posts', value: stats?.blogs ?? 0, icon: BookMarked, iconBg: 'bg-amber-50 text-amber-600', trend: '+5', href: '/admin/blogs' },
    { label: 'Submissions', value: stats?.submissions ?? 0, icon: FileText, iconBg: 'bg-rose-50 text-rose-600', trend: '+24', href: '/admin/leaderboard' },
  ];

  const topUsers = [...users].sort((a, b) => b.xp - a.xp).slice(0, 5);
  const recentBlogs = blogs.slice(0, 5);
  const recentUsers = users.slice(0, 5);
  const publishedBlogs = blogs.filter(b => b.isPublished).length;
  const draftBlogs = blogs.filter(b => !b.isPublished).length;

  const quickActions = [
    {
      title: 'Manage Blogs',
      desc: 'Create, edit & publish articles',
      href: '/admin/blogs',
      icon: BookMarked,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Manage Lessons',
      desc: 'Add chapters, problems & content',
      href: '/admin/lessons',
      icon: BookOpen,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Manage Users',
      desc: 'View users, issue certificates',
      href: '/admin/users',
      icon: Users,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Manage Reviews',
      desc: 'Reply to student lesson reviews',
      href: '/admin/reviews',
      icon: Star,
      gradient: 'from-indigo-500 to-violet-500',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-sm">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here&apos;s your platform overview.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="block group">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 transition-all h-full cursor-pointer">
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
              <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                View details <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((card) => (
          <Link key={card.title} href={card.href} className="block group">
            <div className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white hover:shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden h-full`}>
              <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-30 transition-opacity">
                <card.icon className="w-16 h-16" />
              </div>
              <card.icon className="w-6 h-6 mb-3 relative z-10" />
              <h3 className="font-bold text-lg relative z-10">{card.title}</h3>
              <p className="text-white/80 text-sm mt-1 relative z-10">{card.desc}</p>
              <div className="flex items-center gap-1 mt-3 text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity relative z-10">
                Open <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-gray-900">Top Performers</h3>
            </div>
            <Link href="/admin/leaderboard"><Button variant="ghost" size="sm" className="text-xs gap-1">View all <ArrowRight className="w-3 h-3" /></Button></Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? [...Array(5)].map((_, i) => <div key={i} className="px-5 py-3"><div className="h-5 bg-gray-100 rounded animate-pulse" /></div>) :
              topUsers.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-400 text-sm">No users yet</div>
              ) : topUsers.map((user, i) => (
                <Link key={user.id} href="/admin/users" className="block">
                  <div className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors cursor-pointer">
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
                </Link>
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
                <Link key={blog.id} href={`/blogs/${blog.id}`} className="block">
                  <div className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <BookMarked className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{blog.title}</p>
                      <p className="text-xs text-gray-400">by @{blog.author.username}</p>
                    </div>
                    <Badge className={`text-xs shrink-0 ${blog.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </Link>
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
            <Link href="/admin/users"><Button variant="ghost" size="sm" className="text-xs gap-1">View all <ArrowRight className="w-3 h-3" /></Button></Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? [...Array(5)].map((_, i) => <div key={i} className="px-5 py-3"><div className="h-5 bg-gray-100 rounded animate-pulse" /></div>) :
              recentUsers.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-400 text-sm">No users yet</div>
              ) : recentUsers.map((user) => (
                <Link key={user.id} href="/admin/users" className="block">
                  <div className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {(user.displayName || user.username).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.displayName || user.username}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <Badge className={`text-xs ${user.role === 'ADMIN' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-500'}`}>{user.role}</Badge>
                  </div>
                </Link>
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
