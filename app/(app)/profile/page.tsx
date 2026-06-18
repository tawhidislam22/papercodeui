'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Flame, Trophy, CreditCard as Edit2, Save, X, Upload, TrendingUp, Calendar } from 'lucide-react';
import { api, getDemoUser, type Profile, getLevelFromXP, getXPProgress } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ display_name: '', bio: '', username: '' });

  useEffect(() => {
    async function load() {
      const demoUser = getDemoUser();
      if (!demoUser) { router.push('/auth'); return; }
      const data = await api.users.getMe();
      if (data) {
        setProfile(data);
        setForm({ display_name: data.displayName, bio: data.bio ?? '', username: data.username });
      }
      setLoading(false);
    }
    load();
  }, [router]);

  async function save() {
    if (!profile) return;
    setSaving(true);
    const data = await api.users.updateMe({ displayName: form.display_name, bio: form.bio });
    if (data) setProfile(data);
    setSaving(false);
    setEditing(false);
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-32 bg-gray-100 rounded-2xl" />
        <div className="h-8 bg-gray-100 rounded w-1/3" />
        <div className="h-20 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (!profile) return null;

  const level = getLevelFromXP(profile.xp);
  const xpProgress = getXPProgress(profile.xp);

  const ACTIVITY_ITEMS = [
    { label: 'Total XP', value: `${profile.xp.toLocaleString()} XP`, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Current Streak', value: `${profile.streak} days`, icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Longest Streak', value: `${profile.longestStreak} days`, icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Level', value: `Level ${level}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Cover */}
        <div className="h-28 relative" style={{ background: 'linear-gradient(135deg,#1e3a8a,#0e7490)' }}>
          <div className="absolute inset-0 opacity-10 font-mono text-white text-xs select-none overflow-hidden">
            {['for(i=0;i<n;i++)', 'def solve(n):', 'int main(){'].map((c, i) => (
              <span key={i} className="absolute" style={{ top: `${20 + i * 30}%`, left: `${i * 25}%` }}>{c}</span>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg">
                <AvatarImage src={profile.avatarUrl} />
                <AvatarFallback className="text-2xl font-extrabold text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
                  {(profile.displayName || profile.username).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <Button size="sm" onClick={save} disabled={saving} className="text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
                    <Save className="w-4 h-4 mr-1.5" />{saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-1.5" /> Edit profile
                </Button>
              )}
            </div>
          </div>

          {editing ? (
            <div className="space-y-3">
              <Input
                value={form.display_name}
                onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
                placeholder="Display name"
                className="h-10"
              />
              <Textarea
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="Write a short bio..."
                className="resize-none h-20"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-gray-900">{profile.displayName || profile.username}</h1>
                <Badge className="bg-blue-50 text-blue-700 border-blue-100 font-semibold">Level {level}</Badge>
                {profile.role !== 'USER' && (
                  <Badge className="bg-amber-50 text-amber-700 border-amber-100 capitalize">{profile.role.toLowerCase()}</Badge>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-0.5">@{profile.username}</p>
              {profile.bio && <p className="text-gray-700 text-sm mt-3 leading-relaxed">{profile.bio}</p>}
              <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* XP Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-900">Level {level} — Progress</h2>
            <p className="text-sm text-gray-500">{xpProgress.current} / {xpProgress.next} XP to Level {level + 1}</p>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
            {level}
          </div>
        </div>
        <Progress value={xpProgress.percent} className="h-3 rounded-full" />
        <p className="text-right text-xs text-gray-400 mt-2">{xpProgress.percent}% to next level</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ACTIVITY_ITEMS.map((item) => (
          <div key={item.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center text-center gap-2">
            <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="font-extrabold text-gray-900">{item.value}</p>
            <p className="text-xs text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Recent submissions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-500" />
          Recent Submissions
        </h2>
        <div className="flex flex-col items-center py-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">No submissions yet</p>
          <p className="text-gray-400 text-sm mt-1">Upload your first handwritten code to see it here.</p>
        </div>
      </div>
    </div>
  );
}
