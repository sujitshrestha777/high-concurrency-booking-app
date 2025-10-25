// apps/queue/test.ts
import { bookingQueue } from "./queues/booking.queue.js";
function getRandomSeatId() {
  const seatTypes = ["A", "B",];
  const row =  Math.floor(Math.random()*88)+1
    const type = seatTypes[Math.floor(Math.random() * seatTypes.length)];
  return `${row}${type}`;
}

(async () => {
  for (let i = 0; i < 10; i++) {
    await bookingQueue.add("booking", {
      userId: 'cma6td4xb0003usns9hg3ral2',
      seatId:getRandomSeatId(),
    });
  }

  console.log("✅ 10 fake jobs added");
})();
