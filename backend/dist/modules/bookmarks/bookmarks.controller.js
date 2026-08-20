import { bookmarksService } from './bookmarks.service.js';
export async function listBookmarks(req, res) {
    if (!res.locals.user)
        return res.status(401).json({ error: 'Unauthorized' });
    const bookmarks = await bookmarksService.list(res.locals.user.id);
    return res.json(bookmarks);
}
export async function toggleBlogBookmark(req, res) {
    if (!res.locals.user)
        return res.status(401).json({ error: 'Unauthorized' });
    const result = await bookmarksService.toggleBlog(res.locals.user.id, req.params.id);
    return res.json(result);
}
export async function toggleLessonBookmark(req, res) {
    if (!res.locals.user)
        return res.status(401).json({ error: 'Unauthorized' });
    const result = await bookmarksService.toggleLesson(res.locals.user.id, req.params.id);
    return res.json(result);
}
