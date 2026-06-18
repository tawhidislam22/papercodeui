import { languagesRepo } from './languages.repo.js';
// In-memory cache — languages rarely change
let cachedList = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
export const languagesService = {
    async list(query) {
        const key = JSON.stringify(query);
        if (cachedList && cachedList.key === key && Date.now() - cachedList.ts < CACHE_TTL) {
            return cachedList.data;
        }
        const data = await languagesRepo.list(query);
        cachedList = { data, ts: Date.now(), key };
        return data;
    },
    getBySlug(slug) {
        return languagesRepo.getBySlug(slug);
    },
};
