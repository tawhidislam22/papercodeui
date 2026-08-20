import { Router } from 'express';
import { asyncHandler } from '../../utils/response.js';
import { listBookmarks, toggleBlogBookmark, toggleLessonBookmark } from './bookmarks.controller.js';
import { requireAuth } from '../../middlewares/auth.js';
export const bookmarksRouter = Router();
bookmarksRouter.use(requireAuth);
bookmarksRouter.get('/', asyncHandler(listBookmarks));
bookmarksRouter.post('/blogs/:id', asyncHandler(toggleBlogBookmark));
bookmarksRouter.post('/lessons/:id', asyncHandler(toggleLessonBookmark));
