import { useState, useEffect } from "react";

export function SeatUpdate() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/socket");

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(newData);
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  return <div>{data ? JSON.stringify(data) : "Loading..."}</div>;
}
