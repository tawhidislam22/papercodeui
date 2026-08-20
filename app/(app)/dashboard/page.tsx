'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Flame, Trophy, Upload, BookOpen, ArrowRight, Target, Star, Clock, TrendingUp, Code as Code2, CircleCheck as CheckCircle2, Award, Download } from 'lucide-react';
import { api, getDemoUser, type Profile, type Language, getLevelFromXP, getXPProgress } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { adminApi, type Certificate } from '@/lib/admin-api';

const XP_ACTIONS = [
  { action: 'Daily login', xp: 5, icon: Star, color: 'text-yellow-500' },
  { action: 'Complete lesson', xp: 20, icon: BookOpen, color: 'text-blue-500' },
  { action: 'Solve challenge', xp: 50, icon: Target, color: 'text-green-500' },
  { action: 'Upload code', xp: 30, icon: Upload, color: 'text-orange-500' },
  { action: 'Publish blog', xp: 25, icon: Code2, color: 'text-purple-500' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    async function load() {
      const demoUser = getDemoUser();
      if (!demoUser) { router.push('/auth'); return; }

      const [p, langs] = await Promise.all([
        api.users.getMe(),
        api.languages.list(),
      ]);

      if (p) {
        setProfile(p);
        try { 
          const certs = await adminApi.certificates.listForUser(p.id); 
          setCertificates(certs); 
        } catch { /* ignore */ }
      }
      if (langs) setLanguages(langs);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
            <Code2 className="w-5 h-5 text-white animate-pulse" />
          </div>
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const level = profile ? getLevelFromXP(profile.xp) : 1;
  const xpProgress = profile ? getXPProgress(profile.xp) : { current: 0, next: 100, percent: 0 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Welcome back, {profile?.displayName || profile?.username || 'Coder'}!
          </h1>
          <p className="text-gray-500 mt-1">Keep pushing — every line you write builds your skills.</p>
        </div>
        <Link href="/upload">
          <Button className="text-white gap-2" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
            <Upload className="w-4 h-4" />
            Upload Code
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Level', value: `Lv. ${level}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total XP', value: `${profile?.xp ?? 0} XP`, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Streak', value: `${profile?.streak ?? 0} days`, icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Longest streak', value: `${profile?.longestStreak ?? 0} days`, icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className="text-lg font-extrabold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* XP progress */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-900">Level {level} Progress</h2>
            <p className="text-sm text-gray-500">{xpProgress.current} / {xpProgress.next} XP to Level {level + 1}</p>
          </div>
          <Badge className="bg-blue-50 text-blue-700 border-blue-100 font-bold">Level {level}</Badge>
        </div>
        <Progress value={xpProgress.percent} className="h-3 rounded-full" />
        <p className="text-right text-xs text-gray-400 mt-2">{xpProgress.percent}% complete</p>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Languages / Quick start */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900 text-lg">Choose a Language</h2>
            <Link href="/languages" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {languages.map((lang) => (
              <Link key={lang.id} href={`/languages/${lang.slug}`}>
                <div className="group border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer text-center">
                  <div
                    className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: lang.color }}
                  >
                    {(lang.icon || lang.name.slice(0, 2)).toUpperCase()}
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{lang.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{lang.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* XP actions guide */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-5">Earn XP</h2>
          <div className="space-y-3">
            {XP_ACTIONS.map((a) => (
              <div key={a.action} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2.5">
                  <a.icon className={`w-4 h-4 ${a.color}`} />
                  <span className="text-sm text-gray-700">{a.action}</span>
                </div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">+{a.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick action cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Upload Handwritten Code',
            desc: 'Take a photo of your written code and get instant AI feedback.',
            href: '/upload',
            icon: Upload,
            cta: 'Upload now',
            gradient: 'from-blue-500 to-cyan-400',
          },
          {
            title: 'Read & Write Blogs',
            desc: 'Share your learning, read posts from the community, and earn XP.',
            href: '/blogs',
            icon: BookOpen,
            cta: 'Explore blogs',
            gradient: 'from-emerald-500 to-teal-400',
          },
          {
            title: 'Check Leaderboard',
            desc: 'See where you stand among the top coders this week.',
            href: '/leaderboard',
            icon: Trophy,
            cta: 'View rankings',
            gradient: 'from-orange-500 to-amber-400',
          },
          {
            title: 'My Reviews',
            desc: 'Manage ratings and reviews you have written for lessons.',
            href: '/dashboard/reviews',
            icon: Star,
            cta: 'View reviews',
            gradient: 'from-indigo-500 to-purple-400',
          },
        ].map((card) => (
          <div key={card.title} className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-white relative overflow-hidden group`}>
            <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <card.icon className="w-16 h-16" />
            </div>
            <card.icon className="w-6 h-6 mb-3 relative z-10" />
            <h3 className="font-bold text-lg mb-2 relative z-10">{card.title}</h3>
            <p className="text-white/80 text-sm mb-4 relative z-10">{card.desc}</p>
            <Link href={card.href}>
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 relative z-10">
                {card.cta} <ArrowRight className="w-3 h-3 ml-1.5" />
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Certificates section */}
      {certificates.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> My Certificates
            </h2>
            <Badge className="bg-amber-50 text-amber-700 border-amber-100">{certificates.length} earned</Badge>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white relative overflow-hidden group">
                <div className="absolute right-3 top-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Award className="w-16 h-16" />
                </div>
                <Award className="w-6 h-6 text-amber-400 mb-2" />
                <h3 className="font-bold text-sm truncate">{cert.title}</h3>
                {cert.description && <p className="text-slate-400 text-xs mt-1 line-clamp-2">{cert.description}</p>}
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-slate-500">Issued {new Date(cert.issuedAt).toLocaleDateString()}</p>
                  <a
                    href={`/api/certificate?title=${encodeURIComponent(cert.title)}&name=${encodeURIComponent(profile?.displayName || profile?.username || '')}&description=${encodeURIComponent(cert.description)}&issuedAt=${encodeURIComponent(cert.issuedAt)}&issuedBy=${encodeURIComponent(cert.issuedBy)}`}
                    download
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
                  >
                    <Download className="w-3 h-3" /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity placeholder */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900 text-lg">Recent Activity</h2>
          <Clock className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">No activity yet</p>
          <p className="text-gray-400 text-sm mt-1">Complete a lesson or upload code to get started.</p>
          <Link href="/languages" className="mt-4">
            <Button size="sm" variant="outline">Start a lesson</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
