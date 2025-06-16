import { Job } from "bullmq";

export const processBooking= async (job:Job)=>{
    const {userId,seatId}=job.data;

    console.log(`booking for the user${userId} and seat${seatId}`);
    // Simulate DB logic
    // TODO: Use Prisma to confirm seat if available, then mark as booked

    await new Promise((res)=>
    setTimeout(res,1000)
    )

    console.log(`✅ Booking job done: User ${userId} -> Seat ${seatId}`);
}