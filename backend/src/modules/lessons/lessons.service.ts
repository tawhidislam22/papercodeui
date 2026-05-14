import { lessonsRepo } from './lessons.repo.js';

export const lessonsService = {
  list(query: Record<string, unknown>) {
    return lessonsRepo.list(query);
  },
  getById(id: string) {
    return lessonsRepo.getById(id);
  },
};
