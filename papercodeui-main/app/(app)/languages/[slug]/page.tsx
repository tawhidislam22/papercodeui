'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, ChevronRight, Zap, Lock, CircleCheck as CheckCircle2, Star } from 'lucide-react';
import { api, type Language, type LessonSummary } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  intermediate: 'bg-amber-50 text-amber-700 border-amber-100',
  advanced: 'bg-red-50 text-red-700 border-red-100',
};

export default function LanguageLessonsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [language, setLanguage] = useState<Language | null>(null);
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const lang = await api.languages.getBySlug(slug).catch(() => null);
      if (lang) {
        setLanguage(lang);
        const ls = await api.lessons.listByLanguageId(lang.id).catch(() => [] as LessonSummary[]);
        setLessons(ls);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-48" />
          <div className="h-32 bg-gray-100 rounded-2xl" />
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!language) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 font-medium">Language not found</p>
        <Link href="/languages" className="mt-4 inline-block">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to languages</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/languages" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to languages
      </Link>

      {/* Language header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shrink-0"
          style={{ backgroundColor: language.color }}
        >
          {(language.icon || language.name.slice(0, 2)).toUpperCase().slice(0, 2)}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-gray-900">{language.name}</h1>
          <p className="text-gray-500 mt-2">{language.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <BookOpen className="w-4 h-4" />
              {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-blue-600 font-medium">
              <Zap className="w-4 h-4" />
              Up to {lessons.length * 20} XP
            </div>
          </div>
        </div>
      </div>

      {/* Lessons list */}
      {lessons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Lock className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold text-lg">Lessons coming soon</p>
          <p className="text-gray-400 text-sm mt-2">We are building the {language.name} curriculum. Check back soon!</p>
          <Link href="/upload" className="mt-6 inline-block">
            <Button className="text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
              Upload handwritten code instead
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, i) => {
            const difficulty = lesson.difficulty ? lesson.difficulty.toLowerCase() : 'beginner';
            return (
            <Link key={lesson.id} href={`/lessons/${lesson.slug}`}>
              <div className="bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-md transition-all group flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-400 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{lesson.title}</h3>
                    <Badge className={`${DIFFICULTY_COLOR[difficulty] || DIFFICULTY_COLOR.beginner} text-xs border shrink-0`}>
                      {difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{lesson.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                    <span>{lesson.chaptersCount} chapters</span>
                    <span>{lesson.totalEstimatedMinutes} min</span>
                    <span>{lesson.progressPercent}% complete</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />+{lesson.xpReward} XP
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          );
          })}
        </div>
      )}

      {/* CTA to upload */}
      <div className="mt-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">Ready to practice?</h3>
            <p className="text-blue-100 text-sm mt-1">Write code on paper, upload a photo, and get AI feedback instantly.</p>
          </div>
          <Link href="/upload" className="shrink-0">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
              Upload Code
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
