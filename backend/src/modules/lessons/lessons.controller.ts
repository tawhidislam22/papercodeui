import type { Request, Response } from 'express';
import { lessonsService } from './lessons.service.js';

export async function listLessons(req: Request, res: Response) {
  const userId = res.locals.user?.id as string | undefined;
  const lessons = await lessonsService.list(req.query, userId);
  return res.json(lessons);
}

export async function getLessonBySlug(req: Request, res: Response) {
  const userId = res.locals.user?.id as string | undefined;
  const lesson = await lessonsService.getBySlug(req.params.slug, userId);
  if (!lesson) return res.status(404).json({ error: 'Not found' });
  return res.json(lesson);
}
