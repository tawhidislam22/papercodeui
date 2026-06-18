import { commentsRepo } from './comments.repo.js';
export const commentsService = {
    list(query) {
        return commentsRepo.list(query);
    },
    create(userId, data) {
        return commentsRepo.create(userId, data);
    },
};
