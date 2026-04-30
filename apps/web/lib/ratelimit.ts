// import { RateLimiterRedis } from "rate-limiter-flexible";
// import { getRedis } from "./redis/redis";


// let apiLimiter:RateLimiterRedis |null=null;
// export function getApiLimiter() {
//   if (!apiLimiter) {
//     apiLimiter = new RateLimiterRedis({
//       storeClient: getRedis(),
//       points: 30,
//       duration: 10,
//       keyPrefix: "api",
//     });
//   }
//   return apiLimiter;
// }
// let bookingLimiter:RateLimiterRedis|null=null;
// export function getbookingLimiter(){
//     if(!bookingLimiter){
//             bookingLimiter= new RateLimiterRedis({
//                 storeClient:getRedis(),
//                 points:3,
//                 duration:10,
//                 keyPrefix:"bookingLimter"
//             })
//     }
//     return bookingLimiter
// }
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a single Redis client
const redis = Redis.fromEnv();

// Create a limiter (fixed window: 30 requests per 10 seconds)
export const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(30, "10 s"),
  analytics: true,
  prefix: "api",
});

// Booking limiter (3 requests per 10 seconds)
export const bookingLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(3, "10 s"),
  analytics: true,
  prefix: "bookingLimiter",
});
