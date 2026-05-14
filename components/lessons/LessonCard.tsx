'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { LessonSummary } from '@/lib/api';

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  intermediate: 'bg-amber-50 text-amber-700 border-amber-100',
  advanced: 'bg-rose-50 text-rose-700 border-rose-100',
};

export function LessonCard({ lesson, index }: { lesson: LessonSummary; index: number }) {
  const difficulty = lesson.difficulty ? lesson.difficulty.toLowerCase() : 'beginner';

  return (
    <Link href={`/lessons/${lesson.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.4 }}
        className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(37,99,235,0.16)] transition-all"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'radial-gradient(circle at top left, rgba(59,130,246,0.12), transparent 55%)' }} />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`border text-xs ${DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES.beginner}`}>
                {difficulty}
              </Badge>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {lesson.progressPercent}% progress
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 leading-tight">{lesson.title}</h3>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{lesson.description}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <div className="relative z-10 mt-6 grid grid-cols-3 gap-3 text-xs text-gray-500">
          <div className="rounded-xl bg-white/70 px-3 py-2 border border-white/80">
            <div className="font-semibold text-gray-900">{lesson.chaptersCount}</div>
            <div className="text-[11px]">Chapters</div>
          </div>
          <div className="rounded-xl bg-white/70 px-3 py-2 border border-white/80">
            <div className="font-semibold text-gray-900">{lesson.totalEstimatedMinutes}m</div>
            <div className="text-[11px]">Total time</div>
          </div>
          <div className="rounded-xl bg-white/70 px-3 py-2 border border-white/80">
            <div className="font-semibold text-gray-900">+{lesson.xpReward}</div>
            <div className="text-[11px]">XP reward</div>
          </div>
        </div>

        <div className="relative z-10 mt-5 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            {lesson.estimatedMinutes} min per lesson
          </div>
          <div className="h-1.5 flex-1 mx-3 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              style={{ width: `${lesson.progressPercent}%` }}
            />
          </div>
          <span>{lesson.progressPercent}%</span>
        </div>
      </motion.div>
    </Link>
  );
}
