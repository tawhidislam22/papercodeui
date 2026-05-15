import { prisma } from '../../config/prisma.js';
export const challengesRepo = {
    list(query) {
        const lessonId = typeof query.lessonId === 'string' ? query.lessonId : undefined;
        const languageId = typeof query.languageId === 'string' ? query.languageId : undefined;
        return prisma.challenge.findMany({
            where: { isPublished: true, lessonId, languageId },
            orderBy: { createdAt: 'desc' },
        });
    },
    getById(id) {
        return prisma.challenge.findFirst({ where: { id, isPublished: true } });
    },
};
