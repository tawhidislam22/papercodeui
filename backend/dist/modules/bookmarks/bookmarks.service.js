import { bookmarksRepo } from './bookmarks.repo.js';
export const bookmarksService = {
    list(userId) {
        return bookmarksRepo.list(userId);
    },
    toggleBlog(userId, blogId) {
        return bookmarksRepo.toggleBlog(userId, blogId);
    },
    toggleLesson(userId, lessonId) {
        return bookmarksRepo.toggleLesson(userId, lessonId);
    }
};
