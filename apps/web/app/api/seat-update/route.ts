import { prisma } from "lib/db";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";

// Create a single Redis client
const redis = Redis.fromEnv();

// API limiter: 30 requests per 10 seconds
const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(30, "10 s"),
  prefix: "api",
});

// Booking limiter: 3 requests per 10 seconds
const bookingLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(3, "10 s"),
  prefix: "bookingLimiter",
});

export async function GET(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";

    // Health check (optional)
    try {
      await redis.set("healthcheck", "ok");
      const value = await redis.get("healthcheck");
      console.log("Redis connection test:", value);
    } catch (err) {
      console.error("Redis connection failed:", err);
    }

    // API limiter
    const { success } = await apiLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    // Booking limiter
    const { success: bookingOk } = await bookingLimiter.limit(ip);
    if (!bookingOk) {
      return NextResponse.json(
        { error: "Booking requests exceeded, wait 10s" },
        { status: 422 }
      );
    }

    // Fetch booked seats
    const seat_booked_updates = await prisma.seat.findMany({
      where: { status: "BOOKED" },
      select: { seatIdentifier: true },
    });

    const booked_seat = seat_booked_updates.map(seat => seat.seatIdentifier);

    return NextResponse.json({
      success: true,
      booked_seat,
    });
  } catch (error) {
    console.error("Error in seat update api:", error);
    return NextResponse.json(
      { error: "Failed to fetch seat updates" },
      { status: 500 }
    );
  }
}
