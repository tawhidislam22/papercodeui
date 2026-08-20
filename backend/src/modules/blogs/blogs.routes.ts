import { Router } from 'express';
import { asyncHandler } from '../../utils/response.js';
import { createBlog, getBlogById, listBlogs, updateBlog, deleteBlog, listMyBlogs } from './blogs.controller.js';
import { requireAuth } from '../../middlewares/auth.js';

export const blogsRouter = Router();

blogsRouter.get('/', asyncHandler(listBlogs));
blogsRouter.get('/me', requireAuth, asyncHandler(listMyBlogs));
blogsRouter.get('/:id', asyncHandler(getBlogById));
blogsRouter.post('/', requireAuth, asyncHandler(createBlog));
blogsRouter.patch('/:id', requireAuth, asyncHandler(updateBlog));
blogsRouter.delete('/:id', requireAuth, asyncHandler(deleteBlog));
