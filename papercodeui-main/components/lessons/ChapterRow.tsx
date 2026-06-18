'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, PlayCircle } from 'lucide-react';
import type { LessonChapter } from '@/lib/api';

export function ChapterRow({
  chapter,
  isLocked,
  isActive,
  index,
}: {
  chapter: LessonChapter;
  isLocked: boolean;
  isActive: boolean;
  index: number;
}) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className={`flex items-start gap-4 rounded-2xl border p-5 transition-all ${
        isLocked
          ? 'bg-gray-50 border-gray-100 text-gray-400'
          : isActive
            ? 'bg-white border-blue-200 shadow-md'
            : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm'
      }`}
    >
      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${
        chapter.progress?.isCompleted
          ? 'bg-emerald-50 text-emerald-600'
          : isLocked
            ? 'bg-gray-100 text-gray-400'
            : 'bg-blue-50 text-blue-600'
      }`}>
        {chapter.progress?.isCompleted ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : isLocked ? (
          <Lock className="h-5 w-5" />
        ) : (
          <PlayCircle className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
            {chapter.title}
          </h3>
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
            +{chapter.xpReward} XP
          </span>
        </div>
        <p className={`text-sm mt-1 ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>{chapter.description}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400 mt-3">
          <span>{chapter.blocksCount} blocks</span>
          <span>{chapter.estimatedMinutes} min</span>
          {chapter.progress?.isCompleted ? <span className="text-emerald-600">Completed</span> : null}
        </div>
      </div>
    </motion.div>
  );

  if (isLocked) {
    return <div aria-disabled>{content}</div>;
  }

  return <Link href={`/chapters/${chapter.id}`}>{content}</Link>;
}
