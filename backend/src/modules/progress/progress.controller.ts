import type { Request, Response } from 'express';
import { z } from 'zod';
import { progressService } from './progress.service.js';

const blockSchema = z.object({
  lessonId: z.string().min(1),
  blockId: z.string().min(1),
});

const chapterSchema = z.object({
  lessonId: z.string().min(1),
});

export async function getLessonProgress(req: Request, res: Response) {
  const userId = res.locals.user?.id as string | undefined;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const progress = await progressService.getLessonProgress(userId, req.params.lessonId);
  return res.json(progress);
}

export async function completeBlock(req: Request, res: Response) {
  const userId = res.locals.user?.id as string | undefined;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const parsed = blockSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const progress = await progressService.completeBlock({
    userId,
    lessonId: parsed.data.lessonId,
    chapterId: req.params.chapterId,
    blockId: parsed.data.blockId,
  });

  return res.json(progress);
}

export async function completeChapter(req: Request, res: Response) {
  const userId = res.locals.user?.id as string | undefined;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const parsed = chapterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const progress = await progressService.completeChapter({
    userId,
    lessonId: parsed.data.lessonId,
    chapterId: req.params.chapterId,
  });

  return res.json(progress);
}
