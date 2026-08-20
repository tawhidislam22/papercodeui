import { reviewsRepo } from './reviews.repo.js';

export const reviewsService = {
  getForLesson(lessonId: string) {
    return reviewsRepo.getForLesson(lessonId);
  },
  getMyReviews(userId: string) {
    return reviewsRepo.getMyReviews(userId);
  },
  getAll() {
    return reviewsRepo.getAll();
  },
  upsert(userId: string, lessonId: string, rating: number, content: string) {
    return reviewsRepo.upsert(userId, lessonId, rating, content);
  },
  addReply(id: string, reply: string) {
    return reviewsRepo.addReply(id, reply);
  },
  delete(id: string) {
    return reviewsRepo.delete(id);
  }
};
