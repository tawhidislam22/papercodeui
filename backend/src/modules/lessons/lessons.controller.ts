import type { Request, Response } from 'express';
import { lessonsService } from './lessons.service.js';

export async function listLessons(req: Request, res: Response) {
  const lessons = await lessonsService.list(req.query);
  return res.json(lessons);
}

export async function getLessonById(req: Request, res: Response) {
  const lesson = await lessonsService.getById(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Not found' });
  return res.json(lesson);
}
