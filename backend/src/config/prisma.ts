import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	// Keep connections alive and reduce cold-start overhead on Neon
	max: 10,
	idleTimeoutMillis: 30_000,
	connectionTimeoutMillis: 10_000,
	// Neon closes idle connections aggressively; this keeps them alive
	keepAlive: true,
});

export const prisma = new PrismaClient({
	adapter: new PrismaPg(pool),
});
