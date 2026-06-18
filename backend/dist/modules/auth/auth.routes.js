import { Router } from 'express';
import { asyncHandler } from '../../utils/response.js';
import { getSession, login, logout, register } from './auth.controller.js';
export const authRouter = Router();
authRouter.post('/register', asyncHandler(register));
authRouter.post('/login', asyncHandler(login));
authRouter.post('/logout', asyncHandler(logout));
authRouter.get('/session', asyncHandler(getSession));
