import WebSocket, { WebSocketServer } from 'ws';
import Redis from 'ioredis';

const wss = new WebSocketServer({ port: 8080 });
const redisPubSub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = new Redis(REDIS_URL);

const clients = new Set<WebSocket>();
const paymentUsers=new Map<string, WebSocket>();

wss.on('connection', async(ws) => {
  clients.add(ws);
  console.log('Client connected. Total:', clients.size);

  ws.send(JSON.stringify({
    type: 'connected',
    message: 'WebSocket connected successfully'
  }));

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());  
      console.log("message from client in websocket server:",data);
      if(data.type==="payment_initiated"){
        const {userId}=data;
        paymentUsers.set(userId,ws);
        console.log(`Payment initiated by user ${userId}, WebSocket stored for real-time updates.`);

        const poll = setInterval(async () => {

        const statusdata = await redisClient.get(`payment-status:${userId}`);
        console.log(`Polled payment status for user ${userId}:`, statusdata);
        if (statusdata) {
          const status = JSON.parse(statusdata);
          ws.send(JSON.stringify({
            type: status.type,
            message: status.message
        }));
          console.log(`Sent payment status update to user ${userId}:`, status); 
          await redisClient.del(`payment-status:${userId}`);  
          clearInterval(poll); 
        }
      }, 2000);
            }
    } catch (error) {
      console.error('Error processing message from client:', error);
    } 
  });

  const lockkeys= await redisClient.keys('lock:seat:*')
  let initialSeatLocks=[{seatId:'24E', TTL:Date.now()+60*1000},{seatId:'25E', TTL:180}];  
  for (const keys of lockkeys){
    const seatId= keys.replace('lock:seat:','');
    const lockedUserId=await redisClient.get(keys);
    const ttl=await redisClient.ttl(keys);
    console.log(`Seat ${seatId} is locked by user ${lockedUserId} with TTL ${ttl}`);
    if(ttl>0){
      initialSeatLocks.push({
        seatId, 
        // userId:lockedUserId,
        // type:"Locked",
        TTL:Date.now()+ttl*1000
      })
    }
  }

  if(initialSeatLocks.length>0){
    
    ws.send(JSON.stringify({
      type: 'initial_seat_locks',
      data: initialSeatLocks,
    }));
  }
  console.log("initial seat locks sent to client:",initialSeatLocks);

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected. Total:', clients.size);
  });


  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});


redisPubSub.subscribe('SeatUpdateRealtime', (err, count) => {
  if (err) {
    console.error('Failed to subscribe:', err);
  } else {
    console.log(`Subscribed to ${count} channel(s)`);
  }
});

redisPubSub.on('message', (channel, message) => {
  if (channel === 'SeatUpdateRealtime') {
    try {
      const seatUpdate = JSON.parse(message);
      
     console.log("message from pub in websocket server:",seatUpdate)
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: seatUpdate.type,
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
redisPubSub.on('connect', () => {
  console.log('Connected to Redis');
});

redisPubSub.on('error', (error) => {
  console.error('Redis error:', error);
});

console.log('WebSocket server running on port 8080');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  redisPubSub.disconnect();
  wss.close();
  process.exit(0);
});