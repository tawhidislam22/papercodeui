'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Flame, Search, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LessonCard } from '@/components/lessons/LessonCard';

const DIFFICULTY_FILTERS = ['all', 'beginner', 'intermediate', 'advanced'] as const;

type DifficultyFilter = (typeof DIFFICULTY_FILTERS)[number];

export default function LessonsHubPage() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [languageId, setLanguageId] = useState<string>('all');

  const languagesQuery = useQuery({
    queryKey: ['languages'],
    queryFn: () => api.languages.list(),
  });

  const lessonsQuery = useQuery({
    queryKey: ['lessons', languageId],
    queryFn: () => (languageId === 'all' ? api.lessons.listByLanguageId() : api.lessons.listByLanguageId(languageId)),
  });

  const languages = languagesQuery.data ?? [];
  const lessons = lessonsQuery.data ?? [];

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesSearch = lesson.title.toLowerCase().includes(search.toLowerCase()) ||
        lesson.description.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = difficulty === 'all' || lesson.difficulty.toLowerCase() === difficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [lessons, search, difficulty]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-8 shadow-[0_30px_80px_rgba(15,23,42,0.1)]"
        >
          <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-cyan-200/40 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold mb-3">
                <Sparkles className="h-4 w-4" />
                AI-powered practice
              </div>
              <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight">
                Master coding through
                <span className="block text-blue-600">interactive lesson paths</span>
              </h1>
              <p className="text-gray-500 mt-3 max-w-2xl">
                Follow curated lesson tracks, unlock chapters, and get instant AI feedback on both typed and handwritten code.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/80 border border-white/60 rounded-2xl px-4 py-3 shadow-sm">
                <Flame className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-500">Active streak</p>
                  <p className="font-semibold text-gray-900">7 days</p>
                </div>
              </div>
              <Button className="rounded-2xl px-5 text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
                Start a new path
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search lessons, challenges, or topics"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-10 h-11 rounded-2xl border border-gray-200 bg-white/80"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={languageId} onValueChange={(value) => setLanguageId(value)}>
              <SelectTrigger className="w-48 rounded-2xl bg-white/80">
                <SelectValue placeholder="All languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All languages</SelectItem>
                {languages.map((language) => (
                  <SelectItem key={language.id} value={language.id}>
                    {language.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 bg-white/80 rounded-2xl p-2 border border-gray-100">
              {DIFFICULTY_FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setDifficulty(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                    difficulty === filter
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="bg-white/70">{filteredLessons.length} lessons</Badge>
          <Badge variant="outline" className="bg-white/70">{lessons.reduce((sum, lesson) => sum + lesson.chaptersCount, 0)} chapters</Badge>
          <Badge variant="outline" className="bg-white/70">{lessons.reduce((sum, lesson) => sum + lesson.xpReward, 0)} XP available</Badge>
        </div>

        {lessonsQuery.isLoading ? (
          <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-52 rounded-2xl bg-white/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLessons.map((lesson, index) => (
              <LessonCard key={lesson.id} lesson={lesson} index={index} />
            ))}
          </div>
        )}

        {!lessonsQuery.isLoading && filteredLessons.length === 0 && (
          <div className="mt-16 text-center">
            <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold">No lessons match your filters</p>
            <p className="text-sm text-gray-400">Try another keyword or reset your filters.</p>
            <Button variant="outline" className="mt-4" onClick={() => {
              setSearch('');
              setDifficulty('all');
              setLanguageId('all');
            }}>
              Reset filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
