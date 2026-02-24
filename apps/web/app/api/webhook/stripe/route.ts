import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Queue, tryCatch } from "bullmq";
import { getRedis } from 'lib/redis/redis';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const paymentQueue = new Queue("paymentsuccess", {
        connection: getRedis(),
      });

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout Session completed:', session);
      break;

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent was successful!',paymentIntent.id,paymentIntent );
      const { userId, seatId, classType, date, time } = paymentIntent.metadata;
      console.log(`Booking ID: , User ID: ${userId}, Seat ID: ${seatId}  :`,paymentIntent.metadata);

      try {
        let redis = getRedis();
        const redisUserID = await redis.get(`lock:seat:${seatId}`);
        if (redisUserID !== userId) {
          console.warn(`User ID mismatch for seat ${seatId}: expected ${redisUserID}, got ${userId}`);
           await stripe.refunds.create({ 
              payment_intent: paymentIntent.id,
              reason: 'requested_by_customer',
            });
            await redis.set(`payment-status:${userId}`, JSON.stringify({
              type: "bookingFailed",
              message: "Payment failed due to seat lock mismatch"
            }), 'EX', 60);

        //  await redis.publish("SeatpaymentFailed",JSON.stringify({
        //     seatId,
        //     userId,
        //     type:"notLockedByUser" 
        //   }))
          break;
        } 
      } catch (error) {
        console.error("Error checking Redis user ID:", error);
        await paymentQueue.add("test-payment", {
          bookingId: "booking_123",
          userId, 
          seatId,
          status: "FAILED",
        });
        break;
      }

    try {
        await paymentQueue.add("test-payment", {
          bookingId: "booking_123",
          userId,
          seatId,
          status: "SUCCESS",
        }); 
    } catch (error) {
      console.error("Error adding payment job to queue:", error);
      await paymentQueue.add("test-payment", {
        bookingId: "booking_123",
        userId,
        seatId,
        status: "FAILED",
      });
    }
     console.log("✅ Test payment job added");

      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment);
      break;
    case 'charge.refunded':
      let redis = getRedis();
      const charge = event.data.object;
      const { userId : user_id, seatId:seat_id } = charge.metadata;
      console.log('Refund successful!', charge.id);
      await redis.publish("SeatpaymentFailed",JSON.stringify({
            seatId: seat_id,
            userID: user_id,
            type:"notLockedByUser" 
          }))
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}