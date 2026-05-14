import { chaptersRepo } from './chapters.repo.js';

export const chaptersService = {
  getById(id: string, userId?: string) {
    return chaptersRepo.getById(id, { userId });
  },
};
