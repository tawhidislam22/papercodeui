import { prisma } from '../../config/prisma.js';
export const usersRepo = {
    list(_query) {
        return prisma.user.findMany({
            select: { id: true, username: true, displayName: true, avatarUrl: true, xp: true, streak: true, longestStreak: true, role: true, createdAt: true, updatedAt: true },
            take: 50,
        });
    },
    getById(id) {
        return prisma.user.findUnique({
            where: { id },
            select: { id: true, username: true, displayName: true, avatarUrl: true, bio: true, xp: true, streak: true, longestStreak: true, role: true, createdAt: true, updatedAt: true },
        });
    },
    update(id, data) {
        return prisma.user.update({
            where: { id },
            data: {
                displayName: typeof data.displayName === 'string' ? data.displayName : undefined,
                bio: typeof data.bio === 'string' ? data.bio : undefined,
            },
            select: { id: true, username: true, displayName: true, avatarUrl: true, bio: true, xp: true, streak: true, longestStreak: true, role: true, createdAt: true, updatedAt: true },
        });
    },
};
