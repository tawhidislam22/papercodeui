import { prisma } from '../../config/prisma.js';

export const blogsRepo = {
  list(query: Record<string, unknown>) {
    const tag = typeof query.tag === 'string' ? query.tag : undefined;
    const search = typeof query.search === 'string' ? query.search : undefined;
    return prisma.blog.findMany({
      where: {
        isPublished: true,
        tags: tag ? { has: tag } : undefined,
        OR: search
          ? [{ title: { contains: search, mode: 'insensitive' } }, { excerpt: { contains: search, mode: 'insensitive' } }]
          : undefined,
      },
      orderBy: { createdAt: 'desc' },
    });
  },
  getById(id: string) {
    return prisma.blog.findUnique({ where: { id } });
  },
  create(userId: string, data: Record<string, unknown>) {
    return prisma.blog.create({
      data: {
        authorId: userId,
        title: typeof data.title === 'string' ? data.title : 'Untitled',
        slug: typeof data.slug === 'string' ? data.slug : `${Date.now()}`,
        excerpt: typeof data.excerpt === 'string' ? data.excerpt : '',
        content: typeof data.content === 'string' ? data.content : '',
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        isPublished: Boolean(data.isPublished),
        readingTime: typeof data.readingTime === 'number' ? data.readingTime : 1,
      },
    });
  },
  update(userId: string, id: string, data: Record<string, unknown>) {
    return prisma.blog.updateMany({
      where: { id, authorId: userId },
      data: {
        title: typeof data.title === 'string' ? data.title : undefined,
        excerpt: typeof data.excerpt === 'string' ? data.excerpt : undefined,
        content: typeof data.content === 'string' ? data.content : undefined,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
        isPublished: typeof data.isPublished === 'boolean' ? data.isPublished : undefined,
      },
    });
  },
  delete(userId: string, id: string) {
    return prisma.blog.deleteMany({
      where: { id, authorId: userId },
    });
  },
  listMyBlogs(userId: string) {
    return prisma.blog.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });
  },
  getComments(blogId: string) {
    return prisma.comment.findMany({
      where: { blogId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, displayName: true } }
      }
    });
  },
  async addComment(blogId: string, userId: string, content: string) {
    const comment = await prisma.comment.create({
      data: { blogId, userId, content },
      include: {
        user: { select: { id: true, username: true, displayName: true } }
      }
    });
    await prisma.blog.update({
      where: { id: blogId },
      data: { commentsCount: { increment: 1 } }
    });
    return comment;
  },
  async deleteComment(blogId: string, commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment || comment.blogId !== blogId || comment.userId !== userId) return null;
    await prisma.comment.delete({ where: { id: commentId } });
    await prisma.blog.update({
      where: { id: blogId },
      data: { commentsCount: { decrement: 1 } }
    });
    return true;
  }
};
