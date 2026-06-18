import { lessonsRepo } from './lessons.repo.js';
// In-memory cache for lessons list — keyed by languageId+userId
const listCache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute (shorter since progress can change)
export const lessonsService = {
    async list(query, userId) {
        const languageId = typeof query.languageId === 'string' ? query.languageId : undefined;
        const cacheKey = `${languageId ?? 'all'}:${userId ?? 'anon'}`;
        const cached = listCache.get(cacheKey);
        if (cached && Date.now() - cached.ts < CACHE_TTL) {
            return cached.data;
        }
        const data = await lessonsRepo.list({ languageId, userId });
        listCache.set(cacheKey, { data, ts: Date.now() });
        return data;
    },
    getBySlug(slug, userId) {
        return lessonsRepo.getBySlug(slug, userId);
    },
};
