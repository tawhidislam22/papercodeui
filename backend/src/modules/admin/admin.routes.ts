import { Router } from 'express';
import { requireAdmin } from '../../middlewares/admin.js';
import { prisma } from '../../config/prisma.js';

export const adminRouter = Router();

// All admin routes require admin role
adminRouter.use(requireAdmin);

// ══════════════════════════════════════════════════════════════════
// DASHBOARD STATS
// ══════════════════════════════════════════════════════════════════

adminRouter.get('/stats', async (_req, res, next) => {
  try {
    const [users, lessons, chapters, blogs, submissions] = await Promise.all([
      prisma.user.count(),
      prisma.lesson.count(),
      prisma.chapter.count(),
      prisma.blog.count(),
      prisma.submission.count(),
    ]);
    res.json({ users, lessons, chapters, blogs, submissions });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════════════════════
// USER MANAGEMENT
// ══════════════════════════════════════════════════════════════════

adminRouter.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, username: true, displayName: true,
        avatarUrl: true, xp: true, streak: true, role: true,
        createdAt: true, updatedAt: true,
        _count: { select: { submissions: true, blogs: true } },
      },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

adminRouter.patch('/users/:id', async (req, res, next) => {
  try {
    const { role, displayName, bio } = req.body;
    const data: Record<string, unknown> = {};
    if (role) data.role = role;
    if (displayName !== undefined) data.displayName = displayName;
    if (bio !== undefined) data.bio = bio;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

adminRouter.delete('/users/:id', async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════════════════════
// BLOG MANAGEMENT
// ══════════════════════════════════════════════════════════════════

adminRouter.get('/blogs', async (_req, res, next) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, username: true, displayName: true } },
      },
    });
    res.json(blogs);
  } catch (err) {
    next(err);
  }
});

adminRouter.patch('/blogs/:id', async (req, res, next) => {
  try {
    const { isPublished, title, excerpt, tags } = req.body;
    const data: Record<string, unknown> = {};
    if (isPublished !== undefined) data.isPublished = isPublished;
    if (title !== undefined) data.title = title;
    if (excerpt !== undefined) data.excerpt = excerpt;
    if (tags !== undefined) data.tags = tags;

    const blog = await prisma.blog.update({
      where: { id: req.params.id },
      data,
    });
    res.json(blog);
  } catch (err) {
    next(err);
  }
});

adminRouter.delete('/blogs/:id', async (req, res, next) => {
  try {
    await prisma.blog.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// Create blog as admin
adminRouter.post('/blogs', async (req, res, next) => {
  try {
    const { title, excerpt, content, tags, isPublished } = req.body;
    const adminUser = res.locals.user;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const readingTime = Math.max(1, Math.ceil((content || '').split(/\s+/).length / 200));

    const blog = await prisma.blog.create({
      data: {
        authorId: adminUser.id,
        title,
        slug: `${slug}-${Date.now().toString(36)}`,
        excerpt: excerpt || '',
        content: content || '',
        tags: tags || [],
        isPublished: isPublished ?? false,
        readingTime,
      },
      include: {
        author: { select: { id: true, username: true, displayName: true } },
      },
    });
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════════════════════
// LESSON MANAGEMENT
// ══════════════════════════════════════════════════════════════════

adminRouter.get('/lessons', async (_req, res, next) => {
  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        language: { select: { id: true, name: true, slug: true } },
        _count: { select: { chapters: true } },
      },
    });
    res.json(lessons);
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/lessons', async (req, res, next) => {
  try {
    const { languageId, title, slug, description, difficulty, xpReward, estimatedMinutes, sortOrder, isPublished } = req.body;
    const lesson = await prisma.lesson.create({
      data: {
        languageId,
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: description || '',
        difficulty: difficulty || 'BEGINNER',
        xpReward: xpReward || 100,
        estimatedMinutes: estimatedMinutes || 60,
        sortOrder: sortOrder ?? 0,
        isPublished: isPublished ?? false,
      },
    });
    res.status(201).json(lesson);
  } catch (err) {
    next(err);
  }
});

adminRouter.patch('/lessons/:id', async (req, res, next) => {
  try {
    const { title, slug, description, difficulty, xpReward, estimatedMinutes, sortOrder, isPublished } = req.body;
    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (description !== undefined) data.description = description;
    if (difficulty !== undefined) data.difficulty = difficulty;
    if (xpReward !== undefined) data.xpReward = xpReward;
    if (estimatedMinutes !== undefined) data.estimatedMinutes = estimatedMinutes;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;
    if (isPublished !== undefined) data.isPublished = isPublished;

    const lesson = await prisma.lesson.update({
      where: { id: req.params.id },
      data,
    });
    res.json(lesson);
  } catch (err) {
    next(err);
  }
});

adminRouter.delete('/lessons/:id', async (req, res, next) => {
  try {
    await prisma.lesson.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// Batch reorder lessons
adminRouter.patch('/lessons-reorder', async (req, res, next) => {
  try {
    const { items } = req.body as { items: { id: string; sortOrder: number }[] };
    await Promise.all(
      items.map((item) =>
        prisma.lesson.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
      )
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════════════════════
// CHAPTER MANAGEMENT
// ══════════════════════════════════════════════════════════════════

adminRouter.get('/lessons/:lessonId/chapters', async (req, res, next) => {
  try {
    const chapters = await prisma.chapter.findMany({
      where: { lessonId: req.params.lessonId },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { blocks: true } },
      },
    });
    res.json(chapters);
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/chapters', async (req, res, next) => {
  try {
    const { lessonId, title, description, sortOrder, estimatedMinutes, xpReward, isPublished } = req.body;
    const chapter = await prisma.chapter.create({
      data: {
        lessonId,
        title,
        description: description || '',
        sortOrder: sortOrder ?? 0,
        estimatedMinutes: estimatedMinutes || 8,
        xpReward: xpReward || 20,
        isPublished: isPublished ?? false,
      },
    });
    res.status(201).json(chapter);
  } catch (err) {
    next(err);
  }
});

adminRouter.patch('/chapters/:id', async (req, res, next) => {
  try {
    const { title, description, sortOrder, estimatedMinutes, xpReward, isPublished } = req.body;
    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;
    if (estimatedMinutes !== undefined) data.estimatedMinutes = estimatedMinutes;
    if (xpReward !== undefined) data.xpReward = xpReward;
    if (isPublished !== undefined) data.isPublished = isPublished;

    const chapter = await prisma.chapter.update({
      where: { id: req.params.id },
      data,
    });
    res.json(chapter);
  } catch (err) {
    next(err);
  }
});

adminRouter.delete('/chapters/:id', async (req, res, next) => {
  try {
    await prisma.chapter.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// Batch reorder chapters
adminRouter.patch('/chapters-reorder', async (req, res, next) => {
  try {
    const { items } = req.body as { items: { id: string; sortOrder: number }[] };
    await Promise.all(
      items.map((item) =>
        prisma.chapter.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
      )
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════════════════════
// BLOCK MANAGEMENT
// ══════════════════════════════════════════════════════════════════

adminRouter.get('/chapters/:chapterId/blocks', async (req, res, next) => {
  try {
    const blocks = await prisma.lessonBlock.findMany({
      where: { chapterId: req.params.chapterId },
      orderBy: { sortOrder: 'asc' },
      include: { mcq: true, coding: true },
    });
    res.json(blocks);
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/blocks', async (req, res, next) => {
  try {
    const { chapterId, type, sortOrder, title, content, codeLanguage, mcq, coding } = req.body;

    const block = await prisma.lessonBlock.create({
      data: {
        chapterId,
        type: type || 'THEORY',
        sortOrder: sortOrder ?? 0,
        title: title || '',
        content: content || '',
        codeLanguage: codeLanguage || '',
        ...(mcq && type === 'MCQ'
          ? {
              mcq: {
                create: {
                  question: mcq.question,
                  options: mcq.options,
                  correctIndex: mcq.correctIndex,
                  explanation: mcq.explanation || '',
                },
              },
            }
          : {}),
        ...(coding && type === 'CODING'
          ? {
              coding: {
                create: {
                  question: coding.question,
                  starterCode: coding.starterCode || '',
                  expectedOutput: coding.expectedOutput || '',
                  language: coding.language || '',
                  hints: coding.hints || [],
                },
              },
            }
          : {}),
      },
      include: { mcq: true, coding: true },
    });
    res.status(201).json(block);
  } catch (err) {
    next(err);
  }
});

adminRouter.patch('/blocks/:id', async (req, res, next) => {
  try {
    const { type, sortOrder, title, content, codeLanguage, mcq, coding } = req.body;
    const data: Record<string, unknown> = {};
    if (type !== undefined) data.type = type;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (codeLanguage !== undefined) data.codeLanguage = codeLanguage;

    const block = await prisma.lessonBlock.update({
      where: { id: req.params.id },
      data,
      include: { mcq: true, coding: true },
    });

    // Update nested MCQ
    if (mcq && block.mcq) {
      await prisma.mCQQuestion.update({
        where: { id: block.mcq.id },
        data: {
          question: mcq.question ?? block.mcq.question,
          options: mcq.options ?? block.mcq.options,
          correctIndex: mcq.correctIndex ?? block.mcq.correctIndex,
          explanation: mcq.explanation ?? block.mcq.explanation,
        },
      });
    }

    // Update nested Coding
    if (coding && block.coding) {
      await prisma.codingChallenge.update({
        where: { id: block.coding.id },
        data: {
          question: coding.question ?? block.coding.question,
          starterCode: coding.starterCode ?? block.coding.starterCode,
          expectedOutput: coding.expectedOutput ?? block.coding.expectedOutput,
          language: coding.language ?? block.coding.language,
          hints: coding.hints ?? block.coding.hints,
        },
      });
    }

    const updated = await prisma.lessonBlock.findUnique({
      where: { id: req.params.id },
      include: { mcq: true, coding: true },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

adminRouter.delete('/blocks/:id', async (req, res, next) => {
  try {
    await prisma.lessonBlock.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════════════════════
// LANGUAGE MANAGEMENT
// ══════════════════════════════════════════════════════════════════

adminRouter.get('/languages', async (_req, res, next) => {
  try {
    const languages = await prisma.language.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { lessons: true } } },
    });
    res.json(languages);
  } catch (err) {
    next(err);
  }
});

// ══════════════════════════════════════════════════════════════════
// CERTIFICATES (in-memory store, no DB migration needed)
// ══════════════════════════════════════════════════════════════════

const certificates: Map<string, {
  id: string; userId: string; username: string; displayName: string;
  title: string; description: string; issuedAt: string; issuedBy: string;
}> = new Map();

// List all certificates
adminRouter.get('/certificates', async (_req, res) => {
  res.json(Array.from(certificates.values()));
});

// List certificates for a specific user
adminRouter.get('/certificates/user/:userId', async (req, res) => {
  const userCerts = Array.from(certificates.values()).filter(c => c.userId === req.params.userId);
  res.json(userCerts);
});

// Issue a certificate
adminRouter.post('/certificates', async (req, res, next) => {
  try {
    const { userId, title, description } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { username: true, displayName: true } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const adminUser = res.locals.user;
    const cert = {
      id: `cert-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      userId,
      username: user.username,
      displayName: user.displayName,
      title,
      description: description || '',
      issuedAt: new Date().toISOString(),
      issuedBy: adminUser.displayName || adminUser.username,
    };
    certificates.set(cert.id, cert);
    res.status(201).json(cert);
  } catch (err) {
    next(err);
  }
});

// Revoke a certificate
adminRouter.delete('/certificates/:id', async (req, res) => {
  certificates.delete(req.params.id);
  res.status(204).end();
});

// ══════════════════════════════════════════════════════════════════
// LEADERBOARD (admin view with more data)
// ══════════════════════════════════════════════════════════════════

adminRouter.get('/leaderboard', async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 50,
      select: {
        id: true, username: true, displayName: true, avatarUrl: true,
        xp: true, streak: true, role: true, createdAt: true,
        _count: { select: { submissions: true, blogs: true } },
      },
    });
    // Attach certificates count
    const result = users.map(u => ({
      ...u,
      certificatesCount: Array.from(certificates.values()).filter(c => c.userId === u.id).length,
    }));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

