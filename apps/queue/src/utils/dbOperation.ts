
import { prisma } from '@repo/db';


export async function getBookings() {
  const bookings = await prisma.booking.findMany();
  return bookings;
}




export const getSeatStatusFromDB = async (seatId: string) => {
  const seatStatus = await prisma.seat.findUnique({
    where: {
      id: seatId,
    },
    select: {
      status: true,
    },
  });

  return seatStatus;
};
