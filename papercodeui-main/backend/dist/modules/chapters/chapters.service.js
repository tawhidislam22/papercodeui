import { chaptersRepo } from './chapters.repo.js';
export const chaptersService = {
    getById(id, userId) {
        return chaptersRepo.getById(id, { userId });
    },
};
