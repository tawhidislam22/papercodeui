import type { Request, Response } from 'express';
import { xpService } from './xp.service.js';

export async function listMyXp(_req: Request, res: Response) {
  if (!res.locals.user) return res.status(401).json({ error: 'Unauthorized' });
  const events = await xpService.listByUser(res.locals.user.id);
  return res.json(events);
}

export async function awardXp(req: Request, res: Response) {
  if (!res.locals.user) return res.status(401).json({ error: 'Unauthorized' });
  const event = await xpService.award(res.locals.user.id, req.body);
  return res.status(201).json(event);
}
