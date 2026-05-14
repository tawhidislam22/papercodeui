import { prisma } from '../../config/prisma.js';

export const xpRepo = {
  listByUser(userId: string) {
    return prisma.xpEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },
  async award(userId: string, data: Record<string, unknown>) {
    const xpAmount = typeof data.xpAmount === 'number' ? data.xpAmount : 0;
    const event = await prisma.xpEvent.create({
      data: {
        userId,
        eventType: typeof data.eventType === 'string' ? data.eventType : 'custom',
        xpAmount,
        description: typeof data.description === 'string' ? data.description : '',
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: xpAmount } },
    });

    return event;
  },
};
