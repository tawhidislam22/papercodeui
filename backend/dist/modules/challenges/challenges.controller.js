import { challengesService } from './challenges.service.js';
export async function listChallenges(req, res) {
    const challenges = await challengesService.list(req.query);
    return res.json(challenges);
}
export async function getChallengeById(req, res) {
    const challenge = await challengesService.getById(req.params.id);
    if (!challenge)
        return res.status(404).json({ error: 'Not found' });
    return res.json(challenge);
}
