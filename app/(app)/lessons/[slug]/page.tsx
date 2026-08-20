'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import { ArrowLeft, BookOpen, ChevronRight, Heart } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { LessonSidebar } from '@/components/lessons/LessonSidebar';
import { ChapterRow } from '@/components/lessons/ChapterRow';

export default function LessonDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [bookmarked, setBookmarked] = useState(false);

  const lessonQuery = useQuery({
    queryKey: ['lesson', slug],
    queryFn: () => api.lessons.getBySlug(slug),
  });

  const lesson = lessonQuery.data;

  useEffect(() => {
    api.bookmarks.getAll()
      .then((bookmarks: any) => {
        setBookmarked(bookmarks.some((b: any) => b.lesson?.slug === slug));
      })
      .catch(() => null);
  }, [slug]);

  const progressSummary = useMemo(() => {
    if (!lesson) return { completed: 0, total: 0, minutes: 0 };
    const total = lesson.chapters.length;
    const completed = lesson.chapters.filter((chapter: any) => chapter.progress?.isCompleted).length;
    const minutes = lesson.chapters.reduce((sum: number, chapter: any) => sum + (chapter.estimatedMinutes || 0), 0);
    return { completed, total, minutes };
  }, [lesson]);

  if (lessonQuery.isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-10 w-40 bg-gray-100 rounded-xl animate-pulse" />
        <div className="mt-6 grid lg:grid-cols-[1.2fr_0.5fr] gap-8">
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 font-medium">Lesson not found</p>
        <Link href="/lessons" className="mt-4 inline-block">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to lessons</Button>
        </Link>
      </div>
    );
  }

  const chapters = lesson.chapters;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/lessons" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to lessons
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold">
              <BookOpen className="h-4 w-4" /> Lesson path
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mt-2">{lesson.title}</h1>
            <p className="text-gray-500 mt-3 max-w-2xl">{lesson.description}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button
              variant="outline"
              onClick={async () => {
                const demoUser = getDemoUser();
                if (!demoUser) return;
                try {
                  const res = await api.bookmarks.toggleLesson(lesson.id);
                  setBookmarked(res.bookmarked);
                } catch (e) {
                  console.error(e);
                }
              }}
              className={`rounded-2xl gap-2 ${bookmarked ? 'border-blue-200 bg-blue-50 text-blue-600' : ''}`}
            >
              <Heart className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
              {bookmarked ? 'Saved' : 'Save'}
            </Button>
            <Button className="rounded-2xl text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
              Resume learning <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.25fr_0.55fr] gap-8">
        <div className="space-y-4">
          {chapters.map((chapter, index) => {
            const previous = chapters[index - 1];
            const isLocked = Boolean(previous && !previous.progress?.isCompleted);
            const isActive = !chapter.progress?.isCompleted && !isLocked;
            return (
              <ChapterRow
                key={chapter.id}
                chapter={chapter}
                isLocked={isLocked}
                isActive={isActive}
                index={index}
              />
            );
          })}
        </div>

        <LessonSidebar
          totalChapters={progressSummary.total}
          completedChapters={progressSummary.completed}
          totalMinutes={progressSummary.minutes}
          xpReward={lesson.xpReward}
        />
      </div>
    </div>
  );
}
