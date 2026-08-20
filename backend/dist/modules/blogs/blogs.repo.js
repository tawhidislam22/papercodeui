import { prisma } from '../../config/prisma.js';
export const blogsRepo = {
    list(query) {
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
    async getById(id) {
        const blog = await prisma.blog.findUnique({ where: { id } });
        if (blog) {
            await prisma.blog.update({ where: { id }, data: { views: { increment: 1 } } });
            blog.views += 1;
        }
        return blog;
    },
    create(userId, data) {
        const content = typeof data.content === 'string' ? data.content : '';
        const words = content.split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(words / 200));
        return prisma.blog.create({
            data: {
                authorId: userId,
                title: typeof data.title === 'string' ? data.title : 'Untitled',
                slug: typeof data.slug === 'string' ? data.slug : `${Date.now()}`,
                excerpt: typeof data.excerpt === 'string' ? data.excerpt : '',
                content,
                tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
                isPublished: Boolean(data.isPublished),
                readingTime,
            },
        });
    },
    update(userId, id, data) {
        const updateData = {
            title: typeof data.title === 'string' ? data.title : undefined,
            excerpt: typeof data.excerpt === 'string' ? data.excerpt : undefined,
            content: typeof data.content === 'string' ? data.content : undefined,
            tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
            isPublished: typeof data.isPublished === 'boolean' ? data.isPublished : undefined,
        };
        if (typeof data.content === 'string') {
            updateData.readingTime = Math.max(1, Math.ceil(data.content.split(/\s+/).length / 200));
        }
        return prisma.blog.updateMany({
            where: { id, authorId: userId },
            data: updateData,
        });
    },
    delete(userId, id) {
        return prisma.blog.deleteMany({
            where: { id, authorId: userId },
        });
    },
    listMyBlogs(userId) {
        return prisma.blog.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: 'desc' },
        });
    },
    getComments(blogId) {
        return prisma.comment.findMany({
            where: { blogId, parentId: null },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, username: true, displayName: true } },
                replies: {
                    orderBy: { createdAt: 'asc' },
                    include: { user: { select: { id: true, username: true, displayName: true } } }
                }
            }
        });
    },
    async addComment(blogId, userId, content, parentId) {
        const comment = await prisma.comment.create({
            data: { blogId, userId, content, parentId: parentId || null },
            include: {
                user: { select: { id: true, username: true, displayName: true } },
                replies: {
                    orderBy: { createdAt: 'asc' },
                    include: { user: { select: { id: true, username: true, displayName: true } } }
                }
            }
        });
        await prisma.blog.update({
            where: { id: blogId },
            data: { commentsCount: { increment: 1 } }
        });
        return comment;
    },
    async deleteComment(blogId, commentId, userId) {
        const comment = await prisma.comment.findUnique({ where: { id: commentId }, include: { replies: true } });
        if (!comment || comment.blogId !== blogId || comment.userId !== userId)
            return null;
        await prisma.comment.delete({ where: { id: commentId } });
        await prisma.blog.update({
            where: { id: blogId },
            data: { commentsCount: { decrement: 1 + comment.replies.length } }
        });
        return true;
    }
};
