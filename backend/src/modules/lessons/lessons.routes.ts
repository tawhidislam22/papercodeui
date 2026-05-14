import { Router } from 'express';
import { asyncHandler } from '../../utils/response.js';
import { getLessonById, listLessons } from './lessons.controller.js';

export const lessonsRouter = Router();

lessonsRouter.get('/', asyncHandler(listLessons));
lessonsRouter.get('/:id', asyncHandler(getLessonById));
