
import { error } from "console";
import { auth } from "lib/auth/auth";
import { getBookingQueue } from "lib/queue/queue";
import { getbookingLimiter } from "lib/ratelimit";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";



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
                redirect("/auth/sign-in");
            }
        const userId=session.user.id
        const {seatId}=await req.json() 
        
        const queue=getBookingQueue();
        const job=await queue.add(
            "booking",
            {
                userId,
                seatId
            },
            {
                jobId:`booking-${seatId}-${session.user.id}-${Date.now()}`
            }
        )

         return NextResponse.json({
            success: true,
            jobId: job.id,
            message: 'Booking queued',
    });        
    } catch (error) {
        console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to queue booking' },
      { status: 500 }
    );
    }
}