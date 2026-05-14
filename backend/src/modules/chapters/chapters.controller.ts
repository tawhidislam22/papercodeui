import type { Request, Response } from 'express';
import { chaptersService } from './chapters.service.js';

export async function getChapterById(req: Request, res: Response) {
  const userId = res.locals.user?.id as string | undefined;
  const chapter = await chaptersService.getById(req.params.id, userId);
  if (!chapter) return res.status(404).json({ error: 'Not found' });
  return res.json(chapter);
}
