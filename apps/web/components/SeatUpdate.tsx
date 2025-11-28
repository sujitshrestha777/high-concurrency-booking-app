"use client";
import React, { useEffect, useState } from "react";

export const SeatUpdate = () => {
  const [messages, setMessages] = useState<string[]>([]);
  useEffect(() => {
    fetch("/api/sockets");
    const ws = new WebSocket(`ws://${window.location.host}/api/socket`);

    ws.onmessage = (e) => {
      setMessages((prev) => [...prev, e.data]);
    };
    return () => {
      ws.close();
    };
  }, []);
  return (
    <>
      {messages.map((message, i) => (
        <div key={i}>message</div>
      ))}
    </>
  );
};
