import { progressRepo } from './progress.repo.js';

export const progressService = {
  getLessonProgress(userId: string, lessonId: string) {
    return progressRepo.getLessonProgress(userId, lessonId);
  },
  completeBlock(params: { userId: string; lessonId: string; chapterId: string; blockId: string }) {
    return progressRepo.upsertBlockProgress(params);
  },
  completeChapter(params: { userId: string; lessonId: string; chapterId: string }) {
    return progressRepo.completeChapter(params);
  },
};
