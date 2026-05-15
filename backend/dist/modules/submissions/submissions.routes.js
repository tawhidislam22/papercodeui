import { Router } from 'express';
import { asyncHandler } from '../../utils/response.js';
import { createSubmission, listMySubmissions } from './submissions.controller.js';
import { requireAuth } from '../../middlewares/auth.js';
export const submissionsRouter = Router();
submissionsRouter.get('/me', requireAuth, asyncHandler(listMySubmissions));
submissionsRouter.post('/', requireAuth, asyncHandler(createSubmission));
