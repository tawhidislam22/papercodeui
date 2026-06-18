import { Router } from 'express';
import { asyncHandler } from '../../utils/response.js';
import { getMe, getUserById, listUsers, updateMe } from './users.controller.js';
import { requireAuth } from '../../middlewares/auth.js';

export const usersRouter = Router();

usersRouter.get('/', asyncHandler(listUsers));
usersRouter.get('/me', requireAuth, asyncHandler(getMe));
usersRouter.patch('/me', requireAuth, asyncHandler(updateMe));
usersRouter.get('/:id', asyncHandler(getUserById));
