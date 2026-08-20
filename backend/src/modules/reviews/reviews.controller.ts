import type { Request, Response } from 'express';
import { reviewsService } from './reviews.service.js';

export async function getLessonReviews(req: Request, res: Response) {
  const reviews = await reviewsService.getForLesson(req.params.lessonId);
  return res.json(reviews);
}

export async function getMyReviews(req: Request, res: Response) {
  if (!res.locals.user) return res.status(401).json({ error: 'Unauthorized' });
  const reviews = await reviewsService.getMyReviews(res.locals.user.id);
  return res.json(reviews);
}

export async function getAllReviews(req: Request, res: Response) {
  const reviews = await reviewsService.getAll();
  return res.json(reviews);
}

export async function addReview(req: Request, res: Response) {
  if (!res.locals.user) return res.status(401).json({ error: 'Unauthorized' });
  const { rating, content } = req.body;
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid rating' });
  }
  const review = await reviewsService.upsert(res.locals.user.id, req.params.lessonId, rating, content || '');
  return res.status(201).json(review);
}

export async function replyReview(req: Request, res: Response) {
  if (!res.locals.user || res.locals.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const { reply } = req.body;
  const review = await reviewsService.addReply(req.params.id, reply);
  return res.json(review);
}

export async function deleteReview(req: Request, res: Response) {
  if (!res.locals.user || res.locals.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const result = await reviewsService.delete(req.params.id);
  if (!result) return res.status(404).json({ error: 'Not found' });
  return res.json({ deleted: true });
}
