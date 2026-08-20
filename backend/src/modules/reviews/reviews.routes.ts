import { Router } from 'express';
import { asyncHandler } from '../../utils/response.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.js';
import {
  getLessonReviews,
  getMyReviews,
  getAllReviews,
  addReview,
  replyReview,
  deleteReview
} from './reviews.controller.js';

export const reviewsRouter = Router();

reviewsRouter.get('/me', requireAuth, asyncHandler(getMyReviews));
reviewsRouter.get('/admin', requireAuth, requireAdmin, asyncHandler(getAllReviews));
reviewsRouter.patch('/:id/reply', requireAuth, requireAdmin, asyncHandler(replyReview));
reviewsRouter.delete('/:id', requireAuth, requireAdmin, asyncHandler(deleteReview));

