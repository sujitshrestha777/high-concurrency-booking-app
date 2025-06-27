-- CreateEnum
CREATE TYPE "ClassTypes" AS ENUM ('ECONOMY', 'BUSINESS');

-- AlterTable
ALTER TABLE "Seat" ADD COLUMN     "classType" "ClassTypes" NOT NULL DEFAULT 'ECONOMY';
