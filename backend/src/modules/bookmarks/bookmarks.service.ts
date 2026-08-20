import { bookmarksRepo } from './bookmarks.repo.js';

export const bookmarksService = {
  list(userId: string) {
    return bookmarksRepo.list(userId);
  },
  toggleBlog(userId: string, blogId: string) {
    return bookmarksRepo.toggleBlog(userId, blogId);
  },
  toggleLesson(userId: string, lessonId: string) {
    return bookmarksRepo.toggleLesson(userId, lessonId);
  }
};
