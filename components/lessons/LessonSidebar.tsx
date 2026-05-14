'use client';

import { motion } from 'framer-motion';
import { BookOpen, Flame, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function LessonSidebar({
  totalChapters,
  completedChapters,
  totalMinutes,
  xpReward,
}: {
  totalChapters: number;
  completedChapters: number;
  totalMinutes: number;
  xpReward: number;
}) {
  const progressPercent = totalChapters ? Math.round((completedChapters / totalChapters) * 100) : 0;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-24 rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
        <Sparkles className="h-4 w-4" />
        Lesson progress
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
          <span>{completedChapters} / {totalChapters} chapters</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" />Total time</span>
          <span className="font-semibold text-gray-900">{totalMinutes} min</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-2"><Flame className="h-4 w-4" />XP reward</span>
          <span className="font-semibold text-gray-900">+{xpReward}</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-blue-600 text-white p-4">
        <p className="text-xs uppercase tracking-widest text-blue-100">Next milestone</p>
        <p className="text-lg font-semibold mt-1">Earn a streak bonus</p>
        <p className="text-xs text-blue-100 mt-2">Complete two chapters today to unlock +25 XP.</p>
        <Badge className="mt-3 bg-white/20 text-white border-white/30">Bonus active</Badge>
      </div>
    </motion.aside>
  );
}
