import { Router } from 'express';
import { asyncHandler } from '../../utils/response.js';
import { getChapterById } from './chapters.controller.js';
export const chaptersRouter = Router();
chaptersRouter.get('/:id', asyncHandler(getChapterById));
