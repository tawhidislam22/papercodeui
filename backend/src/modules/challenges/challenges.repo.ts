import { prisma } from '../../config/prisma.js';

export const challengesRepo = {
  list(query: Record<string, unknown>) {
    const lessonId = typeof query.lessonId === 'string' ? query.lessonId : undefined;
    const languageId = typeof query.languageId === 'string' ? query.languageId : undefined;
    return prisma.challenge.findMany({
      where: { isPublished: true, lessonId, languageId },
      orderBy: { createdAt: 'desc' },
    });
  },
  getById(id: string) {
    return prisma.challenge.findFirst({ where: { id, isPublished: true } });
  },
};
