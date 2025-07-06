import { Job } from "bullmq";
import { isSeatLocked, withSeatLock } from "../utils/redis.lock";
import { getSeatStatusFromDB } from "src/utils/dbOperation";

type BookingRequest = {
  userId: string;
  seatId: string;
};

export const processBooking = async (job: Job<BookingRequest>) => {
  const { userId, seatId } = job.data;
  const jobId = job.id;

  console.log(`[Worker ${jobId}] Received booking job for Seat: ${seatId}, User: ${userId}`);

  const bookingAttemptResult = await withSeatLock(seatId, async () => {
    console.log(`[Worker ${jobId}] Lock acquired for Seat ${seatId}. Proceeding with booking logic.`);

    const currentDbStatus = await getSeatStatusFromDB(seatId);
    if (currentDbStatus === 'BOOKED' || currentDbStatus === 'UNAVAILABLE') {
      console.warn(`[Worker ${jobId}] Seat ${seatId} already ${currentDbStatus} in DB. Aborting booking within lock.`);
      throw new Error(`Seat ${seatId} is already booked or unavailable in DB.`);
    }
 
    const paymentSuccessful = Math.random() > 0.1;
    if (!paymentSuccessful) {
      console.warn(`[Worker ${jobId}] Payment failed for Seat ${seatId}.`);
      await updateSeatStatusInDB(seatId, 'AVAILABLE', null);
      await publishSeatUpdate(seatId, 'AVAILABLE', `Booking failed for ${seatId}. Seat is now available.`);
      throw new Error(`Payment processing failed for seat ${seatId}.`);
    }

    await updateSeatStatusInDB(seatId, 'BOOKED', userId);
    console.log(`[Worker ${jobId}] Seat ${seatId} successfully BOOKED in DB for User ${userId}.`);

    await publishSeatUpdate(seatId, 'BOOKED', `Seat ${seatId} is now booked!`);

    return { success: true, seatId: seatId, userId: userId, message: 'Booking completed' };
  });

  if (bookingAttemptResult === null) {
    console.warn(`[Worker ${jobId}] Seat ${seatId} could not be locked. It's currently held by another request.`);

    const isCurrentlyLocked = await isSeatLocked(seatId);
    if (isCurrentlyLocked) {
      await publishSeatUpdate(seatId, 'HELD', `Seat ${seatId} is currently held by someone else.`);
    } else {
      await publishSeatUpdate(seatId, 'UNAVAILABLE', `Seat ${seatId} is temporarily unavailable.`);
    }
    throw new Error(`Booking for seat ${seatId} failed: Seat is currently locked.`);
  }

  console.log(`[Worker ${jobId}] Booking job for ${seatId} finished. Result:`, bookingAttemptResult);
};



async function updateSeatStatusInDB(seatId: string, status: 'AVAILABLE' | 'BOOKED' | 'HELD' | 'UNAVAILABLE', userId: string | null): Promise<void> {
  await new Promise(res => setTimeout(res, 50)); // Simulate async DB call
}

async function publishSeatUpdate(seatId: string, status: 'AVAILABLE' | 'HELD' | 'BOOKED' | 'UNAVAILABLE', message: string): Promise<void> {
  await new Promise(res => setTimeout(res, 50)); // Simulate async pub/sub call
}