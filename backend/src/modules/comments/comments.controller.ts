import type { Request, Response } from 'express';
import { commentsService } from './comments.service.js';

export async function listComments(req: Request, res: Response) {
  const comments = await commentsService.list(req.query);
  return res.json(comments);
}

export async function createComment(req: Request, res: Response) {
  if (!res.locals.user) return res.status(401).json({ error: 'Unauthorized' });
  const comment = await commentsService.create(res.locals.user.id, req.body);
  return res.status(201).json(comment);
}
