// apps/queue/test.ts
import { bookingQueue } from "./queues/booking.queue.js";

(async () => {
  for (let i = 0; i < 10; i++) {
    await bookingQueue.add("booking", {
      userId: i,
      seatId: i % 500,
    });
  }

  console.log("✅ 10 fake jobs added");
})();
