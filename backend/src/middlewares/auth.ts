import type { NextFunction, Request, Response } from 'express';

export function requireAuth(_req: Request, res: Response, next: NextFunction) {
  if (!res.locals.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
}
