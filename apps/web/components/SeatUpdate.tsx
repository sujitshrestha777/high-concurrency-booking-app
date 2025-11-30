import { useState, useEffect } from "react";

interface SeatMessage {
  status: string;
  seatId: string;
}

export function SeatUpdate() {
  const [data, setData] = useState<SeatMessage[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const message: SeatMessage = JSON.parse(event.data);
      console.log("from ws server:", message);
      setData((prev) => [...prev, message]);
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      <h1>Messages</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            Type: {item?.status}, Seat: {item?.seatId}
          </li>
        ))}
      </ul>
    </div>
  );
}
