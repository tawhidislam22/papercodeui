import { xpService } from './xp.service.js';
export async function listMyXp(_req, res) {
    if (!res.locals.user)
        return res.status(401).json({ error: 'Unauthorized' });
    const events = await xpService.listByUser(res.locals.user.id);
    return res.json(events);
}
export async function awardXp(req, res) {
    if (!res.locals.user)
        return res.status(401).json({ error: 'Unauthorized' });
    const event = await xpService.award(res.locals.user.id, req.body);
    return res.status(201).json(event);
}
