import { getApiLimiter } from "lib/ratelimit";
import { NextRequest, NextResponse } from "next/server"


export const config={
    matcher:["/api/:path*","/booking/:path*"]
}

export default async function middleware(req:NextRequest){
    const ip=req.headers.get("x-forwarded-for")||"unknown";
    const limiter=getApiLimiter();
    try {
        await limiter.consume(ip);
    } catch (error) {
         return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
    }
    return NextResponse.next()
}