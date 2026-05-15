import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/error.js';
import { apiRouter } from './modules/index.js';
import { prisma } from './config/prisma.js';
export const app = express();
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
// In-memory cache for demo users — avoids hitting DB on every request
const demoUserCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
app.use(async (req, res, next) => {
    const demoUserId = req.header('x-demo-user-id');
    if (!demoUserId)
        return next();
    try {
        // Check cache first
        const cached = demoUserCache.get(demoUserId);
        if (cached && Date.now() - cached.ts < CACHE_TTL) {
            res.locals.user = cached.user;
            return next();
        }
        const usernameHeader = req.header('x-demo-username');
        const displayNameHeader = req.header('x-demo-display-name');
        const emailHeader = req.header('x-demo-email');
        const username = usernameHeader?.trim() || `demo_${demoUserId.slice(0, 8)}`;
        const displayName = displayNameHeader?.trim() || username;
        const email = emailHeader?.trim() || `demo+${demoUserId}@paper.local`;
        let user;
        try {
            user = await prisma.user.upsert({
                where: { id: demoUserId },
                update: { displayName },
                create: {
                    id: demoUserId,
                    email,
                    username,
                    displayName,
                    avatarUrl: '',
                    bio: '',
                },
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                user = await prisma.user.findFirst({
                    where: {
                        OR: [{ email }, { username }]
                    }
                });
                if (!user)
                    throw error;
            }
            else {
                throw error;
            }
        }
        // Cache the user
        demoUserCache.set(demoUserId, { user, ts: Date.now() });
        res.locals.user = user;
        return next();
    }
    catch (error) {
        return next(error);
    }
});
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', apiRouter);
app.use(errorHandler);
