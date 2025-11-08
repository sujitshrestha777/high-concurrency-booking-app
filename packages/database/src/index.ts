// packages/database/src/index.ts
// Export a runtime Prisma singleton plus types so other packages can import
// a single shared Prisma instance from `@repo/db`.
import { PrismaClient, Prisma } from '@prisma/client';

declare global {
	// store the Prisma client on the global object during development to prevent
	// exhausting database connections from hot reloads
	// eslint-disable-next-line vars-on-top, no-var
	var __repo_prisma: PrismaClient | undefined;
}

export const prisma = global.__repo_prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
	global.__repo_prisma = prisma;
}

export type { Prisma, PrismaClient };