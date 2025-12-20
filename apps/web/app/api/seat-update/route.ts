
import { auth } from "lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "lib/db";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session) { return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
              );
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