
import { Worker } from "bullmq";
import { redisConnection } from "./utils/redis.js";
import { processBooking } from "./jobs/booking.job.js";
// import { prisma } from "@repo/db";

// async function example() {
//   const users = await prisma.user.findMany();
//   console.log(users);
// }

const bookingWorker = new Worker("booking", processBooking, {
  connection: redisConnection,
});

console.log("🎯 Booking worker is running...",bookingWorker.name);

bookingWorker.on("completed", (job) => console.log(`✅ Job ${job.id} completed`));
bookingWorker.on("failed", (job, err) => console.error(`❌ Job ${job?.id} failed:`, err));

bookingWorker.waitUntilReady().then(() => console.log("🎯 Worker ready"));