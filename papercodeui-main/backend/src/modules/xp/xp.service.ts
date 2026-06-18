import { xpRepo } from './xp.repo.js';

export const xpService = {
  listByUser(userId: string) {
    return xpRepo.listByUser(userId);
  },
  award(userId: string, data: Record<string, unknown>) {
    return xpRepo.award(userId, data);
  },
};
