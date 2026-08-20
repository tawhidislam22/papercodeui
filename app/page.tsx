'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Code as Code2, Upload, Zap, BookOpen, Trophy, ArrowRight, Check, ChevronRight, Brain, Camera, Terminal, Sparkles, Play, LayoutDashboard, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getDemoUser } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FEATURES = [
  { icon: Camera, title: 'Write Code on Paper', description: 'The traditional way of learning. Handwriting code builds deeper understanding than just typing.', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Zap, title: 'AI OCR Extraction', description: 'Upload a photo of your handwritten code. Our AI reads and extracts every line precisely.', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: Brain, title: 'Instant AI Correction', description: 'The AI spots syntax errors, logic bugs, and style issues — with beginner-friendly explanations.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Terminal, title: 'Run in Browser IDE', description: 'Your corrected code loads directly into a Monaco IDE. Run it, tweak it, learn from it.', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { icon: BookOpen, title: 'Structured Lessons', description: 'Curated lessons across JavaScript, Python, C, C++ and more — from beginner to advanced.', color: 'text-rose-600', bg: 'bg-rose-50' },
  { icon: Trophy, title: 'XP & Streak Rewards', description: 'Earn XP for every action. Build streaks. Climb the leaderboard and level up your skills.', color: 'text-orange-600', bg: 'bg-orange-50' },
];

const LANGUAGES = [
  { name: 'JavaScript', color: '#ca8a04', bg: 'bg-yellow-50 border-yellow-200', label: 'JS' },
  { name: 'Python', color: '#2563eb', bg: 'bg-blue-50 border-blue-200', label: 'PY' },
  { name: 'C', color: '#475569', bg: 'bg-slate-50 border-slate-200', label: 'C' },
  { name: 'C++', color: '#1d4ed8', bg: 'bg-blue-50 border-blue-200', label: 'C++' },
  { name: 'Java', color: '#c2410c', bg: 'bg-orange-50 border-orange-200', label: 'JV' },
  { name: 'TypeScript', color: '#1d4ed8', bg: 'bg-sky-50 border-sky-200', label: 'TS' },
];

const STEPS = [
  { number: '01', title: 'Choose a Lesson', desc: 'Pick any language and lesson from our structured curriculum.' },
  { number: '02', title: 'Write Code on Paper', desc: 'Solve the challenge the old-school way — pen and paper.' },
  { number: '03', title: 'Snap & Upload', desc: 'Take a photo of your handwritten code and upload it.' },
  { number: '04', title: 'AI Reviews It', desc: 'AI reads, corrects, and explains every error in plain English.' },
  { number: '05', title: 'Run in IDE', desc: 'Your code opens in a VSCode-like editor — test it live.' },
  { number: '06', title: 'Earn XP & Level Up', desc: 'Every submission earns XP, builds your streak, and ranks you.' },
];

const STATS = [
  { value: '6+', label: 'Languages' },
  { value: 'AI', label: 'Powered Feedback' },
  { value: '100%', label: 'Free to Start' },
  { value: 'Inf', label: 'Practice Challenges' },
];

const BLOG_PREVIEWS = [
  { title: 'Why Writing Code by Hand Actually Works', excerpt: 'Research shows handwriting activates deeper cognitive processing than typing. Here is the science behind Paper Code.', tag: 'Learning', tagColor: 'bg-blue-50 text-blue-700', mins: 5 },
  { title: 'From Zero to Hello World in Python', excerpt: 'A complete beginner guide. We take you from never having coded before to running your first Python program.', tag: 'Python', tagColor: 'bg-emerald-50 text-emerald-700', mins: 8 },
  { title: 'Understanding Pointers in C — The Visual Way', excerpt: 'Pointers confuse everyone at first. This guide uses diagrams and handwritten examples to make them click.', tag: 'C', tagColor: 'bg-slate-50 text-slate-700', mins: 12 },
];

const MOBILE_NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#languages', label: 'Languages' },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'write' | 'upload' | 'run'>('write');

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-100 px-4 py-1.5 text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            AI-powered coding education
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
            Learn to code by{' '}
            <span className="gradient-text">writing it by hand</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Write code on paper. Upload a photo. Let AI correct your mistakes, explain every error,
            and open your code in a live IDE — all in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth?tab=register">
              <Button size="lg" className="text-white border-0 text-base px-8 h-12 shadow-lg" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
                Start Learning Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="text-base px-8 h-12">
                <Play className="w-4 h-4 mr-2" />
                See how it works
              </Button>
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo terminal */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            <div className="flex items-center gap-1 px-4 py-3 bg-gray-800 border-b border-gray-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex gap-1 ml-4">
                {(['write', 'upload', 'run'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${activeTab === tab ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-gray-300'}`}
                  >
                    {tab === 'write' ? '1. Write Code' : tab === 'upload' ? '2. Upload Photo' : '3. Run in IDE'}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-8 min-h-56">
              {activeTab === 'write' && (
                <div className="font-mono text-sm space-y-1">
                  <p className="text-gray-500 mb-4"># Handwritten Python code on paper</p>
                  <div><span className="text-blue-400">def</span> <span className="text-yellow-300">fibonacci</span><span className="text-white">(n):</span></div>
                  <div className="pl-4"><span className="text-blue-400">if</span> <span className="text-white">n &lt;= 1:</span></div>
                  <div className="pl-8"><span className="text-blue-400">return</span><span className="text-white"> n</span></div>
                  <div className="pl-4"><span className="text-blue-400">return</span><span className="text-white"> fibonacci(n-1) + fibonacci(n-2)</span></div>
                  <div className="mt-2"><span className="text-yellow-300">print</span><span className="text-white">(fibonacci(10))</span></div>
                </div>
              )}
              {activeTab === 'upload' && (
                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-white font-medium">Image uploaded successfully</p>
                  <div className="space-y-2 w-full max-w-sm">
                    {['OCR extraction...', 'AI code correction...', 'Syntax validation...'].map((step) => (
                      <div key={step} className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'run' && (
                <div className="font-mono text-sm space-y-1">
                  <p className="text-gray-500 mb-4"># Corrected and ready to run</p>
                  <div><span className="text-blue-400">def</span> <span className="text-yellow-300">fibonacci</span><span className="text-white">(n: int) -&gt; int:</span></div>
                  <div className="pl-4"><span className="text-blue-400">if</span><span className="text-white"> n &lt;= 1:</span></div>
                  <div className="pl-8"><span className="text-blue-400">return</span><span className="text-white"> n</span></div>
                  <div className="pl-4"><span className="text-blue-400">return</span><span className="text-white"> fibonacci(n - 1) + fibonacci(n - 2)</span></div>
                  <div className="mt-4 p-3 rounded-lg border border-green-500/30 bg-black/50">
                    <p className="text-green-400">$ python main.py</p>
                    <p className="text-white mt-1">55</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-100">Features</Badge>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Everything you need to learn coding</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              A complete learning system designed around the science of writing.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-100">Process</Badge>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">How Paper Code works</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              From picking up a pen to running live code — the complete Paper Code journey.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.number} className="relative">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow h-full">
                  <div className="text-5xl font-black text-gray-100 mb-3">{s.number}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
                {i < 2 && (
                  <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section id="languages" className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-100">Languages</Badge>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">6 languages to master</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              From beginner-friendly Python to low-level C — a structured path for every goal.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {LANGUAGES.map((lang) => (
              <Link href="/auth?tab=register" key={lang.name}>
                <div className={`${lang.bg} rounded-2xl border p-6 text-center hover:scale-105 transition-transform cursor-pointer`}>
                  <div
                    className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-sm shadow-md"
                    style={{ backgroundColor: lang.color }}
                  >
                    {lang.label}
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{lang.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog previews */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge className="mb-3 bg-blue-50 text-blue-700 border-blue-100">Community Blog</Badge>
              <h2 className="text-4xl font-extrabold text-gray-900">Learn from the community</h2>
            </div>
            <Link href="/blogs">
              <Button variant="outline" className="hidden sm:flex">
                View all posts <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {BLOG_PREVIEWS.map((post) => (
              <Link href="/blogs" key={post.title}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full group">
                  <Badge className={`${post.tagColor} border-0 mb-4 text-xs`}>{post.tag}</Badge>
                  <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-blue-600 transition-colors leading-snug">{post.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  <p className="text-xs text-gray-400">{post.mins} min read</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-12 text-center text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
            <div className="absolute inset-0 opacity-10 select-none pointer-events-none">
              <div className="absolute top-4 left-8 text-6xl font-mono font-black">{'<>'}</div>
              <div className="absolute bottom-4 right-8 text-6xl font-mono font-black">{'</>'}</div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold mb-4">Ready to start learning?</h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of developers who learn by writing. Free, effective, and fun.
              </p>
              <Link href="/auth?tab=register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-base px-10 h-12 font-semibold shadow-xl">
                  Create free account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
