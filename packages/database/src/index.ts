export { PrismaClient, Prisma } from '@prisma/client';

import { PrismaClient } from '@prisma/client';

declare global {
  var __repo_prisma: PrismaClient | undefined;
}

const globalForPrisma = global as { __repo_prisma?: PrismaClient };
export const prisma = globalForPrisma.__repo_prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__repo_prisma = prisma;
}