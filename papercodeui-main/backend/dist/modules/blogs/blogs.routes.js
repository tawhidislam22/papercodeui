import { Router } from 'express';
import { asyncHandler } from '../../utils/response.js';
import { createBlog, getBlogById, listBlogs, updateBlog } from './blogs.controller.js';
import { requireAuth } from '../../middlewares/auth.js';
export const blogsRouter = Router();
blogsRouter.get('/', asyncHandler(listBlogs));
blogsRouter.get('/:id', asyncHandler(getBlogById));
blogsRouter.post('/', requireAuth, asyncHandler(createBlog));
blogsRouter.patch('/:id', requireAuth, asyncHandler(updateBlog));
