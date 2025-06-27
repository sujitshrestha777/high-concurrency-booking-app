
import { Worker } from "bullmq";
import { redisConnection } from "./utils/redis";
import { processBooking } from "./jobs/booking.job";
import { prisma } from "@repo/db";

async function example() {
  const users = await prisma.user.findMany();
  console.log(users);
}

const bookingWorker = new Worker("booking", processBooking, {
  connection: redisConnection,
});

console.log("🎯 Booking worker is running...");
