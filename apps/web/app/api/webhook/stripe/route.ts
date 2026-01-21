import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Queue } from "bullmq";
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
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!' );
      const { userId, seatId, classType, date, time } = paymentIntent.metadata;
      console.log(`Booking ID: , User ID: ${userId}, Seat ID: ${seatId}  :`,paymentIntent.metadata);

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

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}