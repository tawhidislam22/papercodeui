import { Router } from 'express';
import { asyncHandler } from '../../utils/response.js';
import { awardXp, listMyXp } from './xp.controller.js';
import { requireAuth } from '../../middlewares/auth.js';
export const xpRouter = Router();
xpRouter.get('/me', requireAuth, asyncHandler(listMyXp));
xpRouter.post('/', requireAuth, asyncHandler(awardXp));
