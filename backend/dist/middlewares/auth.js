export function requireAuth(_req, res, next) {
    if (!res.locals.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    return next();
}
