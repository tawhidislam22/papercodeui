import { challengesRepo } from './challenges.repo.js';
export const challengesService = {
    list(query) {
        return challengesRepo.list(query);
    },
    getById(id) {
        return challengesRepo.getById(id);
    },
};
