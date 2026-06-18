import { submissionsRepo } from './submissions.repo.js';
export const submissionsService = {
    listByUser(userId) {
        return submissionsRepo.listByUser(userId);
    },
    create(userId, data) {
        return submissionsRepo.create(userId, data);
    },
};
