'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Code as Code2, Eye, EyeOff, ArrowLeft, Loader as Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, ensureDemoUser, setDemoUser } from '@/lib/api';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ email: '', password: '', username: '', displayName: '' });

  useEffect(() => {
    if (searchParams.get('tab') === 'register') setTab('register');
  }, [searchParams]);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (tab === 'register') {
        if (!form.username.trim()) throw new Error('Username is required');
        if (form.username.length < 3) throw new Error('Username must be at least 3 characters');
      }

      const demo = ensureDemoUser({
        email: form.email,
        username: form.username || form.email.split('@')[0],
        displayName: form.displayName || form.username || 'Demo User',
      });

      setDemoUser(demo);
      await api.users.getMe();
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1e3a8a,#0e7490)' }}>
        <div className="absolute inset-0 opacity-10 select-none">
          {['for(i=0;i<n;i++)', 'def solve(n):', 'int main(){', 'while(true){', 'console.log()', 'return result;'].map((code, i) => (
            <div
              key={i}
              className="absolute font-mono text-sm font-bold"
              style={{ top: `${15 + i * 14}%`, left: `${5 + (i % 3) * 30}%`, transform: `rotate(${-3 + i * 2}deg)` }}
            >
              {code}
            </div>
          ))}
        </div>
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to home</span>
          </Link>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold">Paper Code</span>
          </div>
          <h2 className="text-3xl font-bold leading-tight">
            The learning platform built for <span className="text-cyan-300">writers</span>
          </h2>
          <p className="text-blue-200 leading-relaxed max-w-sm">
            Write code on paper, upload a photo, and let AI guide you through every mistake.
            The most hands-on way to learn programming.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-sm">
            {[['XP System', 'Earn points for every action'], ['AI Tutor', 'Get instant explanations'], ['6 Languages', 'JS, Python, C, C++...'], ['Live IDE', 'Run code in browser']].map(([title, desc]) => (
              <div key={title} className="bg-white/10 rounded-xl p-4">
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-blue-200 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-blue-300 text-sm">
          2026 Paper Code. All rights reserved.
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">Paper Code</span>
            </Link>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex border border-gray-200 rounded-xl p-1 bg-gray-50">
              <button
                onClick={() => { setTab('login'); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Sign in
              </button>
              <button
                onClick={() => { setTab('register'); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Create account
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {tab === 'login' ? 'Welcome back' : 'Join Paper Code'}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {tab === 'login' ? 'Sign in to continue your learning journey.' : 'Start your coding journey today — it is free.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                  <Input
                    id="username"
                    placeholder="coolcoder42"
                    value={form.username}
                    onChange={(e) => update('username', e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="displayName" className="text-sm font-medium text-gray-700">Display name</Label>
                  <Input
                    id="displayName"
                    placeholder="Alex Johnson"
                    value={form.displayName}
                    onChange={(e) => update('displayName', e.target.value)}
                    className="h-11"
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={tab === 'register' ? 'At least 6 characters' : 'Your password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-white font-semibold"
              style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {tab === 'login' ? 'Signing in...' : 'Creating account...'}</>
              ) : (
                tab === 'login' ? 'Sign in' : 'Create account'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500">
            {tab === 'login' ? (
              <>Don&apos;t have an account?{' '}
                <button onClick={() => setTab('register')} className="text-blue-600 font-medium hover:underline">Sign up free</button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => setTab('login')} className="text-blue-600 font-medium hover:underline">Sign in</button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
