import { prisma } from '../../config/prisma.js';
export const languagesRepo = {
    list(query) {
        const isActiveRaw = typeof query.isActive === 'string' ? query.isActive : undefined;
        const isActive = isActiveRaw === 'true' ? true : isActiveRaw === 'false' ? false : undefined;
        const slug = typeof query.slug === 'string' ? query.slug : undefined;
        return prisma.language.findMany({
            where: {
                isActive,
                slug,
            },
            orderBy: { sortOrder: 'asc' },
        });
    },
    getBySlug(slug) {
        return prisma.language.findUnique({ where: { slug } });
    },
};
