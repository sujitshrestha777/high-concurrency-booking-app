import type { NextApiRequest, NextApiResponse } from "next";
import { WebSocketServer } from "ws";
import type { Server as HTTPServer } from "http";
import type { Socket } from "net";
import { getRedis } from "lib/redis/redis";

type ExtendedSocket=Socket&{
    server:HTTPServer &{
        wss?:WebSocketServer
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const socket = res.socket as ExtendedSocket | null;
  
  if (!socket) {
    res.status(500).json({ error: "Socket unavailable" });
    return;
  }

  

  if (!socket.server.wss) {
    console.log("Initializing WebSocket server...");

    socket.server.wss = new WebSocketServer({ server: socket.server });
       
    socket.server.wss.on("connection", (ws) => {
      console.log("🟢 Client connected");
      ws.send("Welcome from WS!");

    });
  }
     
    const redisSub=await getRedis()
    await redisSub.connect();

    await redisSub.subscribe("SeatUpdates",(message)=>{
         console.log("📡 Received from Redis:", message);
         socket.server.wss!.clients.forEach((client)=>{
            if(client.readyState===WebSocket.OPEN){
                client.send(message)
            }
         })
    })


 

  res.end();
}