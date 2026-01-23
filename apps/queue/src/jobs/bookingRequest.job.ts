import { Job } from "bullmq";

import { getSeatStatusFromDB, publishSeatUpdate } from "../utils/dbOperation.js";
import { redisConnection } from "../utils/redis.js";
import {releaseSeatLock, withSeatLock } from "../utils/redislock.js";



type BookingRequest = {
  userId: string;
  seatId: string;
};

export const processBooking = async (job: Job<BookingRequest>) => {
  const { userId, seatId } = job.data;
  const jobId = job.id;

  console.log(`[Worker ${jobId}] Processing seat ${seatId} for user ${userId}`);

 
  const preCheck = await getSeatStatusFromDB(seatId);
  if (preCheck?.status === 'BOOKED') {
    await publishSeatUpdate(seatId, 'BOOKED', 'Seat already booked');
    console.log(`[Worker ${jobId}] Seat ${seatId} is already booked in pre-check`);
    throw new Error(`Seat ${seatId} is already booked`);
  }


  const lockResult = await withSeatLock(seatId,userId, async () => {
    console.log(`[Worker ${jobId}] Lock acquired for ${seatId}`);

   
    const dbStatus = await getSeatStatusFromDB(seatId);
    if (dbStatus?.status === 'BOOKED' || dbStatus?.status === 'HELD') {
      console.warn(`[Worker ${jobId}] Seat ${seatId} status changed to ${dbStatus.status}`);
      throw new Error(`Seat ${seatId} is no longer available`);
      releaseSeatLock(seatId);
    }


    // await updateSeatStatusInDB(seatId, 'HELD', userId);
    console.log(`[Worker ${jobId}] Seat ${seatId} marked as HELD in DB`);

  
    try {
      await redisConnection.publish("SeatUpdateRealtime", JSON.stringify({
        seatId,
        type:"Locked",
        TTL: Date.now() + 180000, // 3 min
      }));
      console.log(`[Worker ${jobId}] Published HELD status for ${seatId}`);
    } catch (pubError) {
      console.error(`[Worker ${jobId}] Pub/sub failed (non-critical):`, pubError);
    }

   
    return { 
      success: true, 
      seatId, 
      userId, 
      heldUntil: Date.now() + 180000 
    };
  });


  if (lockResult === null) {
    console.warn(`[Worker ${jobId}] Could not acquire lock for ${seatId}`);
    

    const currentStatus = await getSeatStatusFromDB(seatId);
    await publishSeatUpdate(
      seatId, 
      currentStatus?.status || 'UNAVAILABLE',
      `Seat ${seatId} is currently held by another user`
    );
    
    throw new Error(`Seat ${seatId} is currently locked`);
  }

  console.log(`[Worker ${jobId}] Successfully processed ${seatId}`);
  return lockResult;
};


