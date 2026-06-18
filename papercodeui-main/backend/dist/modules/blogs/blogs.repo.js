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
    getById(id) {
        return prisma.blog.findUnique({ where: { id } });
    },
    create(userId, data) {
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
    update(userId, id, data) {
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
};
