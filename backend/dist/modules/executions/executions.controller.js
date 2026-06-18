import { z } from 'zod';
import { executionsService } from './executions.service.js';
const runSchema = z.object({
    chapterId: z.string().optional(),
    language: z.string().min(1),
    sourceCode: z.string().min(1),
    stdin: z.string().optional(),
});
const ocrSchema = z.object({
    base64Image: z.string().min(1),
    languageHint: z.string().optional(),
});
export async function runCode(req, res) {
    const userId = res.locals.user?.id;
    if (!userId)
        return res.status(401).json({ error: 'Unauthorized' });
    const parsed = runSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const result = await executionsService.runCode({ userId, ...parsed.data });
    return res.json(result);
}
export async function extractCode(req, res) {
    const parsed = ocrSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const result = await executionsService.extractCodeFromImage(parsed.data);
    return res.json(result);
}
