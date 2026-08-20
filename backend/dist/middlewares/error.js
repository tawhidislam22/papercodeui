export function errorHandler(err, _req, res, _next) {
    console.error(err);
    if (err instanceof Error) {
        // Basic error handling for known error strings
        const status = err.message.includes('already exists') || err.message.includes('Invalid') ? 400 : 500;
        return res.status(status).json({ error: err.message });
    }
    // Zod errors
    if (typeof err === 'object' && err !== null && 'issues' in err) {
        return res.status(400).json({ error: 'Validation error', details: err });
    }
    res.status(500).json({ error: 'Internal server error' });
}
