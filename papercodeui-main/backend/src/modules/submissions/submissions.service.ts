import { submissionsRepo } from './submissions.repo.js';

export const submissionsService = {
  listByUser(userId: string) {
    return submissionsRepo.listByUser(userId);
  },
  create(userId: string, data: Record<string, unknown>) {
    return submissionsRepo.create(userId, data);
  },
};
