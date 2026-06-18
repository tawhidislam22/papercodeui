import { languagesService } from './languages.service.js';
export async function listLanguages(req, res) {
    const languages = await languagesService.list(req.query);
    return res.json(languages);
}
export async function getLanguageBySlug(req, res) {
    const language = await languagesService.getBySlug(req.params.slug);
    if (!language)
        return res.status(404).json({ error: 'Not found' });
    return res.json(language);
}
