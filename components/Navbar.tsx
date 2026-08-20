'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Code as Code2, LayoutDashboard, BookOpen, Upload, BookMarked, Trophy, LogOut, User, Menu, X, Zap, Flame, ChevronDown, Home, Mail } from 'lucide-react';
import { api, clearDemoUser, getDemoUser, type Profile, getLevelFromXP } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const PUBLIC_NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/blogs', icon: BookMarked, label: 'Blog' },
  { href: '/upload', icon: Upload, label: 'Upload Code' },
  { href: '/pricing', icon: Flame, label: 'Pricing' },
  { href: '/about', icon: User, label: 'About' },
  { href: '/contact', icon: Mail, label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const demoUser = getDemoUser();
    if (!demoUser) return;
    api.users.getMe().then(setProfile).catch(() => {
      setProfile(null);
    });
  }, []);

  async function signOut() {
    clearDemoUser();
    window.location.href = '/';
  }

  const level = profile ? getLevelFromXP(profile.xp) : 1;
  const activeNavItems = PUBLIC_NAV_ITEMS;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-gray-900 tracking-tight">Paper Code</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {activeNavItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {profile ? (
              <>
                <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-50 transition-colors">
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={profile.avatarUrl} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">
                          {(profile.displayName || profile.username).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:flex flex-col items-start">
                        <span className="text-xs font-semibold text-gray-900 leading-none">{profile.displayName || profile.username}</span>
                        <span className="text-xs text-gray-400">Level {level}</span>
                      </div>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="flex items-center justify-between px-2 py-2 mb-1 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold">
                        <Flame className="w-3.5 h-3.5" />
                        {profile.streak}d
                      </div>
                      <div className="flex items-center gap-1.5 text-blue-700 text-xs font-semibold">
                        <Zap className="w-3.5 h-3.5" />
                        {profile.xp} XP
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    {profile.role === 'ADMIN' && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4" /> Admin Panel
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600">
                      <LogOut className="w-4 h-4 mr-2" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/auth">
                <Button size="sm" className="text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
                  Sign in
                </Button>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-50"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-lg">
            <div className="p-4 space-y-1">
              {profile && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname.startsWith('/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
              )}
              {activeNavItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
