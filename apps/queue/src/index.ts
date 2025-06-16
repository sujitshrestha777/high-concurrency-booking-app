
import { Worker } from "bullmq";
import { redisConnection } from "./utils/redis";
import { processBooking } from "./jobs/booking.job";

const bookingWorker = new Worker("booking", processBooking, {
  connection: redisConnection,
});

console.log("🎯 Booking worker is running...");
