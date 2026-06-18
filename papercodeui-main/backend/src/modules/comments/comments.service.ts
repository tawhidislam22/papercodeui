import { commentsRepo } from './comments.repo.js';

export const commentsService = {
  list(query: Record<string, unknown>) {
    return commentsRepo.list(query);
  },
  create(userId: string, data: Record<string, unknown>) {
    return commentsRepo.create(userId, data);
  },
};
