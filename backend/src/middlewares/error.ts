import type { NextFunction, Request, Response } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  
  if (err instanceof Error) {
    // Basic error handling for known error strings
    const status = err.message.includes('already exists') || err.message.includes('Invalid') ? 400 : 500;
    return res.status(status).json({ error: err.message });
  }

  // Zod errors
  if (typeof err === 'object' && err !== null && 'issues' in err) {
    return res.status(400).json({ error: 'Validation error', details: err });
  }

  res.status(500).json({ error: 'Internal server error' });
}
