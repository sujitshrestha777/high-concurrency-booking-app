// apps/queue/test.ts
import { bookingQueue } from "./queues/booking.queue.js";
function getRandomSeatId() {
  const seatTypes = ["A", "B", "C"];
  const row =  Math.floor(Math.random()*88)+1
    const type = seatTypes[Math.floor(Math.random() * seatTypes.length)];
  return `${row}${type}`;
}

(async () => {
  for (let i = 0; i < 10; i++) {
    await bookingQueue.add("booking", {
      userId: i,
      seatId:getRandomSeatId(),
    });
  }

  console.log("✅ 10 fake jobs added");
})();
