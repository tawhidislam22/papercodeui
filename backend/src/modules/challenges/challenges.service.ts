import { challengesRepo } from './challenges.repo.js';

export const challengesService = {
  list(query: Record<string, unknown>) {
    return challengesRepo.list(query);
  },
  getById(id: string) {
    return challengesRepo.getById(id);
  },
};
