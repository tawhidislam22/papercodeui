import { executionsRepo } from './executions.repo.js';
function buildStubFeedback(isCorrect) {
    if (isCorrect) {
        return {
            verdict: 'correct',
            feedback: 'Great job! Your solution produces the expected output and follows the intended logic.',
            suggestions: 'Try adding comments or edge case tests to make it even more robust.',
        };
    }
    return {
        verdict: 'incorrect',
        feedback: 'Your output did not match the expected result. Check your loop conditions and variables.',
        suggestions: 'Step through the example input and verify each intermediate value.',
    };
}
export const executionsService = {
    async runCode(params) {
        const execution = await executionsRepo.createExecution({
            userId: params.userId,
            chapterId: params.chapterId,
            language: params.language,
            sourceCode: params.sourceCode,
            stdin: params.stdin,
        });
        const judgeUrl = process.env.JUDGE0_URL;
        const judgeKey = process.env.JUDGE0_API_KEY;
        if (!judgeUrl || !judgeKey) {
            const stdout = 'Hello from Paper Code!\n';
            await executionsRepo.updateExecution(execution.id, {
                status: 'SUCCESS',
                stdout,
                durationMs: 120,
            });
            const review = buildStubFeedback(true);
            const aiReview = await executionsRepo.createReview({
                executionId: execution.id,
                userId: params.userId,
                verdict: review.verdict,
                feedback: review.feedback,
                suggestions: review.suggestions,
            });
            return { execution: { ...execution, stdout, status: 'SUCCESS' }, review: aiReview };
        }
        // TODO: Implement real Judge0 execution when credentials are set.
        const stdout = 'Execution queued. Configure JUDGE0_URL and JUDGE0_API_KEY for live runs.';
        await executionsRepo.updateExecution(execution.id, {
            status: 'RUNNING',
            stdout,
        });
        const review = buildStubFeedback(false);
        const aiReview = await executionsRepo.createReview({
            executionId: execution.id,
            userId: params.userId,
            verdict: review.verdict,
            feedback: review.feedback,
            suggestions: review.suggestions,
        });
        return { execution: { ...execution, stdout, status: 'RUNNING' }, review: aiReview };
    },
    async extractCodeFromImage(params) {
        const ollamaUrl = process.env.OLLAMA_URL;
        const ollamaModel = process.env.OLLAMA_MODEL || 'codellama:latest';
        if (!ollamaUrl) {
            return {
                extractedCode: '// Configure OLLAMA_URL to enable OCR extraction.\n',
                confidence: 0.2,
            };
        }
        // TODO: Implement real Ollama vision call once image routing is configured.
        return {
            extractedCode: `// OCR stub for ${params.languageHint || 'code'}\n`,
            confidence: 0.4,
        };
    },
};
