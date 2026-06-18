import { Router } from 'express';
import { asyncHandler } from '../../utils/response.js';
import { completeBlock, completeChapter, getLessonProgress } from './progress.controller.js';

export const progressRouter = Router();

progressRouter.get('/lesson/:lessonId', asyncHandler(getLessonProgress));
progressRouter.post('/chapters/:chapterId/block', asyncHandler(completeBlock));
progressRouter.post('/chapters/:chapterId/complete', asyncHandler(completeChapter));
