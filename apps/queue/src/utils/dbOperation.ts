
import { prisma } from '@repo/db';


export async function getBookings() {
  const bookings = await prisma.booking.findMany();
  return bookings;
}

export async function updateSeatStatusInDB(seatId: string, status: 'AVAILABLE' | 'BOOKED' | 'HELD', userId: string ): Promise<void> {
  await new Promise(res => setTimeout(res, 50)); 
  console.log(seatId,status,userId);
  await prisma.$transaction(async(tx)=>{
      const seat=await tx.seat.findUnique({
        where:{
          seatIdentifier:seatId
        },
        select:{
          id:true
        }
      })
      if (!seat) {
    throw new Error(`Seat with identifier ${seatId} not found`);
  }
    await tx.seat.update({
      where:{seatIdentifier:seatId},
      data:{
      status:"BOOKED",
      currentHolderId:userId
      }
    })
     await tx.booking.create({
        data: {
          seatId: seat.id,
          userId: userId,
          status:'CONFIRMED',
          price: 99.9,
        },
      });
  })
}
export async function publishSeatUpdate(seatId: string, status: 'AVAILABLE' | 'HELD' | 'BOOKED'|'UNAVAILABLE', message: string): Promise<void> {
  await new Promise(res => setTimeout(res, 50)); // Simulate async pub/sub call
    console.log(seatId,status,message);
}


export const getSeatStatusFromDB = async (seatId: string) => {
  const seatStatus = await prisma.seat.findUnique({
    where: {
      seatIdentifier: seatId,
    },
    select: {
      status: true,
    },
  });

  return seatStatus;
};
