import type { Request, Response } from 'express';
import { blogsService } from './blogs.service.js';

export async function listBlogs(req: Request, res: Response) {
  const blogs = await blogsService.list(req.query);
  return res.json(blogs);
}

export async function getBlogById(req: Request, res: Response) {
  const blog = await blogsService.getById(req.params.id);
  if (!blog) return res.status(404).json({ error: 'Not found' });
  return res.json(blog);
}

export async function createBlog(req: Request, res: Response) {
  if (!res.locals.user) return res.status(401).json({ error: 'Unauthorized' });
  const blog = await blogsService.create(res.locals.user.id, req.body);
  return res.status(201).json(blog);
}

export async function updateBlog(req: Request, res: Response) {
  if (!res.locals.user) return res.status(401).json({ error: 'Unauthorized' });
  const result = await blogsService.update(res.locals.user.id, req.params.id, req.body);
  if (result.count === 0) return res.status(404).json({ error: 'Not found' });
  return res.json({ updated: true });
}
