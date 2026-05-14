import { lessonsRepo } from './lessons.repo.js';

export const lessonsService = {
  list(query: Record<string, unknown>, userId?: string) {
    const languageId = typeof query.languageId === 'string' ? query.languageId : undefined;
    return lessonsRepo.list({ languageId, userId });
  },
  getBySlug(slug: string, userId?: string) {
    return lessonsRepo.getBySlug(slug, userId);
  },
};
