import type { Request, Response } from 'express';
import { challengesService } from './challenges.service.js';

export async function listChallenges(req: Request, res: Response) {
  const challenges = await challengesService.list(req.query);
  return res.json(challenges);
}

export async function getChallengeById(req: Request, res: Response) {
  const challenge = await challengesService.getById(req.params.id);
  if (!challenge) return res.status(404).json({ error: 'Not found' });
  return res.json(challenge);
}
