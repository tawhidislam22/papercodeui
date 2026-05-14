import { prisma } from '../../config/prisma.js';

export const progressRepo = {
  getLessonProgress(userId: string, lessonId: string) {
    return prisma.userProgress.findMany({
      where: { userId, lessonId },
      orderBy: { updatedAt: 'desc' },
    });
  },
  upsertBlockProgress(params: {
    userId: string;
    lessonId: string;
    chapterId: string;
    blockId: string;
  }) {
    const { userId, lessonId, chapterId, blockId } = params;
    return prisma.userProgress.upsert({
      where: { userId_chapterId: { userId, chapterId } },
      update: {
        currentBlockId: blockId,
        completedBlockIds: {
          push: blockId,
        },
        attempts: { increment: 1 },
      },
      create: {
        userId,
        lessonId,
        chapterId,
        currentBlockId: blockId,
        completedBlockIds: [blockId],
        attempts: 1,
      },
    });
  },
  completeChapter(params: { userId: string; lessonId: string; chapterId: string }) {
    const { userId, lessonId, chapterId } = params;
    return prisma.userProgress.upsert({
      where: { userId_chapterId: { userId, chapterId } },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        chapterId,
        isCompleted: true,
        completedAt: new Date(),
      },
    });
  },
};
