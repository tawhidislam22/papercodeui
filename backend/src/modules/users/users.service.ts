import { usersRepo } from './users.repo.js';

export const usersService = {
  list(query: Record<string, unknown>) {
    return usersRepo.list(query);
  },
  getById(id: string) {
    return usersRepo.getById(id);
  },
  update(id: string, data: Record<string, unknown>) {
    return usersRepo.update(id, data);
  },
};
