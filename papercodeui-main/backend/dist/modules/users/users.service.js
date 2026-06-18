import { usersRepo } from './users.repo.js';
export const usersService = {
    list(query) {
        return usersRepo.list(query);
    },
    getById(id) {
        return usersRepo.getById(id);
    },
    update(id, data) {
        return usersRepo.update(id, data);
    },
};
