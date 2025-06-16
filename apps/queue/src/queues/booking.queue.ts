import { Queue } from "bullmq";
import { redisConnection } from "../utils/redis";

export const bookingQueue=new Queue("booking",{
    connection:redisConnection,
})