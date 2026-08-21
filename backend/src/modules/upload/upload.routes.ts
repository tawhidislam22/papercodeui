import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../middlewares/auth.js';
import { uploadImage } from './upload.controller.js';

const upload = multer({ storage: multer.memoryStorage() });
export const uploadRouter = Router();

uploadRouter.post('/', requireAuth, upload.single('image'), uploadImage);
