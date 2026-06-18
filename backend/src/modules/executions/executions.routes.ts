import { Router } from 'express';
import { asyncHandler } from '../../utils/response.js';
import { extractCode, runCode } from './executions.controller.js';

export const executionsRouter = Router();

executionsRouter.post('/run', asyncHandler(runCode));
executionsRouter.post('/ocr', asyncHandler(extractCode));
