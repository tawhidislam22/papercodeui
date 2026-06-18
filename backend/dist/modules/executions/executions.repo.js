import { prisma } from '../../config/prisma.js';
export const executionsRepo = {
    createExecution(data) {
        return prisma.codeExecution.create({
            data: {
                userId: data.userId,
                chapterId: data.chapterId,
                language: data.language,
                sourceCode: data.sourceCode,
                stdin: data.stdin ?? '',
            },
        });
    },
    updateExecution(id, data) {
        return prisma.codeExecution.update({
            where: { id },
            data: {
                status: data.status,
                stdout: data.stdout ?? '',
                stderr: data.stderr ?? '',
                compileOutput: data.compileOutput ?? '',
                durationMs: data.durationMs ?? 0,
            },
        });
    },
    createReview(data) {
        return prisma.aIReview.create({
            data: {
                executionId: data.executionId,
                userId: data.userId,
                status: 'COMPLETE',
                verdict: data.verdict,
                feedback: data.feedback,
                suggestions: data.suggestions,
            },
        });
    },
};
