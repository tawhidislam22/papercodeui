import { blogsRepo } from './blogs.repo.js';
export const blogsService = {
    list(query) {
        return blogsRepo.list(query);
    },
    getById(id) {
        return blogsRepo.getById(id);
    },
    create(userId, data) {
        return blogsRepo.create(userId, data);
    },
    update(userId, id, data) {
        return blogsRepo.update(userId, id, data);
    },
};
