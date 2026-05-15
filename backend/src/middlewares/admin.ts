import type { NextFunction, Request, Response } from 'express';

export function requireAdmin(_req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  return next();
}
