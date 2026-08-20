import { reviewsRepo } from './reviews.repo.js';
export const reviewsService = {
    getForLesson(lessonId) {
        return reviewsRepo.getForLesson(lessonId);
    },
    getMyReviews(userId) {
        return reviewsRepo.getMyReviews(userId);
    },
    getAll() {
        return reviewsRepo.getAll();
    },
    upsert(userId, lessonId, rating, content) {
        return reviewsRepo.upsert(userId, lessonId, rating, content);
    },
    addReply(id, reply) {
        return reviewsRepo.addReply(id, reply);
    },
    delete(id) {
        return reviewsRepo.delete(id);
    }
};
