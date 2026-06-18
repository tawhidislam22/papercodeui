'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Code as Code2,
  LayoutDashboard,
  BookOpen,
  Upload,
  BookMarked,
  Trophy,
  LogOut,
  User,
  Users,
  Shield,
} from 'lucide-react';
import { api, clearDemoUser, getDemoUser, type Profile, getLevelFromXP } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const demoUser = getDemoUser();
    if (!demoUser) return;
    api.users.getMe().then(setProfile).catch(() => setProfile(null));
  }, []);

  async function signOut() {
    clearDemoUser();
    router.push('/');
  }

  const level = profile ? getLevelFromXP(profile.xp) : 1;
  const isAdmin = profile?.role === 'ADMIN';

  const NAV_ITEMS = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', adminOnly: true, exact: true },
    { href: '/upload', icon: Upload, label: 'Upload Code', adminOnly: false },
    { href: '/admin/leaderboard', icon: Trophy, label: 'Leaderboard', adminOnly: true },
    { href: '/admin/users', icon: Users, label: 'Users', adminOnly: true },
    { href: '/admin/blogs', icon: BookMarked, label: 'Blogs', adminOnly: true },
    { href: '/admin/lessons', icon: BookOpen, label: 'Lessons', adminOnly: true },
  ];

  // Non-admin sees different dashboard
  const userItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', adminOnly: false, exact: true },
    { href: '/lessons', icon: BookOpen, label: 'Lessons', adminOnly: false },
    { href: '/upload', icon: Upload, label: 'Upload Code', adminOnly: false },
    { href: '/blogs', icon: BookMarked, label: 'Blog', adminOnly: false },
    { href: '/leaderboard', icon: Trophy, label: 'Leaderboard', adminOnly: false },
  ];

  const items = isAdmin ? NAV_ITEMS : userItems;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-gray-100 flex flex-col z-40">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-5 py-5 shrink-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
          style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}
        >
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <span className="font-extrabold text-gray-900 tracking-tight text-lg">Paper Code</span>
      </Link>

      {/* Nav section */}
      <div className="px-3 mt-2 flex-1 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Menu
        </p>
        <nav className="space-y-0.5">
          {items.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-blue-50 text-blue-700 shadow-sm border-l-[3px] border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User at bottom */}
      {profile ? (
        <div className="border-t border-gray-100 px-4 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/profile">
              <Avatar className="w-9 h-9 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all">
                <AvatarImage src={profile.avatarUrl} />
                <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
                  {(profile.displayName || profile.username).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <Link href="/profile" className="hover:underline">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {profile.displayName || profile.username}
                </p>
              </Link>
              <p className="text-xs text-gray-400">
                {isAdmin && <span className="text-red-500 font-semibold">Admin · </span>}
                Level {level}
              </p>
            </div>
            <button
              onClick={signOut}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-gray-100 px-4 py-4 shrink-0">
          <Link
            href="/auth"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}
          >
            Sign in
          </Link>
        </div>
      )}
    </aside>
  );
}
