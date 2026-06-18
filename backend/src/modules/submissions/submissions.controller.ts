import type { Request, Response } from 'express';
import { submissionsService } from './submissions.service.js';

export async function listMySubmissions(_req: Request, res: Response) {
  if (!res.locals.user) return res.status(401).json({ error: 'Unauthorized' });
  const submissions = await submissionsService.listByUser(res.locals.user.id);
  return res.json(submissions);
}

export async function createSubmission(req: Request, res: Response) {
  if (!res.locals.user) return res.status(401).json({ error: 'Unauthorized' });
  const created = await submissionsService.create(res.locals.user.id, req.body);
  return res.status(201).json(created);
}
