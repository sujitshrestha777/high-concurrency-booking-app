import { Queue } from "bullmq";
import { redisConnection } from "../utils/redis.js";

export const bookingQueue=new Queue("booking",{
    connection:redisConnection,
})