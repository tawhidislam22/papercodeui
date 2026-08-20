import { prisma } from '../../config/prisma.js';

export const bookmarksRepo = {
  list(userId: string) {
    return prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        blog: { select: { id: true, title: true, slug: true, excerpt: true, author: { select: { displayName: true } } } },
        lesson: { select: { id: true, title: true, slug: true, description: true, language: { select: { name: true } } } },
      }
    });
  },
  toggleBlog(userId: string, blogId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.bookmark.findUnique({ where: { blogId_userId: { blogId, userId } } });
      if (existing) {
        await tx.bookmark.delete({ where: { id: existing.id } });
        return { bookmarked: false };
      } else {
        await tx.bookmark.create({ data: { blogId, userId } });
        return { bookmarked: true };
      }
    });
  },
  toggleLesson(userId: string, lessonId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.bookmark.findUnique({ where: { lessonId_userId: { lessonId, userId } } });
      if (existing) {
        await tx.bookmark.delete({ where: { id: existing.id } });
        return { bookmarked: false };
      } else {
        await tx.bookmark.create({ data: { lessonId, userId } });
        return { bookmarked: true };
      }
    });
  }
};