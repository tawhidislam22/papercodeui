import { Router } from 'express';
import { asyncHandler } from '../../utils/response.js';
import { createComment, listComments } from './comments.controller.js';
import { requireAuth } from '../../middlewares/auth.js';
export const commentsRouter = Router();
commentsRouter.get('/', asyncHandler(listComments));
commentsRouter.post('/', requireAuth, asyncHandler(createComment));
