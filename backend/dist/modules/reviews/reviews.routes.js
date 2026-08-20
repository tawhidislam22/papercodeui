import { Router } from 'express';
import { asyncHandler } from '../../utils/response.js';
import { requireAuth } from '../../middlewares/auth.js';
import { getMyReviews, getAllReviews, replyReview, deleteReview } from './reviews.controller.js';
export const reviewsRouter = Router();
reviewsRouter.get('/me', requireAuth, asyncHandler(getMyReviews));
reviewsRouter.get('/admin', requireAuth, asyncHandler(getAllReviews));
reviewsRouter.patch('/:id/reply', requireAuth, asyncHandler(replyReview));
reviewsRouter.delete('/:id', requireAuth, asyncHandler(deleteReview));
