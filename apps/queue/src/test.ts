// apps/queue/test.ts
import { bookingQueue } from "./queues/booking.queue";

(async () => {
  for (let i = 0; i < 100; i++) {
    await bookingQueue.add("book-seat", {
      userId: i,
      seatId: i % 500,
    });
  }

  console.log("✅ 100 fake jobs added");
})();
