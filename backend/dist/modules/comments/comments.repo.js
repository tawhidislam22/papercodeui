import { prisma } from '../../config/prisma.js';
export const commentsRepo = {
    list(query) {
        const blogId = typeof query.blogId === 'string' ? query.blogId : undefined;
        return prisma.comment.findMany({
            where: { blogId },
            orderBy: { createdAt: 'desc' },
        });
    },
    create(userId, data) {
        return prisma.comment.create({
            data: {
                userId,
                blogId: typeof data.blogId === 'string' ? data.blogId : '',
                content: typeof data.content === 'string' ? data.content : '',
            },
        });
    },
};
