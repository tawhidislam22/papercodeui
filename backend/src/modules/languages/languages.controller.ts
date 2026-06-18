import type { Request, Response } from 'express';
import { languagesService } from './languages.service.js';

export async function listLanguages(req: Request, res: Response) {
  const languages = await languagesService.list(req.query);
  return res.json(languages);
}

export async function getLanguageBySlug(req: Request, res: Response) {
  const language = await languagesService.getBySlug(req.params.slug);
  if (!language) return res.status(404).json({ error: 'Not found' });
  return res.json(language);
}
