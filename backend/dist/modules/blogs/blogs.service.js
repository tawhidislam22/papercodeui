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
    delete(userId, id) {
        return blogsRepo.delete(userId, id);
    },
    listMyBlogs(userId) {
        return blogsRepo.listMyBlogs(userId);
    },
    getComments(blogId) {
        return blogsRepo.getComments(blogId);
    },
    addComment(blogId, userId, content, parentId) {
        return blogsRepo.addComment(blogId, userId, content, parentId);
    },
    deleteComment(blogId, commentId, userId) {
        return blogsRepo.deleteComment(blogId, commentId, userId);
    }
};
