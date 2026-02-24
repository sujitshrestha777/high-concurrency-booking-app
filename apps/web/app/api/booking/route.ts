
import { auth } from "lib/auth/auth";
import { getBookingQueue } from "lib/queue/queue";
import { getbookingLimiter } from "lib/ratelimit";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

let userId="cma6td4xb0003usns9hg3ral2"; // Temporary placeholder for userId


export async function POST(req:NextRequest) {
    const ip=req.headers.get('x-forwarded-for')||"unknown"
    const limiter=getbookingLimiter()
    try{
        await limiter.consume(ip)
    }catch{
        return NextResponse.json(
            { error:"too many request wait 10 sec"},
            {status:422}
        )
    }
    try {
        const session = await auth();
        if (!session) { 
                return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
        );
            }
        const sessionuserId=session.user.id
        console.log("session user id",sessionuserId);
        const {seatId}=await req.json() 
        
        const queue=getBookingQueue();
        const job=await queue.add(
            "booking",
            {
                userId:sessionuserId,
                seatId
            },
            {
                jobId:`booking-${seatId}-${sessionuserId}-${Date.now()}`
            }
        )

         return NextResponse.json({
            success: true,
            jobId: job.id,  
            message: 'Booking queued for seat ' + seatId,
    });        
    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json(
        { error: 'Failed to queue booking' },
        { status: 500 }
        );
    }
}