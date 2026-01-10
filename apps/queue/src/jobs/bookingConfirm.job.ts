import { Job } from "bullmq"
import { IslockedUserSame, releaseSeatLock } from "../utils/redislock.js";
import { updateSeatStatusInDB } from "../utils/dbOperation.js";
import { redisConnection } from "../utils/redis.js";

type bookingConfirmationData={
    bookingId:string;
    status:"SUCCESS" | "FAILED";
    userId:string;
    seatId:string;
}
export const bookingConfirmationJob=async(job:Job<bookingConfirmationData>)=>{
    const {bookingId,status,userId,seatId}=job.data;
    console.log(`Processing booking confirmation for BookingID: ${bookingId}, Status: ${status}, UserID: ${userId}, SeatID: ${seatId}`);

    if(status==="SUCCESS"){
        if(await IslockedUserSame(seatId,userId)){
            await updateSeatStatusInDB(seatId,'BOOKED',userId);//update the seat status in db as BOOKED
           
        
            await redisConnection.publish("SeatUpdateRealtime",JSON.stringify({
                seatId,
                userId,
                type:"Booked"
            }))
            await releaseSeatLock(seatId);
            console.log(`Redis message booked has been published for SeatID: ${seatId} in confirmation job`)
            console.log(`Booking ${bookingId} confirmed successfully for User ${userId} and Seat ${seatId}.`);
        }
        
    }else{
        console.log(`Booking ${bookingId} failed for User ${userId} and Seat ${seatId}.`);

        await redisConnection.publish("SeatUpdateRealtime",JSON.stringify({
            seatId,
            type:"Available"
        }))     
    }   

}
