import { Router } from 'express';
import { authRouter } from './auth/auth.routes.js';
import { usersRouter } from './users/users.routes.js';
import { lessonsRouter } from './lessons/lessons.routes.js';
import { challengesRouter } from './challenges/challenges.routes.js';
import { submissionsRouter } from './submissions/submissions.routes.js';
import { blogsRouter } from './blogs/blogs.routes.js';
import { commentsRouter } from './comments/comments.routes.js';
import { xpRouter } from './xp/xp.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/lessons', lessonsRouter);
apiRouter.use('/challenges', challengesRouter);
apiRouter.use('/submissions', submissionsRouter);
apiRouter.use('/blogs', blogsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/xp', xpRouter);
