import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';

app.listen(env.PORT, async () => {
  console.log(`Backend listening on http://localhost:${env.PORT}`);

  // Warm up the database connection pool on startup
  // so the first user request doesn't pay the Neon cold-start cost
  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    console.log('Database connection pool warmed up');
  } catch (err) {
    console.warn('Database warmup failed (will retry on first request):', err);
  }
});
