import { prisma } from '../../config/prisma.js';

export const lessonsRepo = {
  list(query: Record<string, unknown>) {
    const languageId = typeof query.languageId === 'string' ? query.languageId : undefined;
    return prisma.lesson.findMany({
      where: { isPublished: true, languageId },
      orderBy: { sortOrder: 'asc' },
    });
  },
  getById(id: string) {
    return prisma.lesson.findFirst({ where: { id, isPublished: true } });
  },
};
