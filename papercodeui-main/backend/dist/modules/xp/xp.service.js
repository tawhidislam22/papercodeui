import { xpRepo } from './xp.repo.js';
export const xpService = {
    listByUser(userId) {
        return xpRepo.listByUser(userId);
    },
    award(userId, data) {
        return xpRepo.award(userId, data);
    },
};
