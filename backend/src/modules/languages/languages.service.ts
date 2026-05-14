import { languagesRepo } from './languages.repo.js';

export const languagesService = {
  list(query: Record<string, unknown>) {
    return languagesRepo.list(query);
  },
  getBySlug(slug: string) {
    return languagesRepo.getBySlug(slug);
  },
};
