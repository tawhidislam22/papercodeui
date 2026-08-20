import { prisma } from '../../config/prisma.js';
export const reviewsRepo = {
    getForLesson(lessonId) {
        return prisma.review.findMany({
            where: { lessonId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, username: true, displayName: true } }
            }
        });
    },
    getMyReviews(userId) {
        return prisma.review.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                lesson: { select: { id: true, title: true, slug: true } }
            }
        });
    },
    getAll() {
        return prisma.review.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, username: true, displayName: true } },
                lesson: { select: { id: true, title: true, slug: true } }
            }
        });
    },
    async upsert(userId, lessonId, rating, content) {
        const review = await prisma.review.upsert({
            where: { lessonId_userId: { lessonId, userId } },
            update: { rating, content },
            create: { lessonId, userId, rating, content },
            include: {
                user: { select: { id: true, username: true, displayName: true } }
            }
        });
        // Update lesson averages
        const aggr = await prisma.review.aggregate({
            where: { lessonId },
            _avg: { rating: true },
            _count: { rating: true }
        });
        await prisma.lesson.update({
            where: { id: lessonId },
            data: {
                averageRating: aggr._avg.rating || 0,
                reviewsCount: aggr._count.rating || 0
            }
        });
        return review;
    },
    async addReply(id, reply) {
        return prisma.review.update({
            where: { id },
            data: { reply }
        });
    },
    async delete(id) {
        const review = await prisma.review.findUnique({ where: { id } });
        if (!review)
            return null;
        await prisma.review.delete({ where: { id } });
        // Update lesson averages
        const aggr = await prisma.review.aggregate({
            where: { lessonId: review.lessonId },
            _avg: { rating: true },
            _count: { rating: true }
        });
        await prisma.lesson.update({
            where: { id: review.lessonId },
            data: {
                averageRating: aggr._avg.rating || 0,
                reviewsCount: aggr._count.rating || 0
            }
        });
        return true;
    }
};
