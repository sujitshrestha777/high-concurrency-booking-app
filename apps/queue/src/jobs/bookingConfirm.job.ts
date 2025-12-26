import { Job } from "bullmq"
import { isSeatLocked, releaseSeatLock } from "../utils/redis.lock";
import { updateSeatStatusInDB } from "../utils/dbOperation";
import { redisConnection } from "../utils/redis";

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
        if(await isSeatLocked(seatId,userId)){
            updateSeatStatusInDB(seatId,'BOOKED',userId);//update the seat status in db as BOOKED
            releaseSeatLock(seatId,userId);//release the seat lock in redis
        
            await redisConnection.publish("SeatUpdateRealtime",JSON.stringify({
                seatId,
                type:"Booked"
            }))
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
