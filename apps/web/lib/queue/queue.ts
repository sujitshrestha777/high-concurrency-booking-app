import {Queue} from "bullmq"
import { getRedis } from "lib/redis/redis";

let bookingQueue:Queue|null=null

export function getBookingQueue():Queue {
  if (!bookingQueue) {
    bookingQueue = new Queue('booking', {
      connection: getRedis(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000, // Start with 1s, then 2s, 4s
        },
        removeOnComplete: {
          age: 3600, // Keep for 1 hour
          count: 100,
        },
        removeOnFail: {
          age: 86400, // Keep failed jobs for 1 day
        },
      },
    });
  }
    return bookingQueue
}