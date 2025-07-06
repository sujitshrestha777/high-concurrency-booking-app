import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

export const getSeatStatusFromDB = async (seatId: string) => {
  const seatStatus = await prisma.seat.findUnique({
    where: {
      id: seatId,
    },
    select: {
      seatStatus: true,
    },
  });

  return seatStatus;
};
