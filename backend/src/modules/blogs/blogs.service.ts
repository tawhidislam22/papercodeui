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
  delete(userId: string, id: string) {
    return blogsRepo.delete(userId, id);
  },
  listMyBlogs(userId: string) {
    return blogsRepo.listMyBlogs(userId);
  },
  getComments(blogId: string) {
    return blogsRepo.getComments(blogId);
  },
  addComment(blogId: string, userId: string, content: string, parentId?: string) {
    return blogsRepo.addComment(blogId, userId, content, parentId);
  },
  deleteComment(blogId: string, commentId: string, userId: string) {
    return blogsRepo.deleteComment(blogId, commentId, userId);
  }
};
