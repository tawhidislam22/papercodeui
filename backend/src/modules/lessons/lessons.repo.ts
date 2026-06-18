import { prisma } from '../../config/prisma.js';

type LessonListOptions = {
  languageId?: string;
  userId?: string;
};

export const lessonsRepo = {
  async list({ languageId, userId }: LessonListOptions) {
    const lessons = await prisma.lesson.findMany({
      where: { isPublished: true, languageId },
      orderBy: { sortOrder: 'asc' },
      include: {
        chapters: {
          where: { isPublished: true },
          select: { id: true, estimatedMinutes: true, xpReward: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    const chapterIds = lessons.flatMap((lesson) => lesson.chapters.map((chapter) => chapter.id));
    const progress = userId && chapterIds.length
      ? await prisma.userProgress.findMany({
          where: { userId, chapterId: { in: chapterIds } },
          select: { chapterId: true, isCompleted: true },
        })
      : [];

    const completedByChapter = new Set(
      progress.filter((entry) => entry.isCompleted).map((entry) => entry.chapterId)
    );

    return lessons.map((lesson) => {
      const totalChapters = lesson.chapters.length;
      const completedChapters = lesson.chapters.filter((chapter) => completedByChapter.has(chapter.id)).length;
      const estimatedMinutes = lesson.chapters.reduce((sum, chapter) => sum + (chapter.estimatedMinutes || 0), 0);
      const progressPercent = totalChapters ? Math.round((completedChapters / totalChapters) * 100) : 0;

      return {
        id: lesson.id,
        languageId: lesson.languageId,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        difficulty: lesson.difficulty,
        xpReward: lesson.xpReward,
        estimatedMinutes: lesson.estimatedMinutes,
        sortOrder: lesson.sortOrder,
        isPublished: lesson.isPublished,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt,
        chaptersCount: totalChapters,
        completedChapters,
        progressPercent,
        totalEstimatedMinutes: estimatedMinutes,
      };
    });
  },
  async getBySlug(slug: string, userId?: string) {
    const lesson = await prisma.lesson.findFirst({
      where: { slug, isPublished: true },
      include: {
        chapters: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            blocks: {
              select: { id: true, type: true, sortOrder: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!lesson) return null;

    const chapterIds = lesson.chapters.map((chapter) => chapter.id);
    const progress = userId && chapterIds.length
      ? await prisma.userProgress.findMany({
          where: { userId, chapterId: { in: chapterIds } },
          select: { chapterId: true, isCompleted: true, currentBlockId: true, completedBlockIds: true },
        })
      : [];

    const progressByChapter = new Map(progress.map((entry) => [entry.chapterId, entry]));

    return {
      id: lesson.id,
      languageId: lesson.languageId,
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description,
      difficulty: lesson.difficulty,
      xpReward: lesson.xpReward,
      estimatedMinutes: lesson.estimatedMinutes,
      sortOrder: lesson.sortOrder,
      isPublished: lesson.isPublished,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      chapters: lesson.chapters.map((chapter) => {
        const progressEntry = progressByChapter.get(chapter.id);
        return {
          id: chapter.id,
          lessonId: chapter.lessonId,
          title: chapter.title,
          description: chapter.description,
          sortOrder: chapter.sortOrder,
          estimatedMinutes: chapter.estimatedMinutes,
          xpReward: chapter.xpReward,
          isPublished: chapter.isPublished,
          createdAt: chapter.createdAt,
          updatedAt: chapter.updatedAt,
          blocksCount: chapter.blocks.length,
          progress: progressEntry
            ? {
                currentBlockId: progressEntry.currentBlockId,
                completedBlockIds: progressEntry.completedBlockIds,
                isCompleted: progressEntry.isCompleted,
              }
            : null,
        };
      }),
    };
  },
};
