
import { auth } from "lib/auth/auth";
import { getApiLimiter} from "lib/ratelimit";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "lib/db";


// let userId="cma6td4xb0003usns9hg3ral2"; // Temporary placeholder for userId


export async function GET(req:NextRequest) {
    const ip=req.headers.get('x-forwarded-for')||"unknown"
    const limiter=getApiLimiter()
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
       
        
   
        const bookedSeats = await prisma.booking.findMany({
            where: {
                userId:sessionuserId,       
            },
            include: {
                seat: true, // Assuming you have a relation set up to get seat details
            },
        });
        console.log("booked seats",bookedSeats);    

         return NextResponse.json({
            success: true,
            bookedSeats: bookedSeats.map((booking:any) => ({
                id: booking.id,
                classType: booking.seat.classType,
                seatId: booking.seat.seatIdentifier, 
            })),
    });        
    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json(
        { error: 'Failed to queue booking' },
        { status: 500 }
        );
    }
}