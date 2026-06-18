import type { Request, Response } from 'express';
import { authService } from './auth.service.js';

export async function register(req: Request, res: Response) {
  const result = await authService.register(req.body);
  return res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body);
  return res.status(200).json(result);
}

export async function logout(_req: Request, res: Response) {
  await authService.logout();
  return res.status(204).send();
}

export async function getSession(_req: Request, res: Response) {
  const session = await authService.getSession();
  return res.status(200).json(session);
}
