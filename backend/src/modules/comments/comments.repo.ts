import { prisma } from '../../config/prisma.js';

export const commentsRepo = {
  list(query: Record<string, unknown>) {
    const blogId = typeof query.blogId === 'string' ? query.blogId : undefined;
    return prisma.comment.findMany({
      where: { blogId },
      orderBy: { createdAt: 'desc' },
    });
  },
  create(userId: string, data: Record<string, unknown>) {
    return prisma.comment.create({
      data: {
        userId,
        blogId: typeof data.blogId === 'string' ? data.blogId : '',
        content: typeof data.content === 'string' ? data.content : '',
      },
    });
  },
};
