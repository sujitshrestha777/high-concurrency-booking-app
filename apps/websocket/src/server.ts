// src/server.ts
import WebSocket, { WebSocketServer } from 'ws';
import Redis from 'ioredis';

const wss = new WebSocketServer({ port: 8080 });
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');


const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected. Total:', clients.size);

  ws.send(JSON.stringify({
    type: 'connected',
    message: 'WebSocket connected successfully'
  }));


  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected. Total:', clients.size);
  });


  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});


redis.subscribe('SeatUpdateRealtime', (err, count) => {
  if (err) {
    console.error('Failed to subscribe:', err);
  } else {
    console.log(`Subscribed to ${count} channel(s)`);
  }
});

redis.on('message', (channel, message) => {
  if (channel === 'SeatUpdateRealtime') {
    try {
      const seatUpdate = JSON.parse(message);
      
     
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'seat_update',
            data: seatUpdate,
            timestamp: Date.now()
          }));
        }
      });
      
      console.log('Broadcast seat update:', seatUpdate.seatId);
    } catch (error) {
      console.error('Error processing Redis message:', error);
    }
  }
});

// Redis connection events
redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (error) => {
  console.error('Redis error:', error);
});

console.log('WebSocket server running on port 8080');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  redis.disconnect();
  wss.close();
  process.exit(0);
});