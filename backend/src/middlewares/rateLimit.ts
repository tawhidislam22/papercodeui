import type { NextFunction, Request, Response } from 'express';

export function rateLimit(_req: Request, _res: Response, next: NextFunction) {
  return next();
}
