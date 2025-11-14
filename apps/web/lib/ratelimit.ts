import { RateLimiterRedis } from "rate-limiter-flexible";
import { getRedis } from "./redis/redis";


let apiLimiter:RateLimiterRedis |null=null;
export function getApiLimiter() {
  if (!apiLimiter) {
    apiLimiter = new RateLimiterRedis({
      storeClient: getRedis(),
      points: 30,
      duration: 10,
      keyPrefix: "api",
    });
  }
  return apiLimiter;
}
let bookingLimiter:RateLimiterRedis|null=null;
export function getbookingLimiter(){
    if(!bookingLimiter){
            bookingLimiter= new RateLimiterRedis({
                storeClient:getRedis(),
                points:3,
                duration:10,
                keyPrefix:"bookingLimter"
            })
    }
    return bookingLimiter
}