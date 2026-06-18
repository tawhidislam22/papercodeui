import { Router } from 'express';
import { asyncHandler } from '../../utils/response.js';
import { getChallengeById, listChallenges } from './challenges.controller.js';
export const challengesRouter = Router();
challengesRouter.get('/', asyncHandler(listChallenges));
challengesRouter.get('/:id', asyncHandler(getChallengeById));
