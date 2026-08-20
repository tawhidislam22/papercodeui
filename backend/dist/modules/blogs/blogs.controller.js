import { blogsService } from './blogs.service.js';
export async function listBlogs(req, res) {
    const blogs = await blogsService.list(req.query);
    return res.json(blogs);
}
export async function getBlogById(req, res) {
    const blog = await blogsService.getById(req.params.id);
    if (!blog)
        return res.status(404).json({ error: 'Not found' });
    return res.json(blog);
}
export async function createBlog(req, res) {
    if (!res.locals.user)
        return res.status(401).json({ error: 'Unauthorized' });
    const blog = await blogsService.create(res.locals.user.id, req.body);
    return res.status(201).json(blog);
}
export async function updateBlog(req, res) {
    if (!res.locals.user)
        return res.status(401).json({ error: 'Unauthorized' });
    const result = await blogsService.update(res.locals.user.id, req.params.id, req.body);
    if (result.count === 0)
        return res.status(404).json({ error: 'Not found' });
    return res.json({ updated: true });
}
export async function deleteBlog(req, res) {
    if (!res.locals.user)
        return res.status(401).json({ error: 'Unauthorized' });
    const result = await blogsService.delete(res.locals.user.id, req.params.id);
    if (result.count === 0)
        return res.status(404).json({ error: 'Not found' });
    return res.json({ deleted: true });
}
export async function listMyBlogs(req, res) {
    if (!res.locals.user)
        return res.status(401).json({ error: 'Unauthorized' });
    const blogs = await blogsService.listMyBlogs(res.locals.user.id);
    return res.json(blogs);
}
export async function getComments(req, res) {
    const comments = await blogsService.getComments(req.params.id);
    return res.json(comments);
}
export async function addComment(req, res) {
    if (!res.locals.user)
        return res.status(401).json({ error: 'Unauthorized' });
    if (!req.body.content || typeof req.body.content !== 'string')
        return res.status(400).json({ error: 'Content is required' });
    const comment = await blogsService.addComment(req.params.id, res.locals.user.id, req.body.content, req.body.parentId);
    return res.status(201).json(comment);
}
export async function deleteComment(req, res) {
    if (!res.locals.user)
        return res.status(401).json({ error: 'Unauthorized' });
    const result = await blogsService.deleteComment(req.params.id, req.params.commentId, res.locals.user.id);
    if (!result)
        return res.status(404).json({ error: 'Not found or not authorized' });
    return res.json({ deleted: true });
}
