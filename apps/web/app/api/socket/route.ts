// export async function GET(request: Request) {
//   const redis = await getRedis();
//   let closed = false;

//   const stream = new ReadableStream({
//     async start(controller) {
//       const safeSend = (msg: string) => {
//         if (closed) return;
//         try {
//           controller.enqueue(msg);
//         } catch {
//           // ignore errors if already closed
//         }
//       };

//       // 1. Initial connection
//       safeSend(`data: ${JSON.stringify({ message: "connected" })}\n\n`);

//       // 2. Subscribe Redis
//       await redis.subscribe("SeatUpdateRealtime", (channel, message) => {
//         safeSend(`data: ${message}\n\n`);
//       });

//       // Interval heartbeat
//       const interval = setInterval(() => {
//         safeSend(
//           `data: ${JSON.stringify({
//             time: new Date().toISOString(),
//             data: "Live update",
//           })}\n\n`
//         );
//       }, 1000);

//       // 3. Handle disconnect
//       const abortHandler = async () => {
//         closed = true;
//         clearInterval(interval);
//         try {
//           await redis.unsubscribe("SeatUpdateRealtime");
//         } catch {}
//         try {
//           controller.close();
//         } catch {}
//       };

//       request.signal.addEventListener("abort", abortHandler);
//     },
//   });

//   return new Response(stream, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache, no-transform",
//       "Connection": "keep-alive",
//     },
//   });
// }
