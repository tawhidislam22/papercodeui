import { prisma } from '../../config/prisma.js';
export const chaptersRepo = {
    async getById(id, options = {}) {
        const chapter = await prisma.chapter.findFirst({
            where: { id, isPublished: true },
            include: {
                lesson: {
                    select: { id: true, title: true, slug: true, difficulty: true, xpReward: true },
                },
                blocks: {
                    orderBy: { sortOrder: 'asc' },
                    include: {
                        mcq: true,
                        coding: true,
                    },
                },
            },
        });
        if (!chapter)
            return null;
        const progress = options.userId
            ? await prisma.userProgress.findUnique({
                where: { userId_chapterId: { userId: options.userId, chapterId: id } },
            })
            : null;
        return {
            id: chapter.id,
            lessonId: chapter.lessonId,
            title: chapter.title,
            description: chapter.description,
            sortOrder: chapter.sortOrder,
            estimatedMinutes: chapter.estimatedMinutes,
            xpReward: chapter.xpReward,
            isPublished: chapter.isPublished,
            createdAt: chapter.createdAt,
            updatedAt: chapter.updatedAt,
            lesson: chapter.lesson,
            progress,
            blocks: chapter.blocks.map((block) => ({
                id: block.id,
                chapterId: block.chapterId,
                type: block.type,
                sortOrder: block.sortOrder,
                title: block.title,
                content: block.content,
                codeLanguage: block.codeLanguage,
                mcq: block.mcq,
                coding: block.coding,
            })),
        };
    },
};
