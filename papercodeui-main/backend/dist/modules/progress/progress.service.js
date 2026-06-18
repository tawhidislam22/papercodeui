import { progressRepo } from './progress.repo.js';
export const progressService = {
    getLessonProgress(userId, lessonId) {
        return progressRepo.getLessonProgress(userId, lessonId);
    },
    completeBlock(params) {
        return progressRepo.upsertBlockProgress(params);
    },
    completeChapter(params) {
        return progressRepo.completeChapter(params);
    },
};
