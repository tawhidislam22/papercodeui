import { prisma } from '../../config/prisma.js';
import type { ExecutionStatus } from '@prisma/client';

export const executionsRepo = {
  createExecution(data: {
    userId: string;
    chapterId?: string;
    language: string;
    sourceCode: string;
    stdin?: string;
  }) {
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
  updateExecution(id: string, data: {
    status: ExecutionStatus;
    stdout?: string;
    stderr?: string;
    compileOutput?: string;
    durationMs?: number;
  }) {
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
  createReview(data: {
    executionId: string;
    userId: string;
    verdict: string;
    feedback: string;
    suggestions: string;
  }) {
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
