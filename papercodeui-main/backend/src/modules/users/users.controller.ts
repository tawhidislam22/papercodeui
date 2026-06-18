import type { Request, Response } from 'express';
import { usersService } from './users.service.js';

export async function listUsers(req: Request, res: Response) {
  const users = await usersService.list(req.query);
  return res.json(users);
}

export async function getUserById(req: Request, res: Response) {
  const user = await usersService.getById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  return res.json(user);
}

export async function getMe(_req: Request, res: Response) {
  if (!res.locals.user) return res.status(401).json({ error: 'Unauthorized' });
  return res.json(res.locals.user);
}

export async function updateMe(req: Request, res: Response) {
  if (!res.locals.user) return res.status(401).json({ error: 'Unauthorized' });
  const updated = await usersService.update(res.locals.user.id, req.body);
  return res.json(updated);
}
