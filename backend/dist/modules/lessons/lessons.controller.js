import { lessonsService } from './lessons.service.js';
export async function listLessons(req, res) {
    const userId = res.locals.user?.id;
    const lessons = await lessonsService.list(req.query, userId);
    return res.json(lessons);
}
export async function getLessonBySlug(req, res) {
    const userId = res.locals.user?.id;
    const lesson = await lessonsService.getBySlug(req.params.slug, userId);
    if (!lesson)
        return res.status(404).json({ error: 'Not found' });
    return res.json(lesson);
}
