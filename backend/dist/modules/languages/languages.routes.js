import { Router } from 'express';
import { asyncHandler } from '../../utils/response.js';
import { getLanguageBySlug, listLanguages } from './languages.controller.js';
export const languagesRouter = Router();
languagesRouter.get('/', asyncHandler(listLanguages));
languagesRouter.get('/slug/:slug', asyncHandler(getLanguageBySlug));
