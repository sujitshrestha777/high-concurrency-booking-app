
// import { auth } from "lib/auth/auth";
import { prisma } from "lib/db";
import { getApiLimiter } from "lib/ratelimit";
import { getRedis } from "lib/redis/redis";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        // const session = await auth();
        // if (!session) { 
        //     return NextResponse.json(
        //             { error: "Unauthorized" },
        //             { status: 401 }
        //                 );
        // }
           const ip=req.headers.get('x-forwarded-for')||"unknown"
            const limiter=getApiLimiter();

                    try {
                    const redisClient = getRedis();
                await limiter.consume(ip);
            } catch (err) {
                console.error("RATE LIMIT / REDIS ERROR:", err);

                return NextResponse.json(
                    {
                        error: "rate limiter failed or too many requests",
                        details: String(err),
                    },
                    { status: 429 }
                );
            }
     
            try{
                await limiter.consume(ip)
            }catch{
                return NextResponse.json(
                    { error:"too many request wait 10 sec"},
                    {status:422}
                )
            }
            const seat_booked_updates = await prisma.seat.findMany({
                where:{
                    status:"BOOKED"
                },
                select:{
                    seatIdentifier:true,
                }
            });
            const booked_seat=seat_booked_updates.map(seat=>seat.seatIdentifier)
            return NextResponse.json({
                success:true,
                booked_seat
            });
        
    } catch (error) {
        console.log("Error in seat update api:",error)
        return NextResponse.json(
            { error: 'Failed to fetch seat updates' },
            { status: 500 }
        )
    }
}