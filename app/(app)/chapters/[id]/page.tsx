'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { TheoryBlock } from '@/components/lessons/blocks/TheoryBlock';
import { MCQBlock } from '@/components/lessons/blocks/MCQBlock';
import { CodingBlock } from '@/components/lessons/blocks/CodingBlock';
import { useLessonStore } from '@/lib/stores/lesson-store';

export default function ChapterLearningPage() {
  const { id } = useParams<{ id: string }>();
  const [activeIndex, setActiveIndex] = useState(0);
  const { completedBlockIds, setCurrentBlockId, setCompletedBlockIds, markCompleted, resetProgress } = useLessonStore();

  const chapterQuery = useQuery({
    queryKey: ['chapter', id],
    queryFn: () => api.chapters.getById(id),
  });

  const chapter = chapterQuery.data;

  const lessonQuery = useQuery({
    queryKey: ['lesson', chapter?.lesson.slug],
    queryFn: () => api.lessons.getBySlug(chapter!.lesson.slug),
    enabled: !!chapter?.lesson.slug,
  });

  const nextChapterId = useMemo(() => {
    if (!lessonQuery.data || !chapter) return null;
    const chapters = lessonQuery.data.chapters;
    const idx = chapters.findIndex(c => c.id === chapter.id);
    if (idx >= 0 && idx < chapters.length - 1) {
      return chapters[idx + 1].id;
    }
    return null;
  }, [lessonQuery.data, chapter]);

  const blocks = useMemo(() => chapter?.blocks ?? [], [chapter]);

  useEffect(() => {
    if (!chapter || blocks.length === 0) return;
    resetProgress();
    const fromProgress = chapter.progress?.currentBlockId;
    const completed = chapter.progress?.completedBlockIds ?? [];
    setCompletedBlockIds(completed);
    const indexFromProgress = fromProgress ? blocks.findIndex((block) => block.id === fromProgress) : -1;
    const defaultIndex = indexFromProgress >= 0 ? indexFromProgress : completed.length;
    setActiveIndex(defaultIndex);
    setCurrentBlockId(blocks[defaultIndex]?.id);
  }, [chapter, blocks, resetProgress, setCurrentBlockId, setCompletedBlockIds]);

  async function handleCompleteBlock(blockId: string) {
    if (!chapter) return;
    markCompleted(blockId);
    await api.progress.completeBlock(chapter.id, { lessonId: chapter.lessonId, blockId });

    const nextIndex = Math.min(activeIndex + 1, blocks.length - 1);
    setActiveIndex(nextIndex);
    setCurrentBlockId(blocks[nextIndex]?.id);

    if (nextIndex === blocks.length - 1 && blockId === blocks[blocks.length - 1].id) {
      await api.progress.completeChapter(chapter.id, { lessonId: chapter.lessonId });
    }
  }

  if (chapterQuery.isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-8 w-40 bg-gray-100 rounded-lg animate-pulse" />
        <div className="mt-6 h-96 bg-gray-100 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 font-medium">Chapter not found</p>
        <Link href="/lessons" className="mt-4 inline-block">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to lessons</Button>
        </Link>
      </div>
    );
  }

  const activeBlock = blocks[activeIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href={`/lessons/${chapter.lesson.slug}`} className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to {chapter.lesson.title}
      </Link>

      <div className="grid lg:grid-cols-[0.9fr_0.55fr] gap-8">
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-blue-600 font-semibold">Chapter {chapter.sortOrder + 1}</p>
                <h1 className="text-3xl font-semibold text-gray-900 mt-2">{chapter.title}</h1>
                <p className="text-gray-500 mt-2">{chapter.description}</p>
              </div>
              <div className="rounded-2xl bg-blue-600 text-white px-4 py-3">
                <p className="text-xs">XP reward</p>
                <p className="text-lg font-semibold">+{chapter.xpReward}</p>
              </div>
            </div>
          </div>

          {activeBlock && (
            <div>
              {activeBlock.type === 'THEORY' && (
                <TheoryBlock title={activeBlock.title} content={activeBlock.content} />
              )}
              {activeBlock.type === 'MCQ' && activeBlock.mcq && (
                <MCQBlock
                  title={activeBlock.title}
                  question={activeBlock.mcq}
                  onCorrect={() => handleCompleteBlock(activeBlock.id)}
                />
              )}
              {activeBlock.type === 'CODING' && activeBlock.coding && (
                <CodingBlock
                  title={activeBlock.title}
                  challenge={activeBlock.coding}
                  chapterId={chapter.id}
                  onCorrect={() => handleCompleteBlock(activeBlock.id)}
                />
              )}

              {activeBlock.type === 'THEORY' && !(activeIndex === blocks.length - 1 && completedBlockIds.includes(activeBlock.id)) && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => handleCompleteBlock(activeBlock.id)} className="rounded-xl">
                    Continue
                  </Button>
                </div>
              )}

              {activeIndex === blocks.length - 1 && completedBlockIds.includes(activeBlock.id) && (
                <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
                  <Link href={nextChapterId ? `/chapters/${nextChapterId}` : `/lessons/${chapter.lesson.slug}`}>
                    <Button className="rounded-xl shadow-lg hover:shadow-xl transition-all" size="lg" style={{ background: 'linear-gradient(135deg,#10b981,#3b82f6)' }}>
                      {nextChapterId ? 'Continue to Next Chapter' : 'Complete Lesson'} <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="sticky top-24 h-fit rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
            <Sparkles className="h-4 w-4" /> Learning flow
          </div>
          <div className="mt-4 space-y-3">
            {blocks.map((block, index) => {
              const isCompleted = completedBlockIds.includes(block.id);
              const isLocked = index > activeIndex;
              return (
                <div
                  key={block.id}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2 border ${
                    isLocked ? 'border-gray-100 text-gray-400' : 'border-blue-100 text-gray-700'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : isLocked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                  )}
                  <div className="text-sm">
                    <p className="font-medium">{block.title || block.type}</p>
                    <p className="text-xs text-gray-400">Block {index + 1}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-4">
            <p className="text-xs uppercase tracking-widest text-blue-100">Active block</p>
            <p className="text-lg font-semibold mt-1">{activeBlock?.title || 'Loading...'}</p>
            <p className="text-xs text-blue-100 mt-2">Finish this block to unlock the next step.</p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
