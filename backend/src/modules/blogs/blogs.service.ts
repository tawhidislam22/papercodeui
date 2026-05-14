import { blogsRepo } from './blogs.repo.js';

export const blogsService = {
  list(query: Record<string, unknown>) {
    return blogsRepo.list(query);
  },
  getById(id: string) {
    return blogsRepo.getById(id);
  },
  create(userId: string, data: Record<string, unknown>) {
    return blogsRepo.create(userId, data);
  },
  update(userId: string, id: string, data: Record<string, unknown>) {
    return blogsRepo.update(userId, id, data);
  },
};
