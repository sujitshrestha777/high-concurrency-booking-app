
import { Worker } from "bullmq";
import { redisConnection } from "./utils/redis.js";
import { processBooking } from "./jobs/bookingRequest.job.js";
import { bookingConfirmationJob } from "./jobs/bookingConfirm.job.js";
// import { prisma } from "@repo/db";

// async function example() {
//   const users = await prisma.user.findMany();
//   console.log(users);
// }

const bookingWorker = new Worker("booking", processBooking, {
  connection: redisConnection,
});

const paymentWorker =new Worker("paymentsuccess",bookingConfirmationJob,{
    connection:redisConnection,
})

console.log("🎯 Booking worker is running...",bookingWorker.name);



bookingWorker.on("completed", (job) => console.log(`✅ Job ${job.id} completed`));
bookingWorker.on("failed", (job, err) => console.error(`❌ Job ${job?.id} failed:`, err));

bookingWorker.waitUntilReady().then(() => console.log("🎯 Worker ready"));

console.log("🎯 Booking worker is running...",paymentWorker.name);
paymentWorker.on("completed", (job) => console.log(`✅ Payment Job ${job.id} completed`));
paymentWorker.on("failed", (job, err) => console.error(`❌ Payment Job ${job?.id} failed:`, err));

paymentWorker.waitUntilReady().then(() => console.log("🎯 Payment Worker ready"));