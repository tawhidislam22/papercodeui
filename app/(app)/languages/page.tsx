'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, BookOpen, ChevronRight, Zap } from 'lucide-react';
import { supabase, type Language } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function LanguagesPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('languages').select('*').eq('is_active', true).order('sort_order')
      .then(({ data }) => { if (data) setLanguages(data); setLoading(false); });
  }, []);

  const filtered = languages.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Choose a Language</h1>
        <p className="text-gray-500 mt-2">Select a programming language to start learning. Each language has structured lessons from beginner to advanced.</p>
      </div>

      <div className="relative max-w-sm mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search languages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-11"
        />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="w-14 h-14 bg-gray-100 rounded-xl mb-4" />
              <div className="h-5 bg-gray-100 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((lang) => (
            <Link key={lang.id} href={`/languages/${lang.slug}`}>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: lang.color }}
                  >
                    {lang.icon.toUpperCase().slice(0, 2)}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{lang.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{lang.description}</p>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    Lessons available
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                    <Zap className="w-3.5 h-3.5" />
                    +20 XP per lesson
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No languages found</p>
          <p className="text-gray-400 text-sm">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
