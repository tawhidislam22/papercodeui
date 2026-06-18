import { prisma } from '../../config/prisma.js';

export const submissionsRepo = {
  listByUser(userId: string) {
    return prisma.submission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },
  create(userId: string, data: Record<string, unknown>) {
    return prisma.submission.create({
      data: {
        userId,
        challengeId: typeof data.challengeId === 'string' ? data.challengeId : null,
        languageId: typeof data.languageId === 'string' ? data.languageId : null,
        originalImageUrl: typeof data.originalImageUrl === 'string' ? data.originalImageUrl : '',
        extractedCode: typeof data.extractedCode === 'string' ? data.extractedCode : '',
        correctedCode: typeof data.correctedCode === 'string' ? data.correctedCode : '',
        aiFeedback: typeof data.aiFeedback === 'string' ? data.aiFeedback : '',
        aiExplanation: typeof data.aiExplanation === 'string' ? data.aiExplanation : '',
        runOutput: typeof data.runOutput === 'string' ? data.runOutput : '',
        score: typeof data.score === 'number' ? data.score : 0,
      },
    });
  },
};
